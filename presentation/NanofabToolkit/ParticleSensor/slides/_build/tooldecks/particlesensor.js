const M = require("../meta");

module.exports = {
  filename: "ParticleSensor.pptx",
  repo: "NanofabToolkit",
  title: "ParticleSensor",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "ParticleSensor",
      subtitle: "The desktop dashboard for the cleanroom's particle sensors.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers ParticleSensor — the desktop app that turns the live data from the cleanroom's Pico sensors into a map you can " +
        "glance at and a chart you can drill into. This NanofabToolkit copy is the current version. No coding background needed.",
    });

    d.bullets({
      title: "What the window shows",
      bullets: [
        "A map of the cleanroom with each bay and lab drawn as a labeled box.",
        "Inside each box, two tiny squares for temperature and humidity (when reported).",
        "A table beside the map with the latest reading from every sensor.",
        "A Refresh button to pull the freshest data.",
      ],
      notes:
        "Describe what the user actually sees. The map is the headline: every room is a labeled box that color-codes itself based on the " +
        "latest particle reading. The temperature and humidity sub-squares fill in when their sensor is reporting. The table on the side " +
        "lists every sensor's latest reading. Hit Refresh to pull again.",
    });

    d.code({
      title: "How the room boxes are color-coded",
      intro: "A glance at the map tells you which rooms are reporting and roughly how clean they are:",
      code:
"  yellow  →  no data yet\n" +
"  green   →  particle level OK\n" +
"  red     →  particle level high\n" +
"\n" +
"  inside each room (small inner squares):\n" +
"    yellow  →  temp/humidity sensor hasn't reported\n" +
"    green   →  temp/humidity sensor reporting",
      caption: "The map is a status board, not just a layout — colors carry the news.",
      notes:
        "Make the visual language explicit. Yellow means 'no data yet,' green means 'OK,' red means 'high.' The inner sub-squares carry the " +
        "same yellow/green status for the temperature and humidity sensors. So you can stand back, look at the map, and immediately see which " +
        "rooms haven't reported (yellow), which look fine (green), and which are noisy (red). The env sub-boxes are new in this version — the " +
        "older copy only colored the room as a whole.",
    });

    d.steps({
      title: "A typical session",
      steps: [
        { h: "Open the app", d: "the map appears with rooms in yellow." },
        { h: "Refresh", d: "rooms turn green or red as data arrives." },
        { h: "Browse the table", d: "every sensor's latest reading is listed." },
        { h: "Double-click a sensor", d: "a history window opens with that sensor's chart." },
      ],
      notes:
        "Walk a session. Open the app — the map starts yellow (no data yet). Click Refresh and the latest readings populate; rooms with " +
        "recent particle data change color, env sub-boxes fill in. The table on the side gives the exact numbers. Double-click a sensor and " +
        "its history opens in a new window with a chart you can pan and zoom.",
    });

    d.bullets({
      title: "Where the data comes from",
      bullets: [
        "The viewer asks the cleanroom server for the readings.",
        "Two server addresses: a 'current snapshot' and a 'one sensor's history.'",
        "The data itself was uploaded by the Picos (covered in the PicoHelperTools session).",
        "The server is the source of truth; this app is a window onto it.",
      ],
      notes:
        "Tie this app to the rest of the system. It doesn't have its own sensors — it asks the cleanroom server (the same Flask server the " +
        "Picos send to). One address gives a snapshot of all sensors; another gives one sensor's full history. The Picos produce the data; " +
        "the server stores it; this app reads it back. Same room and sensor labels link everything end to end.",
    });

    d.twocol({
      title: "What's new in this version",
      left: {
        heading: "Better cleanroom display",
        items: [
          "Env-data sub-boxes inside each room.",
          "Standard matplotlib chart toolbar.",
          "Cleaner separation of API and GUI code.",
        ],
      },
      right: {
        heading: "Older copy still exists",
        items: [
          "UNanofabTools has an older particle_data_viewer.",
          "It still works but lacks the env sub-boxes.",
          "Treat the NanofabToolkit copy as canonical.",
        ],
      },
      notes:
        "Be explicit that this is the canonical, newer copy. The newer features: env-data sub-boxes inside each room (so temperature and " +
        "humidity status are visible at a glance), the standard matplotlib navigation toolbar in the history window (Home / Pan / Zoom / Save " +
        "instead of a custom click-and-drag), and cleaner code separation (the API access is its own class so it can be reused from a script). " +
        "The UNanofabTools sibling is the older copy, kept for reference but no longer the one to extend.",
    });

    d.bullets({
      title: "The history window",
      bullets: [
        "Charts one sensor's readings over time.",
        "Standard toolbar: Home, Pan, Zoom, Save.",
        "Optional overlay of temperature/humidity for the same sensor.",
        "Useful for spotting trends a single snapshot can't show.",
      ],
      notes:
        "Cover the drill-down. Double-clicking a sensor opens a chart of that sensor's history. Familiar matplotlib toolbar controls — go " +
        "Home to reset, Pan to scroll, Zoom to a region, Save to write a PNG. Where an env sensor is colocated, you can overlay temperature " +
        "and humidity on the same chart. This is where you go to ask 'did this room actually settle, or just bounce?'.",
    });

    d.bullets({
      title: "A quirk worth knowing (the +7h offset)",
      bullets: [
        "The app adds 7 hours to incoming timestamps to display Mountain Time.",
        "It's a workaround for a time-zone mismatch in the stored data.",
        "Off by one hour during Mountain Daylight Time — flagged in the notes.",
        "The real fix is server-side: store UTC, convert at display time.",
      ],
      notes:
        "Be candid about the time hack. The server stores timestamps without timezone info, so the viewer adds 7 hours to match Mountain " +
        "Standard Time. This is wrong by an hour in Mountain Daylight Time and brittle around DST transitions. The proper fix lives on the " +
        "server side — store UTC and convert with pytz at the display layer. Tracked in the known-issues file.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Read-only — never changes server data.",
        "Network access to the cleanroom server is required.",
        "Encrypted; certificate validation is currently off (internal cert).",
        "Packaged as a Windows executable — no Python install required.",
      ],
      notes:
        "Operational summary. The app only reads, never writes. It needs the cleanroom network. Connections are encrypted but the app skips " +
        "certificate verification because the internal certificate isn't in the standard trust store — fine on the private network, flagged " +
        "for fixing later. It's a single .exe, so users don't need Python.",
    });

    d.bullets({
      title: "Where it fits in the system",
      bullets: [
        "Producers: PicoHelperTools firmware (covered separately).",
        "Server: the Flask app stores latest readings + CSV history.",
        "Consumer: ParticleSensor (this app) reads back for display.",
        "Room/sensor labels are the join key end to end.",
      ],
      notes:
        "Recap the pipeline once more. Picos produce; server stores; this app displays. The room and sensor labels travel with every reading " +
        "and tie the three together — get a label wrong on a board and that board's data shows up in the wrong room here. Consistent labels " +
        "are the contract.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "A live cleanroom map plus a per-sensor history chart.",
        "Color-coded rooms with env-data sub-boxes — at-a-glance status.",
        "Reads from the server; the server reads from the Picos.",
        "Watch the +7h timezone hack and the hard-coded production URL.",
      ],
      notes:
        "Wrap up. ParticleSensor is the desk-side dashboard for the cleanroom's particle and environmental data. The new version's standout " +
        "feature is the inner env-data sub-boxes — much more informative at a glance than the older copy. The two main maintenance items are " +
        "the +7-hour timezone hack and the hard-coded production URL. Questions welcome.",
    });
  },
};
