const M = require("../meta");

module.exports = {
  filename: "PicoHelperTools.pptx",
  repo: "NanofabToolkit",
  title: "PicoHelperTools",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "PicoHelperTools",
      subtitle: "The small Pico programs that feed the cleanroom's sensor data.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers PicoHelperTools — the small programs that run on the Raspberry Pi Pico boards installed around the cleanroom. " +
        "These NanofabToolkit copies are the current versions of the firmware. No coding background needed. We'll cover what a Pico is, the " +
        "three programs in this folder, the rhythm they all follow, and the few details worth knowing for whoever maintains them.",
    });

    d.bullets({
      title: "What is a Pico, and what is 'firmware'?",
      bullets: [
        "A Raspberry Pi Pico W is a tiny, inexpensive WiFi computer — about gum-stick sized.",
        "No screen, no keyboard; it just runs one program continuously.",
        "'Firmware' = the program that runs directly on a small device like this.",
        "These run MicroPython, a slimmed-down version of Python made for tiny computers.",
      ],
      notes:
        "Set the foundation. A Pico is a cheap, small computer with WiFi and no display. Firmware is the program loaded onto it, which runs " +
        "by itself the moment the board has power. The language is MicroPython — same Python you'd read elsewhere, just a slimmer dialect that " +
        "fits on tiny hardware. Each Pico sits near a machine or in a room, reads a sensor, and reports to the cleanroom server over WiFi.",
    });

    d.table({
      title: "The three firmware programs",
      headers: ["File", "Reads", "Sends to"],
      rows: [
        ["Particle_sensor.py", "An SPS30 air-particle sensor", "/particle-data"],
        ["DHT22_sensor.py", "A DHT22 temperature & humidity sensor", "/env-data"],
        ["sensor_combined.py", "Both sensors on one Pico", "/sensor-data"],
      ],
      colW: [3.8, 4.5, 3.6],
      notes:
        "The roster. Three programs, each for a slightly different hardware setup. Use Particle_sensor for boards that only have an SPS30 " +
        "particle sensor; DHT22_sensor for boards that only have a DHT22 temperature/humidity sensor; and sensor_combined when a board has " +
        "both. The 'combined' file is the newest pattern and the one you'd pick for a new deployment.",
    });

    d.steps({
      title: "The rhythm every Pico follows",
      steps: [
        { h: "Connect to WiFi", d: "join the lab's ULink network at boot." },
        { h: "Sync the clock", d: "ask an internet time server so timestamps are right." },
        { h: "Read the sensor", d: "every 15 seconds during a measurement window." },
        { h: "Wait for the next scheduled minute", d: ":00, :15, :30, or :45 by default." },
        { h: "Send to the server", d: "post a JSON message over the encrypted connection." },
        { h: "Repeat — forever", d: "a watchdog timer resets the board if something hangs." },
      ],
      notes:
        "Walk the loop. Connect, sync the clock, read, wait until the scheduled minute, send, repeat. The 'scheduled' bit is important: every " +
        "Pico fires at the same minute past the hour, regardless of when it powered on, so all the readings line up. A watchdog timer is " +
        "running quietly the whole time — if anything hangs for more than about 8 seconds, the board resets itself.",
    });

    d.code({
      title: "What a particle reading looks like on the wire",
      intro: "An SPS30 reading wrapped up as JSON before sending:",
      code:
'  {\n' +
'    "room_name":     "Bay C",\n' +
'    "sensor_number": "009",\n' +
'    "timestamp":     1734567890.0,\n' +
'    "raw_measurements":  { "mass_pm2_5": 4.1, ... },\n' +
'    "converted_values":  { "number_concentrations_ft3": { ... },\n' +
'                            "differential_bins_ft3":     { ... },\n' +
'                            "mass_concentrations_ug_m3": { ... } }\n' +
'  }',
      caption: "Identity, time, and the measurements — exactly what the server expects.",
      notes:
        "Make the contract concrete. Each message carries the room and sensor labels (baked into that Pico), the time, and the readings — " +
        "both the raw numbers from the sensor and the converted units the website uses. The server doesn't need to ask the Pico anything else; " +
        "the message is self-describing. The DHT22 and combined firmware send the same shape with the relevant fields swapped or added.",
    });

    d.twocol({
      title: "What's different about these versions",
      left: {
        heading: "Resilience",
        items: [
          "Headless-safe printing (no crash without USB host).",
          "Local error log capped at ~4 KB.",
          "Watchdog-aware sleeps during long waits.",
        ],
      },
      right: {
        heading: "Scheduled, aligned reporting",
        items: [
          "Sends at :00, :15, :30, :45 — not when the board booted.",
          "All boards in a room report at the same times.",
          "Easier to compare data across sensors.",
        ],
      },
      notes:
        "Highlight what makes these the right copies to flash today. They're built for unattended operation: print calls survive a missing " +
        "USB host, errors are written to a small local log on the Pico that can't fill up flash, and long waits feed the watchdog so a healthy " +
        "program isn't killed by accident. And every board sends on the same clock-aligned schedule, which makes data comparison much cleaner.",
    });

    d.bullets({
      title: "Per-board identity (and the gotcha)",
      bullets: [
        "Each board carries a ROOM_NAME and SENSOR_NUMBER in its code.",
        "These travel with every reading; the server uses them as the data key.",
        "They're hand-edited before flashing — easy to forget.",
        "Mislabel a Pico → its data shows up under the wrong room.",
      ],
      notes:
        "The single most common deployment mistake. Each Pico is configured with a room and sensor number before being flashed. Those labels " +
        "are stamped on every reading. The server doesn't validate them — it just files the data under whatever the Pico said it was. Get the " +
        "label wrong and a board can be installed in Bay C but report under Bay B. The recommendation in the developer notes is to add a " +
        "startup self-report so mislabels are visible quickly.",
    });

    d.bullets({
      title: "Setting up a new Pico",
      bullets: [
        "Wire the sensor per the diagram at the top of the file.",
        "Edit four constants: WIFI_SSID / WIFI_PASSWORD / ROOM_NAME / SENSOR_NUMBER.",
        "Copy the file to the Pico as main.py and reboot.",
        "Watch the LED for the boot sequence, then check the website.",
      ],
      notes:
        "The deployment recipe. Wire the sensor, edit four things at the top of the right file, copy it to the Pico as main.py, and reboot. " +
        "The onboard LED blinks status codes so you can tell from across the room whether the board got WiFi, read the sensor, and successfully " +
        "sent. Within about 30 seconds you should see the first reading in the particle viewer or on the website.",
    });

    d.bullets({
      title: "Things on the maintenance list",
      bullets: [
        "WiFi password is currently in plain text in each file — move to a separate, ignored picopass.py.",
        "Daylight Saving Time isn't auto-handled; the UTC offset must be flipped twice a year.",
        "The watchdog default for the combined firmware is off — flip on for production.",
        "Driver code duplication between Particle_sensor and sensor_combined.",
      ],
      notes:
        "Be honest about the to-fix list. The biggest item is the WiFi password sitting in cleartext — move it into a separate small module " +
        "that's git-ignored. DST isn't handled, so timestamps drift an hour twice a year unless someone updates a constant. The combined " +
        "firmware ships with the watchdog disabled, which should be on in production. And there's duplicated driver code between two files. " +
        "All four are documented in the known-issues file with suggested fixes.",
    });

    d.bullets({
      title: "Where they fit in the system",
      bullets: [
        "These are the producers — they fill the server's sensor data.",
        "The cleanroom server stores everything from each board (current row in DB, full history in CSV).",
        "The ParticleSensor desktop viewer reads it back out for display.",
        "Same room/sensor labels link the three together.",
      ],
      notes:
        "Tie this tool to the rest of the system. The Picos here are the data producers. The cleanroom server (Flask app, in UNanofabTools) " +
        "stores each board's latest reading in the database and the full minute-by-minute history in CSV files. The ParticleSensor desktop " +
        "viewer (the sibling tool we'll cover next) reads back from those server endpoints to draw the live cleanroom map and history charts. " +
        "The room and sensor labels are the join key across the whole pipeline.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Three Pico firmware programs: particle, environmental, and combined.",
        "Hardened for unattended operation: safe printing, capped log, watchdog-aware sleeps.",
        "Aligned scheduled sending makes data lineup easy.",
        "Maintenance focus: cleartext WiFi password, DST, watchdog default, driver duplication.",
      ],
      notes:
        "Wrap up. The PicoHelperTools are small but they carry the whole data feed for particle and environmental sensors. They're built to " +
        "run unattended and recover from common problems. The few items in the known-issues list are real but minor — none of them blocks " +
        "the firmware from working today. Questions welcome.",
    });
  },
};
