# NanofabToolkit — Known Issues & Technical Debt

Per-tool bug and tech-debt lists for `NanofabToolkit`. Separate from the layman presentations and the successor documentation trees so handoff materials stay clean.

One file per tool, mirroring the per-tool folders in `../presentation/NanofabToolkit/` and `../documentation/NanofabToolkit/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| [`ALDPeakCounter.md`](ALDPeakCounter.md) | ALD peak counter GUI | Duplicate peak-counter logic with UNanofabTools |
| [`DentonDecoder.md`](DentonDecoder.md) | Denton `.dat`/CSV log viewer | Multi-day timestamp handling limited to one rollover |
| [`ParalyneReader.md`](ParalyneReader.md) | Parylene file browser/viewer | Dead `return_selected` endpoint client; TLS verify disabled |
| [`PreciousMetalReader.md`](PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES creds: env-var preference added (2026-06-22), `auth.py` never committed; rollout + rotation deferred |
| [`PicoHelperTools.md`](PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| [`ParticleSensor.md`](ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets and local credentials.** `PreciousMetalReader` now prefers the `CORES_TOKEN` env var (falling back to a local `auth.py`); `auth.py` was verified **never committed**, so there's no history leak — finishing the rollout (set the env var, delete `auth.py`, rebuild) and rotating the token are owner-deferred. `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — keep secrets out of source-controlled files.
- **Divergent copies of shared code.** The Pico firmware and the particle viewer each ship in both `NanofabToolkit/` and `UNanofabTools/`. The NanofabToolkit copies are now canonical (newer versions); the UNanofabTools docs point back here. Track cross-cutting fixes in this tree first.
- **PyInstaller builds undocumented.** All four desktop apps ship as Windows executables but the build commands aren't captured in repo READMEs. Add a one-page build note per tool.
- **No timeouts / retries on outbound HTTP.** `ParalyneReader` and `PreciousMetalReader` both call `requests.get` without `timeout=` and freeze the UI on slow servers. Standard fix.
- **No automated tests.** None of these tools has a test suite. A small mock-based contract test per tool would lock in the network/parsing behavior.

Severity follows the shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup.

## Closeable issue format

For new items, or when rewriting an existing item before implementation, include:

- **Owner:** Nanofab / University IT / CORES / facilities-network / mixed.
- **Evidence or reproduction:** exact source path, sample input, command output, API response, UI workflow, or hardware observation.
- **Remediation:** what should change, including the file, config, credential storage, packaging step, or upstream ticket.
- **Validation / proof of fix:** command, screenshot, fixture output, packaged-app launch, mocked API test, or documentation diff that proves the item can be closed.
- **Dependencies:** required secret, live endpoint, sample file, Pico hardware, Windows build host, CORES change, or IT ticket.

Older items may still use a shorter `Where/Risk/Fix` format. Before closing one of those, add the missing owner/evidence/validation details so the next maintainer can audit the closure without asking the original author.

## See also

The sibling UNanofabTools issues list is at [`../UNanofabTools/`](../UNanofabTools/). Cross-cutting items (firmware credentials, divergent viewer copies, CORES token hygiene) appear in both lists with pointers between them.
