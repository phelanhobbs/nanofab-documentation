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

- `UNanofabTools`: branch `dev`, commit `0114dc5f2fc3d26c6e787eb2ebceb6187412783a`, root `../UNanofabTools`, dirty files `0`, untracked files `2`
- `NanofabToolkit`: branch `master`, commit `cedd4b776009fb6952eb7e0760833fecfbb6674c`, root `../NanofabToolkit`, dirty files `1`, untracked files `0`

## Readable Source Files Included

- `NanofabToolkit`: 48 readable tracked or explicitly untracked source/documentation files
- `UNanofabTools`: 111 readable tracked or explicitly untracked source/documentation files

## Dirty Or Untracked Source Files At Generation Time

- `UNanofabTools/chem_inventory_remote.py`
- `NanofabToolkit/ParticleSensor/src/gui.py`

If this section lists any files, a clean checkout at the recorded commits will not reproduce this manual exactly. Either preserve the working-tree diffs as patch artifacts, commit the source changes in the sibling repos, or regenerate Path F from a deliberately clean source state and review the diff.

## Source Of Truth Rule

For reconstruction without the original source tree, use this manual's sanitized excerpts and notes as the available evidence. For maintenance with sibling source repos present, current source and live production can reveal drift; write that drift down before changing anything. When this manual disagrees with live production, production wins. When source disagrees with this manual, regenerate Path F and inspect the diff. When a secret-looking value is redacted, supply it through `.env`, secure firmware configuration, University IT, or another approved secret channel.

### Universal Edge Case 1: Empty Input

**In this system:** HSCDownloader getting an empty CORES payload, or a machine page with no rows, must still write a headers-only `small_` CSV and render an empty table — never a 500 or a half-written file.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the empty input condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 2: Single Input

**In this system:** One CORES record, one task, or one sensor reading must render like many (single-row tables, single-point graphs) with no list-versus-scalar or off-by-one bugs.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the single input condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 3: Large Input

**In this system:** A large LogData/HSCDATA CSV or a long chem result must page or stream within nginx/Flask limits instead of timing out or exhausting memory on the single VM.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the large input condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 4: Duplicate Input

**In this system:** Re-POSTed Pico data or a re-run downloader cycle must not double-count rows or duplicate `transactions`; preserve idempotent upserts.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the duplicate input condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 5: Malformed Input

**In this system:** A corrupt Denton `.DAT`, malformed CORES JSON, or a bad device POST must fail with a specific logged error, not silently write garbage to HSCDATA or the chem DB.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the malformed input condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 6: Missing File

**In this system:** A missing HSCDATA `small_` file, LogData entry, or `uploads/` attachment must give a clear 404 or 'no data yet' state, not a traceback.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the missing file condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 7: Permission Denied

**In this system:** App writes run as `phelan` under `/home/phelan/server/...`; a permission error usually means an IT-owned path or wrong ownership, not an app bug.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the permission denied condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 8: Network Timeout

**In this system:** A slow or unreachable CORES n8n endpoint must time out and log, leaving the last good HSCDATA in place rather than overwriting it with partial data.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the network timeout condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 9: Stale Credential

**In this system:** A rotated or expired CORES bearer token makes HSCDownloader silently emit stale or empty machine data with no UI error — check the downloader log first.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the stale credential condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 10: Rotated Secret

**In this system:** Rotating the Flask `SECRET_KEY` logs out every session; rotating Duo, DB, or WiFi secrets requires matching `.env`/firmware updates or the feature stops working.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the rotated secret condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 11: Schema Drift

**In this system:** The live chem PostgreSQL has runtime-only columns and tables (for example `transactions` and barcode columns) absent from the committed SQL; a DB built only from `chem_schema*.sql` will 500 on chem write, scan, and report.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the schema drift condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 12: Partial Database Write

**In this system:** tmux-run Flask has no transaction supervisor; an interrupted chem write or task update must roll back so SQLite and PostgreSQL are never left half-updated.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the partial database write condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 13: Concurrent Request

**In this system:** Two simultaneous chem edits or task claims against the single Flask process and SQLite files must not corrupt state; SQLite write-locking and chem transaction scope must hold.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the concurrent request condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 14: Browser Refresh

**In this system:** Refreshing after a POST (add chemical, create task) must not silently resubmit; the post/redirect/get pattern and session must survive a reload.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the browser refresh condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 15: Double Submit

**In this system:** A double-clicked form (signup, add container, claim task) must be idempotent or guarded — no duplicate users, containers, or task assignees.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the double submit condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 16: Stale Tmux Session

**In this system:** If the `flaskserver` or `downloader` tmux session died or holds a stale editor pane, the site or HSCDATA silently stops; recovery is re-attach and restart per the serveraccess docs, not a code change.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the stale tmux session condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 17: Wrong Working Directory

**In this system:** Flask and HSCDownloader assume the install dir `/home/phelan/server/UNanofabTools/`; starting elsewhere breaks relative paths to `instance/`, HSCDATA, and templates.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the wrong working directory condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 18: Wrong User Account

**In this system:** Running as anything other than shared `phelan` breaks file ownership and SSH-key assumptions; per-user UNIX accounts are an IT ticket, not a workaround.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the wrong user account condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 19: University It Boundary

**In this system:** Anything touching root, the VM, nginx, firewall, base patching, off-box backups, or UNIX-account creation is IT-owned — file a ticket; Nanofab's reach stops at `sudo` as `phelan`.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the University IT boundary condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 20: Backup Restore

**In this system:** Restoring nfhistory is an IT VM restore; verify `/home/phelan/`, the local PostgreSQL data directory, and `/etc/letsencrypt/` all returned, then restart Flask and the downloader in tmux.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the backup restore condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 21: Disk Pressure

**In this system:** A full disk on the single VM stops HSCDATA writes, SQLite writes, and TLS renewal at once; check `df` and the LogData/HSCDATA/`uploads/` trees before assuming an app bug.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the disk pressure condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 22: Old Source Copy

**In this system:** PicoHelperTools and ParticleSensor have older duplicate copies in UNanofabTools; edit the canonical NanofabToolkit copies and do not reconstruct from the historical ones.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the old source copy condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 23: Production Versus Development Configuration

**In this system:** `.env.example` ships the production HOST and PORT (the live IP and 443); a dev run must override them or it binds to production values — prod serves via nginx to 127.0.0.1:5000, not gunicorn on 443.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the production versus development configuration condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.

### Universal Edge Case 24: Redacted Secret Reconstruction

**In this system:** Placeholders like `<redacted-bearer-token>` mark where a secret lives, not its value; supply it from `.env`, firmware provisioning, or IT — never infer it from placeholder length or nearby code.

A functionally identical rebuild must preserve what happens to users, files, databases, logs, network calls, and operator decisions under the redacted secret reconstruction condition. If the original behavior is weak, describe it accurately before recommending a safer replacement.
