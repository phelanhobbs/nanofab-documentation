# Path F System Map And Reconstruction Contract

Path F is the maximal reconstruction path. It is intended for a future maintainer who must understand and recreate the server, tools, firmware helpers, desktop utilities, and operational procedures without contacting Faith and without opening the original source tree except through the sanitized excerpts in this manual.

## Scope

- Reconstruct the Flask server and deployment assumptions.
- Reconstruct route behavior, templates, static browser code, models, services, and configuration.
- Reconstruct the chemical inventory and local PostgreSQL assumptions.
- Reconstruct HSCDownloader, data movement, file transfers, sensor firmware copies, desktop tools, and legacy context.
- Preserve the University IT versus Nanofab operational boundary.
- Preserve redaction discipline: this manual explains where secrets belong but does not reveal live secret values.

## Source State Used

- `UNanofabTools`: branch `dev`, commit `ac6c67f`, root `/Users/phe/code/work/UNanofabTools`
- `NanofabToolkit`: branch `master`, commit `cedd4b7`, root `/Users/phe/code/work/NanofabToolkit`

## Readable Source Files Included

- `NanofabToolkit`: 48 readable tracked or explicitly untracked source/documentation files
- `UNanofabTools`: 111 readable tracked or explicitly untracked source/documentation files

## Dirty Or Untracked Source Files At Generation Time

- `UNanofabTools/chem_inventory_remote.py`
- `UNanofabTools/chem_schema.sql`
- `UNanofabTools/chem_schema_migration_v2.sql`
- `UNanofabTools/requirements.txt`
- `NanofabToolkit/ParticleSensor/src/gui.py`

## Source Of Truth Rule

When this manual disagrees with live production, production wins. When production disagrees with committed source, write the drift down before changing anything. When source disagrees with this manual, regenerate Path F and inspect the diff. When a secret-looking value is redacted, supply it through `.env`, secure firmware configuration, University IT, or another approved secret channel.

### Universal Edge Case 1: Empty Input

Every module must be checked against the empty input case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 2: Single Input

Every module must be checked against the single input case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 3: Large Input

Every module must be checked against the large input case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 4: Duplicate Input

Every module must be checked against the duplicate input case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 5: Malformed Input

Every module must be checked against the malformed input case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 6: Missing File

Every module must be checked against the missing file case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 7: Permission Denied

Every module must be checked against the permission denied case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 8: Network Timeout

Every module must be checked against the network timeout case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 9: Stale Credential

Every module must be checked against the stale credential case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 10: Rotated Secret

Every module must be checked against the rotated secret case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 11: Schema Drift

Every module must be checked against the schema drift case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 12: Partial Database Write

Every module must be checked against the partial database write case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 13: Concurrent Request

Every module must be checked against the concurrent request case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 14: Browser Refresh

Every module must be checked against the browser refresh case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 15: Double Submit

Every module must be checked against the double submit case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 16: Stale Tmux Session

Every module must be checked against the stale tmux session case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 17: Wrong Working Directory

Every module must be checked against the wrong working directory case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 18: Wrong User Account

Every module must be checked against the wrong user account case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 19: University It Boundary

Every module must be checked against the University IT boundary case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 20: Backup Restore

Every module must be checked against the backup restore case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 21: Disk Pressure

Every module must be checked against the disk pressure case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 22: Old Source Copy

Every module must be checked against the old source copy case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 23: Production Versus Development Configuration

Every module must be checked against the production versus development configuration case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.

### Universal Edge Case 24: Redacted Secret Reconstruction

Every module must be checked against the redacted secret reconstruction case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.
