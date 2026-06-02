# PicoHelperTools — A Plain-English Guide

This guide explains the **PicoHelperTools** in NanofabToolkit — the small programs running on the Raspberry Pi Pico W boards in the cleanroom. Written for a non-coder; terms are defined as they appear.

> NanofabToolkit holds the **current** versions of this firmware. Older copies exist in `UNanofabTools/` for historical reference; the files here are the ones you should flash to a fresh Pico today.

## What is a Pico, and what is "firmware"?

A **Raspberry Pi Pico W** is a tiny, inexpensive computer (about the size of a stick of gum) with WiFi but no screen or keyboard. It just runs one program continuously.

**Firmware** is the name for the program that runs directly on such a small device. These Picos run firmware written in **MicroPython** — a slimmed-down version of the Python language made to fit on tiny computers.

Each Pico is mounted near a machine or in a room, reads a sensor, and sends the readings to the cleanroom server over WiFi. They're the field agents that feed the data shown on the website.

## The three programs in this folder

| File | Reads | Sends to | Use it when |
|------|-------|----------|--------------|
| `Particle_sensor.py` | An SPS30 air-particle sensor | `/particle-data` on the server | You only need particle counts |
| `DHT22_sensor.py` | A DHT22 temperature + humidity sensor | `/env-data` on the server | You only need temp/humidity |
| `sensor_combined.py` | Both an SPS30 *and* a DHT22 on the same board | `/sensor-data` on the server | You want everything in one Pico |

`sensor_combined.py` is the newest pattern — one Pico, one cable run, both readings in one trip to the server. The two single-sensor files exist for boards that only have one of the two sensors attached.

## The rhythm every Pico follows

All three programs follow the same loop:

1. **Connect to WiFi.** Join the lab's `ULink` network.
2. **Sync the clock.** Briefly call an internet time server so timestamps are accurate.
3. **Read the sensor(s).** SPS30 over a short cable (I²C); DHT22 over a single data wire.
4. **Wait until the next scheduled moment.** By default, the top of every 15-minute mark (`:00`, `:15`, `:30`, `:45`).
5. **Send the reading to the server.** Wrap it up as a small JSON message and POST it over the encrypted connection.
6. **Repeat — forever.** A watchdog timer resets the board if something hangs.

A small built-in LED blinks status codes so you can tell from across the room whether a board is working.

## What's different about these versions

Compared to older copies of the same firmware, these are noticeably tougher:

- **Headless-safe printing.** If no laptop is plugged in to read the Pico's "console" output, naive print calls can block or crash the program. These versions catch that and quietly continue.
- **Local error log.** Errors get appended to a small `error_log.txt` file on the Pico itself, capped at about 4 KB so the flash never fills up. Useful when nobody is watching.
- **Watchdog-friendly waits.** During long sleeps, the program "feeds" the watchdog every second so a healthy program isn't accidentally reset.
- **Scheduled sending.** Each board sends at the same minute past the hour, regardless of when it powered on — so a roomful of sensors all report at the same times and the data lines up.

## Setting up a new Pico (in plain language)

1. Wire the sensor(s) to the Pico per the diagrams at the top of each file.
2. Open the right firmware file and edit four things near the top:
   - `WIFI_SSID` / `WIFI_PASSWORD` (the lab WiFi).
   - `ROOM_NAME` (where the Pico will live, e.g. `"Bay C"`).
   - `SENSOR_NUMBER` (a unique number for that board).
3. Copy the file onto the Pico as `main.py` and reboot it.
4. Watch the onboard LED for the boot sequence. After ~30 seconds the first reading should appear in the website's particle viewer.

Each Pico is hard-labeled with its room and sensor number before deployment — so the server knows which physical bay each reading came from.

## Good to know

- The room and sensor labels live in the code, not in the message. Mislabel a board and its data shows up under the wrong room.
- The Picos don't authenticate to the server — they're trusted because they're on a private lab WiFi.
- The lab WiFi password is currently written into these files in plain text. It would be safer to keep it in a separate, ignored `picopass.py` (a common pattern). Recorded on the to-fix list.
- If a board goes quiet, the LED blink pattern is the first clue. Plug a laptop in to see the latest error log if you need more detail.

In short: the small, sturdy programs that turn cleanroom machines and rooms into live data on the website — built to run unattended, recover from hiccups, and report cleanly on a schedule.
