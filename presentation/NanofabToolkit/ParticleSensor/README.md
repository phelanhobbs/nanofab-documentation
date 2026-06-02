# ParticleSensor — A Plain-English Guide

This guide explains **ParticleSensor**, the desktop app from NanofabToolkit that shows live cleanroom air-quality data on a map. Written for a non-coder; terms are defined as they appear.

> NanofabToolkit holds the **current** version of this viewer. An older copy in `UNanofabTools/particle_data_viewer.py` is kept for historical reference; the version here is the one to install today.

## What it does

ParticleSensor is the **desk-side dashboard** for the cleanroom's particle sensors. When you open it, a window appears showing:

- A **map of the cleanroom** with each bay and lab drawn as a labeled box.
- Inside each box, two small inner squares for **temperature** and **humidity** when a Pico is reporting them.
- A **table** beside the map listing the latest reading from every sensor.
- A **Refresh** button to pull the latest data on demand.

The boxes are **color-coded** at a glance: yellow for "no data yet," red/green for the particle level the latest reading reports, and the inner temp/humidity squares change color when their sensor sends data. So a single look at the map tells you which rooms are reporting and roughly how clean they are.

Double-clicking a sensor opens a **history window** that charts that sensor's readings over time, with the usual zoom/pan/save buttons.

## Where the data comes from

The viewer doesn't have its own sensors — it asks the cleanroom server for the readings that the Pico boards (covered in the PicoHelperTools session) have been uploading. Specifically:

- For the live snapshot, it calls the server's "current readings" endpoint.
- For a sensor's history, it calls the server's "history" endpoint with that sensor's labels.

The server is the source of truth; the viewer is a window onto it.

## What's different from older versions

Compared to the older copy in UNanofabTools, this one has been steadily improved:

- **Env-data sub-boxes inside each room.** Older versions only colored the room by particle level — this one also shows temperature and humidity from the DHT22/combined sensors in two small inner squares.
- **A real timezone library.** It uses Python's `pytz` to handle Mountain Time properly (though there's still a known correction it applies — see below).
- **The standard matplotlib chart toolbar.** The history window has the normal Home / Pan / Zoom / Save buttons you'd expect, instead of a custom click-and-drag affair.
- **Cleaner code separation.** The API access and data formatting are in their own small classes (`ParticleDataAPI`, `ParticleDataProcessor`) so they can be reused outside the GUI.

## How a typical session goes

1. Open the app.
2. The map appears with rooms shaded yellow (no data yet); click **Refresh** to pull the latest readings.
3. Rooms with recent particle readings change color; rooms with temperature/humidity readings also fill their inner squares.
4. Hover or click on a sensor row in the table for details.
5. Double-click a sensor to open its history window — chart over time, save to image if you want.

## A quirk to know

The app adds **seven hours** to the timestamps it receives from the server, to line them up with local Mountain Time. That's a workaround for a time-zone mismatch in the stored data rather than a clean fix — worth knowing if the displayed times ever look off (for example, around daylight-saving transitions). The real fix is server-side and is recorded in the issues list.

## Good to know

- The viewer only **reads** server data; it never changes anything.
- It needs **network access** to the cleanroom server.
- All connections are encrypted, though the app currently skips checking the server's certificate (the internal certificate isn't in the standard trust store).
- The app is packaged as a Windows executable so you don't need Python installed to run it.

In short: a friendly desktop dashboard that turns the live data from a roomful of Pico sensors into an at-a-glance map of the cleanroom — plus history charts for any sensor you want to dig into.
