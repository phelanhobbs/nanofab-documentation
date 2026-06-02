const M = require("../meta");

module.exports = {
  filename: "Pico-Firmware.pptx",
  title: "Pico Firmware",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "Pico Firmware",
      subtitle: "The little programs on the Raspberry Pi sensors that feed the server.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the firmware — the small always-on programs — running on the Raspberry Pi Pico boards around the cleanroom. " +
        "They're the field agents that turn machines and rooms into live data on the website. No coding background needed. We'll cover what a " +
        "Pico is, the rhythm every one follows, the three workhorse programs, the helpers, and a couple that are unfinished.",
    });

    d.bullets({
      title: "What is a Pico, and what is 'firmware'?",
      bullets: [
        "A Raspberry Pi Pico W is a tiny WiFi computer — about the size of a stick of gum.",
        "No screen or keyboard; it just runs one program forever.",
        "'Firmware' = the program that runs directly on such a small device.",
        "These run MicroPython, a slim version of the Python language for tiny computers.",
      ],
      notes:
        "Define the basics. A Pico W is a tiny, cheap computer with WiFi but no screen — it runs a single program continuously. The program is " +
        "called firmware. Ours are written in MicroPython, a stripped-down Python made to fit on tiny hardware. Each Pico sits near a machine " +
        "or in a room, reads a sensor, and reports over WiFi.",
    });

    d.steps({
      title: "The rhythm every Pico follows",
      steps: [
        { h: "Connect to WiFi", d: "join the lab's ULink network." },
        { h: "Read the sensor", d: "particles, a gauge voltage, or a value over a cable." },
        { h: "Package it", d: "wrap the numbers with room, sensor, and timestamp." },
        { h: "Send to the server", d: "post to the matching sensor address." },
        { h: "Wait and repeat", d: "sleep an interval, then do it again — forever." },
      ],
      notes:
        "Every networked Pico follows the same five-step loop: connect to WiFi, read its sensor, package the reading with its identity and the " +
        "time, send it to the server, then sleep and repeat. They run unattended, so most also blink a status light and reset themselves if " +
        "something goes wrong. If you understand this loop, you understand all of them.",
    });

    d.table({
      title: "The programs in this group",
      headers: ["File", "Reads", "Sends to"],
      rows: [
        ["Particle_sensor.py", "SPS30 dust sensor", "/particle-data"],
        ["PicoParylene.py", "Parylene gauges (3)", "/sdsanalog"],
        ["PicoDenton18.py", "Denton 18 vacuum gauges", "/denton18pump"],
        ["VGC083C_Monitor.py", "VGC vacuum controller", "(a /api/VGC address)"],
        ["ParticleSensor.py", "SPS30 — prints only", "nothing (bench test)"],
        ["PicoConnect.py", "nothing — WiFi check", "nothing (diagnostic)"],
      ],
      colW: [3.7, 4.6, 3.6],
      notes:
        "The roster. The top three are the real workhorses that send data. The bottom three are helpers: a no-network bench readout, and a " +
        "WiFi connectivity tester. Don't read every row; point out that three send data and three are helpers/tests. The exact endpoints are " +
        "the same ones from the server's Sensor API session.",
    });

    d.bullets({
      title: "Particle_sensor.py — the reference one",
      intro: "The most complete firmware; the template for new sensors.",
      bullets: [
        "Reads an SPS30, which counts dust particles by size.",
        "Sends every 15 minutes, aligned to the clock.",
        "Keeps its clock accurate via internet time servers.",
        "Runs self-checks and blinks status codes on the light.",
      ],
      notes:
        "Particle_sensor.py is the gold standard. It reads the SPS30 particle sensor, converts the counts into the units the server wants, and " +
        "sends on a clean 15-minute schedule. It syncs its clock so timestamps are right, runs self-diagnostics (WiFi, network, sensor), and " +
        "signals status with the onboard light. When someone builds a new sensor, this is the file they copy.",
    });

    d.code({
      title: "What it sends",
      intro: "A particle reading, packaged as structured data:",
      code:
'  {\n' +
'    room_name: "LTDirtyTest",\n' +
'    sensor_number: "006",\n' +
'    timestamp: <now>,\n' +
'    raw_measurements: { mass_pm2_5, ... },\n' +
'    converted_values: { number_concentrations_ft3, ... }\n' +
'  }   →  POST /particle-data',
      caption: "Identity + time + measurements — exactly what the server expects.",
      notes:
        "Show the shape of an outgoing reading. It carries which room and sensor it's from, the time, and the measurements grouped into raw " +
        "and converted values. This matches the server's /particle-data handler one-to-one — the firmware and the server agree on the format. " +
        "The room and sensor labels are written into the file before the board is installed.",
    });

    d.bullets({
      title: "PicoParylene.py — the Parylene coater",
      bullets: [
        "Reads three analog gauges: pressure, vapor, and temperature.",
        "Samples fast, so it sends data in batches, not one point at a time.",
        "Posts batches to /sdsanalog; sends 'finished' when a run ends.",
        "Even flashes Morse code on the status light.",
      ],
      notes:
        "The Parylene coater is sampled several times a second, too fast to send each point individually. So this firmware groups readings " +
        "into batches and posts them to /sdsanalog, then signals 'finished' so the server can stitch the batches into one clean file per run. " +
        "It's a nice example of adapting to a fast data source. The Morse-code light is a fun touch for status at a glance.",
    });

    d.bullets({
      title: "PicoDenton18.py — the evaporator (unfinished)",
      bullets: [
        "Reads two vacuum gauges (capacitance + ion) and sends the right one.",
        "Posts to /denton18pump; sends 'finished' at the end of a run.",
        "Not runnable as-is: a couple of settings are left undefined.",
        "On the fix list — see the developer notes.",
      ],
      notes:
        "Be honest about this one. The design is sound — read two gauges, send whichever suits the current pressure, signal finished — but it " +
        "won't run as committed: two threshold settings are referenced but never defined, the WiFi password is a placeholder, and an internal " +
        "flag doesn't work as intended. It's documented in the developer notes and the issues list with exactly what to fix.",
    });

    d.twocol({
      title: "The helpers",
      left: {
        heading: "ParticleSensor.py",
        items: [
          "Same SPS30 reading code.",
          "Prints the numbers instead of sending.",
          "For testing a sensor on a bench.",
        ],
      },
      right: {
        heading: "PicoConnect.py",
        items: [
          "Only tests the WiFi connection.",
          "Lights the LED if it connects.",
          "First thing to try on a 'dead' board.",
        ],
      },
      notes:
        "Two diagnostics worth knowing. ParticleSensor.py (note the slightly different name) runs the same sensor code but just prints values " +
        "— good for bench-testing a sensor without the network. PicoConnect.py does nothing but check WiFi and light the LED if it works — the " +
        "first thing to run when a board seems dead, to rule out WiFi versus power versus the sensor cable. There's also VGC083C_Monitor.py, a " +
        "serial-cable gauge reader that's currently incomplete.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Room/sensor labels are set before install — a mislabeled board reports to the wrong place.",
        "No login: they're trusted because they're on the private lab network.",
        "If a Pico goes quiet, suspect WiFi, power, or the sensor cable.",
        "Two files (PicoDenton18, VGC083C) are works-in-progress.",
      ],
      notes:
        "Practical operating notes. The identity labels matter — install a board with the wrong label and its data lands under the wrong " +
        "room/sensor. They skip login because they're on the trusted private network. When one stops reporting, the usual causes are WiFi, " +
        "power, or a loose sensor cable — and PicoConnect helps isolate WiFi. Finally, two of these files are unfinished and shouldn't be " +
        "relied on until the documented fixes are made.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Picos are tiny WiFi computers running MicroPython firmware.",
        "Each follows the same loop: connect, read, package, send, repeat.",
        "Particle_sensor.py is the complete reference; PicoParylene batches fast data.",
        "Helpers test sensors and WiFi; two files are still unfinished.",
      ],
      notes:
        "Wrap up. These small programs are why the website has live data — they're the always-on field agents. The reference firmware is " +
        "Particle_sensor.py; copy it for new sensors. Helpers exist for testing, and the developer notes flag exactly what's unfinished. " +
        "Questions welcome.",
    });
  },
};
