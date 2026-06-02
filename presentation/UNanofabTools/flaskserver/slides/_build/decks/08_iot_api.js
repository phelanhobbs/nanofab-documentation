const M = require("../meta");

module.exports = {
  filename: "08-IoT-API-Endpoints.pptx",
  title: "The Sensor API",
  build(d) {
    d.title_slide({
      kicker: "PART 08",
      title: "The Sensor API",
      subtitle: M.series + "\nHow Raspberry Pis and shop-floor tools push data into the server.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the 'API' — the set of addresses meant for machines, not people. Raspberry Pi sensors and a couple of " +
        "shop-floor tools send their data here automatically, with no login. We'll cover the five families of endpoint, where the data lands, " +
        "and the trust model that makes 'no login' acceptable. It's a slightly more technical session but stays conceptual.",
    });

    d.bullets({
      title: "What 'the API' means here",
      intro: "Addresses designed for devices to talk to, not for humans to browse.",
      bullets: [
        "Machines send data as JSON or CSV — compact, structured formats.",
        "No login: the devices are trusted because they sit on a private network.",
        "Some endpoints receive data (POST); some hand it back (GET).",
        "Same server as the web pages, just a different set of addresses.",
      ],
      notes:
        "Define API for the audience: it's the machine-facing doorway to the same server. Instead of HTML pages, these addresses exchange " +
        "structured data — JSON (a simple key/value text format) and CSV (spreadsheet rows). There's no login here; we'll justify that " +
        "shortly. Some addresses take data in (a sensor uploading a reading), others give data out (a desktop app fetching history).",
    });

    d.table({
      title: "Five families of endpoint",
      headers: ["Family", "Purpose"],
      rows: [
        ["Particle data", "SPS30 dust sensors upload readings; apps fetch them"],
        ["Environmental data", "DHT22 temperature/humidity readings"],
        ["Combined sensor", "Newer Pis sending particle + temp/humidity together"],
        ["Parylene stream", "The Parylene coater's Pi streams CSV batches"],
        ["Denton 18 pump", "Vacuum-pressure samples during a run"],
      ],
      colW: [3.4, 8.5],
      notes:
        "Five groups cover everything. Particle sensors (SPS30) report dust levels by particle size. Environmental sensors (DHT22) report " +
        "temperature and humidity. Newer combined Pis report both in one message. The Parylene coater streams batches of analog readings as " +
        "CSV. And the Denton 18 evaporator reports vacuum pressure during a pump-down. Each family has its own address and its own storage " +
        "destination, which we'll map next.",
    });

    d.code({
      title: "What a sensor sends",
      intro: "A particle reading arrives as JSON like this (trimmed):",
      code:
'{\n' +
'  "room_name": "HEADLESS",\n' +
'  "sensor_number": "009",\n' +
'  "timestamp": 1747876800,\n' +
'  "raw_measurements": { "mass_pm2_5": 0.0, ... },\n' +
'  "converted_values": {\n' +
'    "number_concentrations_ft3": { "pm2_5": 0.0, ... }\n' +
'  }\n' +
'}',
      caption: "Which room, which sensor, when, and the measurements — nested by category.",
      notes:
        "Show the shape, not every field. A reading says which room and sensor it's from, when it was taken, and then the measurements " +
        "grouped into categories — raw values and converted values. The server checks the required fields are present, then stores it. The " +
        "key idea for the audience: the data is self-describing and organized, so both the sensor and the server agree on the format. The " +
        "later 'Consumers' session shows the matching code on the sensor side.",
    });

    d.steps({
      title: "What happens to a particle reading",
      steps: [
        { h: "Validate", d: "confirm room, sensor, and timestamp are present." },
        { h: "Append to history", d: "add a row to that sensor's CSV history file." },
        { h: "Update the latest snapshot", d: "overwrite that sensor's single 'most recent' row in the database." },
        { h: "Acknowledge", d: "reply success so the Pi knows it landed." },
      ],
      notes:
        "Trace a reading's journey. The server validates the essentials, appends the full reading to that sensor's CSV history file (the " +
        "long-term record), and then updates a single 'latest reading' row for that sensor in the database. That split is deliberate: the " +
        "database answers 'what's happening right now?' quickly, while the CSV holds the complete time series. Finally the server replies " +
        "success so the Pi can move on.",
    });

    d.bullets({
      title: "Where each kind of data lands",
      bullets: [
        "Particle history → a CSV file per sensor (the authoritative time series).",
        "Latest particle reading → one row per sensor in the database (for live views).",
        "Environmental readings → their own per-sensor CSV files.",
        "Parylene batches → combined into one CSV per run when the run finishes.",
        "Denton 18 samples → one CSV per pump-down run.",
      ],
      notes:
        "This is the storage map. Long-term sensor history lives in CSV files, one per sensor — that's the real archive, so it must be backed " +
        "up. The database keeps only each sensor's most recent reading, which powers live dashboards. The Parylene coater sends its data in " +
        "batches that the server stitches into a single CSV when the run ends. The Denton evaporator writes one CSV per pump-down. Different " +
        "devices, same idea: CSV for history, database for 'now.'",
    });

    d.bullets({
      title: "The Parylene batch trick",
      bullets: [
        "The Parylene Pi samples fast, so it sends data in numbered batches.",
        "The server saves each batch to a temporary folder.",
        "When all batches arrive (or the Pi signals 'done'), it combines them.",
        "The result is one tidy CSV per coating run.",
      ],
      notes:
        "One nice pattern worth calling out. The Parylene coater samples many times per second, so rather than send each point, the Pi groups " +
        "them into numbered batches. The server stashes each batch in a temporary folder and, once it has them all (or the Pi says the run is " +
        "finished), concatenates them into a single clean CSV for that run. It's a sensible way to handle a fast, chatty data source over a " +
        "network.",
    });

    d.bullets({
      title: "Why no login for devices?",
      intro: "The trust boundary is the network, not a password.",
      bullets: [
        "Sensors live on a private, locked-down lab Wi-Fi network.",
        "The device addresses aren't publicly advertised.",
        "The data isn't sensitive in the way a password is.",
        "Reasonable for an internal tool — but it would need auth if ever exposed publicly.",
      ],
      notes:
        "Address the obvious question head-on. These device endpoints have no login, which sounds alarming until you see the trust model: the " +
        "sensors sit on a private, restricted Wi-Fi network, the addresses aren't published anywhere, and the data is pressure and dust " +
        "counts, not secrets. This 'perimeter trust' is a normal, acceptable trade-off for an internal lab tool. Be candid that if this " +
        "server were ever exposed to the open internet, these endpoints would need real authentication — that's noted in the security session.",
    });

    d.bullets({
      title: "Why CSV for history, database for 'now'?",
      bullets: [
        "CSV files append cheaply forever — perfect for a growing time series.",
        "The database keeps one row per sensor, answering 'latest reading' instantly.",
        "Live dashboards stay fast; full history stays complete.",
        "Trade-off: the CSV files are the real archive, so they must be backed up.",
      ],
      notes:
        "Explain the split-storage decision, since it's unusual. Appending to a CSV file is cheap and the file can grow indefinitely, which " +
        "suits a never-ending stream of readings. Meanwhile the database holds just the most recent reading per sensor, so a live dashboard " +
        "can answer 'what's happening now' instantly without scanning history. The important operational consequence: the CSV files are the " +
        "only complete record, so backups must include them — losing them loses the history.",
    });

    d.steps({
      title: "Reading data back out",
      intro: "The same address serves current and historical data.",
      steps: [
        { h: "Ask with no details", d: "get every sensor's latest reading (for the map)." },
        { h: "Ask for one sensor", d: "name a room and sensor to get its full history." },
        { h: "Server reads the right source", d: "the database for 'latest,' the CSV for history." },
        { h: "App draws it", d: "a colored map, a table, or a time chart." },
      ],
      notes:
        "Cover the consumer-facing GET side. A desktop app asks the same address two ways: with no specifics it gets every sensor's latest " +
        "reading (used to color the cleanroom map), or naming a room and sensor it gets that one sensor's full history. The server quietly " +
        "pulls from the database for 'latest' and from the CSV for history. Note for maintainers: serving current and historical data from one " +
        "address is a little surprising; a future redesign might split them.",
    });

    d.bullets({
      title: "Validation: bad data is rejected early",
      bullets: [
        "Required fields (room, sensor, timestamp) must be present.",
        "Timestamps are accepted as a number or a standard text format.",
        "Missing or malformed data gets a clear error reply, not a silent failure.",
        "A failed save is rolled back so partial data isn't left behind.",
      ],
      notes:
        "Reassure on data quality. The server insists on the essential fields and accepts timestamps in either common form. If something's " +
        "missing or malformed, it replies with a clear error rather than quietly storing junk. And if a database save fails midway, it's rolled " +
        "back so you don't get half-written records. For unattended devices, predictable validation and clean failure handling are what keep " +
        "the dataset trustworthy.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Machine-facing addresses exchange JSON/CSV, no login.",
        "Five families: particle, environmental, combined, Parylene, Denton 18.",
        "History goes to CSV files; the database keeps each sensor's latest reading.",
        "'No login' is justified by a private network, not by it being unimportant.",
      ],
      notes:
        "Summarize the machine side of the server. The next session (Chemical Inventory) returns to a people-facing feature — the largest " +
        "one in the whole system — and the 'Consumers' session later shows the sensor code that produces all this data.",
    });
  },
};
