# Module 9 - Device APIs And Sensor Data

## Goal

The maintainer understands device-facing routes, Pico sensor data flow, unauthenticated endpoint exposure, expected payloads, and known data-contract gaps.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`](../../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx)
- [`../../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`](../../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx)
- [`../../presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md`](../../presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md)
- [`../../presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md`](../../presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md)
- [`../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`](../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Device APIs are different from normal browser pages. Browser pages usually assume a logged-in human. Device endpoints may be called by Pico devices or other small clients. That means the maintainer must understand payload shape, validation, storage side effects, and whether the endpoint is authenticated."

SHOW:

Open `08-IoT-API-Endpoints.pptx`.

READ ALOUD:

"The most important conceptual split is people versus devices. People authenticate through the web app. Devices post structured data. If device routes are unauthenticated, that may be a practical choice for embedded devices, but it is still a security and data-integrity risk. The docs and known-issues files should say so clearly."

SHOW:

Open `12-Consumers-NanofabToolkit.pptx`.

READ ALOUD:

"The Pico firmware and desktop tools are consumers or producers around the Flask app. This is why canonical source matters. For PicoHelperTools and ParticleSensor, the canonical code lives in NanofabToolkit, not the older copies under UNanofabTools."

## Source Demo

DO:

Run:

```sh
rg -n "sensor-data|env-data|particle|room_name|sensor_number|raw_measurements|converted_values" ../UNanofabTools/app ../NanofabToolkit
```

READ ALOUD:

"This search connects endpoint names to source code and client code. If a Pico sends `room_name` and `sensor_number`, the server docs, firmware docs, and desktop viewer docs should all agree about those names. If a room label changes in one place but not another, the system can silently stop matching data."

SHOW:

Open [`../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`](../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md).

READ ALOUD:

"A data contract is the agreement between producer and consumer. It includes endpoint path, method, required fields, optional fields, units, storage side effects, and response shape. A future maintainer should update the contract whenever firmware, server routes, or desktop tools change."

## Known Gap Frame

READ ALOUD:

"The docs call out data-contract gaps where relevant. For example, if a POST writes one storage location but a GET reads another, that is not just a code curiosity. It means a user or tool can get a 404 even though data was posted. These mismatches belong in known issues until fixed."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which endpoints receive device data? | Device API routes such as `/sensor-data` and `/env-data`, as documented in the endpoint/integration docs. |
| Which fields identify a sensor? | `room_name` and `sensor_number`. |
| Why are unauthenticated device routes risky? | Anyone who can reach them may submit false, malformed, or abusive data unless other controls exist. |
| Where is canonical Pico firmware? | `../NanofabToolkit/PicoHelperTools/`. |
| Where is canonical ParticleSensor code? | `../NanofabToolkit/ParticleSensor/`. |
| What can break if room names or sensor numbers drift? | Server storage, map coloring, viewer lookups, and device-data matching can silently fail or mislabel data. |
| How would you audit a server endpoint against firmware? | Compare server route path/method/fields to firmware POST code, payload names, units, response handling, and docs. |

REQUIRE:

The maintainer can explain one device data flow from Pico payload to server route to stored data to viewer.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify canonical NanofabToolkit code for PicoHelperTools and ParticleSensor.
