# Path F Rebuild Evidence Template

Copy this structure into an issue, PR description, handoff note, or maintenance log whenever a tool is rebuilt, simulated, repaired, or deliberately not rebuilt.

## Summary

- Tool or workflow rebuilt:
- Date:
- Maintainer:
- Reason for rebuild or investigation:
- Final status: completed / partial / blocked / IT ticket / retired

## Scope

- Path F folder used:
- Source-file pages used:
- Source state basis: clean commit / dirty working tree / generated excerpt only / live drift:
- Dirty or untracked source files acknowledged:
- Live systems touched:
- Systems intentionally not touched:

## External Inputs Supplied

- Secrets/config values supplied from approved storage:
- Fixture index entries used:
- Hardware or sample files used:
- Sample file hashes or expected-output identifiers:
- Live server/database paths used:
- IT/CORES/network assumptions verified:

## Commands And Actions

```sh
# paste commands here
```

## Evidence Collected

- Logs:
- Screenshots:
- Output files:
- Database checks:
- Browser/API checks:
- Hardware observations:

## Edge Cases Tested

- Empty input:
- Malformed input:
- Missing file:
- Permission denied:
- Stale credential:
- Schema drift:
- Partial write or network interruption:
- Wrong working directory/account:
- Production versus development configuration:

## Compatibility And Drift

- Behavior preserved exactly:
- Deliberate compatibility breaks:
- Differences from live production:
- Differences from sibling source repo state:
- Documentation updates needed:

## Ownership And Follow-Up

- Nanofab-owned follow-up:
- University IT ticket needed:
- CORES/upstream ticket needed:
- Hardware/network follow-up:
- No-contact handoff note for the next maintainer:
