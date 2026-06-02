# Module 11 - Request Lifecycle And Endpoint Reference

## Goal

The maintainer can trace one request from browser or device to nginx, Flask, blueprint, service code, persistence, response, and documentation, then use that skill to audit route drift.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx`](../../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx)
- [`../../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx`](../../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx)
- [`../../presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md`](../../presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md)
- [`../../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md`](../../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)
- [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)

## Verbatim Script

READ ALOUD:

"This module ties together everything we have covered so far. A request is not magic. It enters through a network path, reaches Flask, passes through routing and guards, calls code, touches data, and returns a response."

SHOW:

Open `13-Request-Lifecycle-Walkthrough.pptx`.

READ ALOUD:

"For a browser request, the public user talks to `nfhistory` over HTTPS. nginx receives the request and proxies to Flask. Flask matches a route. Decorators and route logic enforce login or admin requirements where applicable. The route calls service functions or direct helpers. The app reads or writes SQLite, PostgreSQL, or file trees. Then Flask returns HTML, JSON, a redirect, a file, or an error."

"For a device request, the shape is similar but the guard model may differ. Device endpoints can be unauthenticated. That makes payload validation and network exposure especially important."

SHOW:

Open `15-Endpoint-Reference.pptx`.

READ ALOUD:

"The endpoint reference exists so a maintainer can audit what the app exposes. For each route family, we want method, path, guard, inputs, behavior, response, and known risks. If source changes, this reference must change."

## Source Demo

DO:

Run:

```sh
rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools/app/blueprints
```

READ ALOUD:

"This command finds route decorators and guards. The source is the starting point for a route drift audit."

DO:

Pick one endpoint from [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md). For that endpoint, identify:

```text
method
path
guard
source file
function name
input
service calls
data side effects
response
known issue, if any
```

READ ALOUD:

"This is the basic endpoint audit pattern. If you can do this for one endpoint, you can do it for all endpoints. This is how future route changes stay documented."

## Drift Rule

READ ALOUD:

"If an endpoint exists in source but not in docs, docs are incomplete. If an endpoint exists in docs but not source, docs are stale. If the docs say a route requires login but the source has no guard, that is potentially high severity. If the docs say an endpoint writes one data store but source writes another, that can be a data-integrity finding."

## Explain-Back

ASK:

- What are the stages in a browser request?
- What are the stages in a device request?
- How do you find all route decorators?
- What does the endpoint reference need to say for each route?
- What is route drift?
- Which route-drift cases are high severity?

REQUIRE:

The maintainer can audit one endpoint from docs to source to data side effects.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot perform one route audit. Assign a second endpoint as homework.
