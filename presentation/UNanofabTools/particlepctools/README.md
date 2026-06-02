# Particle PC Tools — A Plain-English Guide

This guide explains two desktop programs that work with the particle-sensor data: **particle_data_viewer.py** and **generate_test_particle_data.py**. Written for a non-coder; terms are defined as they appear.

> **Note:** the `particle_data_viewer.py` covered below is the *older* copy. The current, currently-maintained version lives in the sibling NanofabToolkit repository — see [`presentation/NanofabToolkit/ParticleSensor/README.md`](../../NanofabToolkit/ParticleSensor/README.md) for the up-to-date guide. The test-data generator has no NanofabToolkit twin and remains the canonical copy here.

## The two tools

- **particle_data_viewer.py** — a desktop app (a window with a map and tables) that shows the live particle readings from around the cleanroom. This is the program a staff member opens to *look at* the data.
- **generate_test_particle_data.py** — a behind-the-scenes tool that *invents* realistic fake readings and sends them to the server, so the system can be tested without waiting for real sensors. You'd never use this in normal operation.

Both talk to the same server endpoint the real sensors use (`/particle-data`) — one reads from it, one writes to it.

## particle_data_viewer.py — the viewer

This is a **graphical desktop application** (built with a toolkit called PyQt). When you run it, a window opens with:

- A **map of the cleanroom** on one side, with each bay and lab drawn as a labeled box.
- A **table** of the current readings on the other side.
- A **Refresh** button to pull the latest data.

Each room box can be color-coded by its air quality, so you can glance at the map and see where particle counts are high. Double-clicking a sensor opens a **history window** that charts that sensor's readings over time.

Under the hood it simply asks the server "what are the current readings?" (and, for the history window, "what's the full history for this sensor?"), then draws what comes back. It doesn't store anything itself — the server is the source of truth.

This is essentially the same idea as the particle viewer in the separate NanofabToolkit; this copy lives in the main repository.

### One quirk to know

The viewer adds seven hours to the timestamps it receives, to line them up with local Mountain Time. That's a workaround for a time-zone mismatch in the stored data rather than a clean fix — worth knowing if the displayed times ever look off (for example, around daylight-saving changes).

## generate_test_particle_data.py — the test data maker

Real sensors only report every so often, and you can't easily make the cleanroom dirty on demand to test the displays. So this tool **simulates** sensors.

It defines a handful of pretend sensors — a couple in a "clean room," one in a "main lab," one near a "fume hood," one in an "office" — each with a realistic baseline air quality and some natural random variation. It then generates believable readings (with gentle trends over time) and sends them to the server exactly as a real Pico would.

The result: you can develop and demo the viewer, the website, and the alerts with lively, realistic-looking data, without any hardware. By default it points at a local test server (`localhost`), not the production server.

## When you'd use each

- **Viewing real data?** Open `particle_data_viewer.py`.
- **Testing or demoing the system without hardware?** Run `generate_test_particle_data.py` against a test server, then watch the viewer or website fill up.

## Good to know

- The viewer only reads; the generator only writes fake data. Neither changes real sensor hardware.
- The generator should point at a **test** server, not production — otherwise it pollutes the real data with fake readings.
- Both rely on common Python libraries; the viewer needs the PyQt desktop toolkit installed.

In short: one tool to look at the particle data like a dashboard, and one to manufacture realistic test data so the rest of the system can be exercised without waiting on real sensors.
