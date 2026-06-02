# Pico Firmware — A Plain-English Guide

This guide explains the small programs that run on the **Raspberry Pi Pico** boards in the cleanroom. Written for someone without a coding background; terms are defined as they appear.

> **Note:** the files in *this* folder are older copies. The current, currently-maintained versions of the firmware live in the sibling `NanofabToolkit` repository — see [`presentation/NanofabToolkit/PicoHelperTools/README.md`](../../NanofabToolkit/PicoHelperTools/README.md) for the up-to-date guide. The material below is preserved for historical reference.

## What is a Pico, and what is "firmware"?

A **Raspberry Pi Pico** (specifically the Pico W, the wireless version) is a tiny, inexpensive computer about the size of a stick of gum. It has no screen or keyboard — it just runs one program continuously and can talk over WiFi.

**Firmware** is the name for the program that runs directly on such a small device. These Picos run firmware written in **MicroPython** (a slimmed-down version of the Python language made for tiny computers).

Each Pico is mounted near a machine or in a room, reads a sensor, and sends the readings to the server over WiFi. They are the "field agents" that feed the data you see on the website.

## The programs in this group

| File | Runs on a Pico that… | Sends to |
|------|----------------------|----------|
| `Particle_sensor.py` | reads an SPS30 air-particle sensor | the server's `/particle-data` |
| `PicoParylene.py` | reads the Parylene coater's analog gauges | the server's `/sdsanalog` |
| `PicoDenton18.py` | reads the Denton 18 evaporator's vacuum gauges | the server's `/denton18pump` |
| `VGC083C_Monitor.py` | reads a VGC083C vacuum gauge over a serial cable | a `/api/VGC/...` address |
| `ParticleSensor.py` | reads an SPS30 but just **prints** the values (no WiFi) | nothing — a local test readout |
| `PicoConnect.py` | does nothing but test the WiFi connection | nothing — a connectivity check |

The first three are the real "send data to the server" workhorses. The last three are helpers: one is a no-network test version, one is a bench readout, and one is a connection tester.

## How they all work, in general

Every networked Pico program follows the same rhythm:

1. **Connect to WiFi.** They join the lab's `ULink` network using a stored password.
2. **Read the sensor.** Depending on the board, this means reading particle counts, a voltage from a pressure gauge, or a value over a serial cable.
3. **Package the reading.** They wrap the numbers up with a label saying which room and sensor they came from, and the current time.
4. **Send it to the server.** They make a web request to the matching address (the same addresses covered in the server's "Sensor API" session).
5. **Wait and repeat.** They sleep for a set interval, then do it again — forever, unattended.

Most also blink the Pico's built-in light to show status, and reset themselves if something goes badly wrong, so they keep running without anyone tending them.

## The three workhorses

### Particle_sensor.py — air quality

This is the most full-featured one. It talks to an **SPS30**, a sensor that counts dust particles of different sizes. The firmware:

- Reads the particle counts and converts them into the units the server expects.
- Sends a reading on a schedule (every 15 minutes, aligned to the clock).
- Keeps its clock accurate by checking internet time servers.
- Runs self-checks (WiFi, network, the sensor connection) and blinks status codes with the light.
- Sends to `/particle-data` with the room name and sensor number built into the file.

### PicoParylene.py — the Parylene coater

The Parylene coater is sampled fast (several readings a second), so this firmware works a little differently. It reads three analog gauges — pressure, vapor, and temperature — builds up the readings into batches, and sends those batches to `/sdsanalog`. When a run ends, it sends a "finished" signal so the server can stitch the batches into one file. It even uses Morse code on the status light to flash messages.

### PicoDenton18.py — the Denton 18 evaporator

This one reads two vacuum gauges (a capacitance gauge and an ion gauge) and sends whichever is appropriate for the current pressure range to `/denton18pump`. When the run is done, it sends a "finished" signal. (Note: this file has some unfinished settings — see the developer notes.)

## The helpers

- **ParticleSensor.py** — the same SPS30 reading code, but it just prints the numbers to a screen instead of sending them anywhere. Useful for testing a sensor on a bench.
- **PicoConnect.py** — a tiny program that only checks whether the Pico can join WiFi. If it connects, the Pico's light turns on. Handy for diagnosing a board that "isn't working."
- **VGC083C_Monitor.py** — reads a vacuum gauge controller over a serial cable rather than a sensor chip. (Note: this one is incomplete — see the developer notes.)

## Good to know

- The room and sensor labels are written into each Pico **before** it's installed. If a Pico ends up in the wrong place, its data shows up under the wrong label.
- These run with no login because they're on the private lab network — the same trust model used everywhere on the sensor side.
- If a Pico stops reporting, the usual culprits are WiFi, power, or the sensor cable. `PicoConnect.py` helps rule out WiFi.
- A couple of these files are works-in-progress (`PicoDenton18.py`, `VGC083C_Monitor.py`); the developer notes spell out exactly what's unfinished.

In short: these are the little always-on programs that turn cleanroom machines and rooms into live data on the website.
