# NanofabToolkit — Known Issues & Technical Debt

Per-tool bug and tech-debt lists for `NanofabToolkit`. Separate from the layman presentations and the successor documentation trees so handoff materials stay clean.

One file per tool, mirroring the per-tool folders in `../presentation/NanofabToolkit/` and `../documentation/NanofabToolkit/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| [`ALDPeakCounter.md`](ALDPeakCounter.md) | ALD peak counter GUI | Duplicate peak-counter logic with UNanofabTools |
| [`DentonDecoder.md`](DentonDecoder.md) | Denton `.dat`/CSV log viewer | Multi-day timestamp handling limited to one rollover |
| [`ParalyneReader.md`](ParalyneReader.md) | Parylene file browser/viewer | Dead `return_selected` endpoint client; TLS verify disabled |
| [`PreciousMetalReader.md`](PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES Bearer token committed to source |
| [`PicoHelperTools.md`](PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| [`ParticleSensor.md`](ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets in source.** `PreciousMetalReader/src/auth.py` holds the CORES Bearer token; `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — move secrets into env/keychain and rotate.
- **Divergent copies of shared code.** The Pico firmware and the particle viewer each ship in both `NanofabToolkit/` and `UNanofabTools/`. The NanofabToolkit copies are now canonical (newer versions); the UNanofabTools docs point back here. Track cross-cutting fixes in this tree first.
- **PyInstaller builds undocumented.** All four desktop apps ship as Windows executables but the build commands aren't captured in repo READMEs. Add a one-page build note per tool.
- **No timeouts / retries on outbound HTTP.** `ParalyneReader` and `PreciousMetalReader` both call `requests.get` without `timeout=` and freeze the UI on slow servers. Standard fix.
- **No automated tests.** None of these tools has a test suite. A small mock-based contract test per tool would lock in the network/parsing behavior.

Severity follows the shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup.

## See also

The sibling UNanofabTools issues list is at [`../UNanofabTools/`](../UNanofabTools/). Cross-cutting items (firmware credentials, divergent viewer copies, CORES token hygiene) appear in both lists with pointers between them.
