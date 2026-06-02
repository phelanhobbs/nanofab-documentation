const M = require("../meta");

module.exports = {
  filename: "Particle-PC-Tools.pptx",
  title: "Particle PC Tools",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "Particle PC Tools",
      subtitle: "The desktop viewer and the test-data generator.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers two PC programs that work with the particle-sensor data: a desktop viewer that shows the readings, and a " +
        "generator that invents realistic test data. One reads from the server, one writes to it. No coding background needed. Together they " +
        "let staff watch the data and let developers test the system without waiting on real sensors.",
    });

    d.twocol({
      title: "Two tools, opposite directions",
      left: {
        heading: "particle_data_viewer.py",
        items: [
          "A desktop app with a map and tables.",
          "Shows the live readings.",
          "Reads from the server.",
        ],
      },
      right: {
        heading: "generate_test_particle_data.py",
        items: [
          "Invents realistic fake readings.",
          "Sends them to the server.",
          "Writes to the server (for testing).",
        ],
      },
      notes:
        "Frame the pair. The viewer is what a person opens to look at the data — a dashboard. The generator is a behind-the-scenes tool that " +
        "manufactures believable fake readings and posts them, so the system can be tested and demoed without real sensors. One consumes data, " +
        "the other produces it — both through the same /particle-data endpoint the real sensors use.",
    });

    d.bullets({
      title: "The viewer: what you see",
      bullets: [
        "A map of the cleanroom, each bay and lab drawn as a labeled box.",
        "A table of the current readings beside it.",
        "A Refresh button to pull the latest data.",
        "Boxes can be color-coded by air quality — glance to spot trouble.",
      ],
      notes:
        "Describe the viewer's window. On one side, a map of the cleanroom with each room as a box; on the other, a table of current readings; " +
        "and a Refresh button. The room boxes can be colored by air quality, so a glance at the map shows where particle counts are high. " +
        "It's a purpose-built dashboard for the particle data.",
    });

    d.bullets({
      title: "The viewer: how it works",
      bullets: [
        "Asks the server: 'what are the current readings?'",
        "Draws the answer onto the map and table.",
        "Double-click a sensor to open its history chart.",
        "Stores nothing itself — the server is the source of truth.",
      ],
      notes:
        "Under the hood it's simple: it asks the server for the current readings and renders them; double-clicking a sensor asks for that " +
        "sensor's full history and charts it. It keeps no data of its own — it's a window onto the server. This is the same idea as the " +
        "particle viewer in the separate NanofabToolkit; this copy lives in the main repository (and the two have drifted, which the developer " +
        "notes flag).",
    });

    d.bullets({
      title: "A quirk worth knowing",
      bullets: [
        "The viewer adds 7 hours to timestamps to match local time.",
        "It's a workaround for a time-zone mismatch in the stored data.",
        "Not a clean fix — times can look off around daylight-saving changes.",
        "Flagged in the developer notes to fix properly.",
      ],
      notes:
        "One honest caveat. To line up with Mountain Time, the viewer simply adds seven hours to each timestamp. That's a band-aid over a " +
        "deeper issue — the server stores times without zone information — and it'll be off by an hour during daylight-saving time. If " +
        "displayed times ever look wrong, this is why. The developer notes recommend fixing time handling at the source.",
    });

    d.bullets({
      title: "The generator: why fake data?",
      bullets: [
        "Real sensors report slowly; you can't dirty the cleanroom on demand.",
        "So this tool simulates several sensors with realistic baselines.",
        "Clean room = very low counts; fume hood = higher; office in between.",
        "It adds gentle, believable trends — not just random noise.",
      ],
      notes:
        "Motivate the generator. To develop and demo the displays you need lively data, but real sensors are slow and you can't make the room " +
        "dirty to test. So the generator defines pretend sensors — a clean room, a main lab, a fume-hood area, an office — each with a " +
        "realistic baseline and natural variation, and produces readings that drift believably over time rather than jumping randomly.",
    });

    d.code({
      title: "What the generator pretends to be",
      intro: "A few of its built-in synthetic sensors:",
      code:
'  CLEAN_ROOM_01  → room CLEANROOM     baseline pm2.5 ~2.0  (very clean)\n' +
'  LAB_MAIN       → room MAIN_LAB      baseline pm2.5 ~8.0  (typical lab)\n' +
'  LAB_HOOD       → room FUME_HOOD     baseline pm2.5 ~15.0 (busy area)\n' +
'  OFFICE         → room OFFICE_SPACE  baseline pm2.5 ~12.0 (office air)',
      caption: "Each pretend sensor has a realistic baseline and natural variation.",
      notes:
        "Show the synthetic sensors so the realism is concrete. Each has a baseline particle level appropriate to its setting and a degree of " +
        "variation. The cleanroom sits very low, the fume-hood area higher, and so on. The output is shaped exactly like a real Pico's, so the " +
        "rest of the system can't tell the difference — which is the point.",
    });

    d.bullets({
      title: "When to use each",
      bullets: [
        "Viewing real data → open particle_data_viewer.py.",
        "Testing or demoing without hardware → run the generator against a test server.",
        "Then watch the viewer or website fill up with the fake data.",
        "Never aim the generator at production — it would pollute real data.",
      ],
      notes:
        "Give the decision rule. Use the viewer to look at real readings. Use the generator when you need data and have no hardware — but " +
        "point it at a test server, never production, or you'll mix fake readings into the real record. The developer notes recommend a safety " +
        "guard so that can't happen by accident.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "The viewer only reads; the generator only writes fake data.",
        "Neither touches real sensor hardware.",
        "The viewer needs the PyQt desktop toolkit installed.",
        "The generator defaults to a local test server.",
      ],
      notes:
        "Closing practicalities. The viewer is read-only; the generator only produces test data — neither affects the physical sensors. The " +
        "viewer needs the PyQt graphics toolkit installed to run. The generator points at localhost by default. Keep the generator pointed at " +
        "test environments.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Viewer: a desktop dashboard of live particle data (map + history).",
        "Generator: realistic fake data for testing without hardware.",
        "Both use the same /particle-data endpoint — one reads, one writes.",
        "Mind the timezone quirk and keep the generator off production.",
      ],
      notes:
        "Wrap up. Two complementary PC tools: one to watch the particle data, one to manufacture it for testing. They bracket the server — the " +
        "generator stands in for sensors, the viewer stands in for the website. Two things to remember: the timezone band-aid and keeping the " +
        "generator away from production. Questions welcome.",
    });
  },
};
