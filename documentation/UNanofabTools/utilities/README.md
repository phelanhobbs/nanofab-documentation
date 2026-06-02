# Utilities — Developer Documentation

Reference for the standalone helper scripts that don't belong to a larger tool. Bugs/tech debt: `known-issues/UNanofabTools/utilities.md`.

## 1. Overview

| File | Purpose | Run as | Deps |
|------|---------|--------|------|
| `peakCount.py` | Count peaks in pressure data | CLI (`argparse`) | numpy, scipy, matplotlib |
| `gencert.py` | Convert `.pfx` → `cert.pem` + `key.pem` | one-off script | cryptography |
| `init_chem_db.py` | Provision the PostgreSQL chem schema | one-off script | SQLAlchemy, dotenv, psycopg2 |
| `fetch_ssh.py` | Pull a file off the server via SSH proxy | dev helper | paramiko |
| `NMonStore.py` | Intended monitor data store | **stub, non-functional** | stdlib |

## 2. `peakCount.py`

CLI peak counter over tab-delimited pressure files.

- `count_peaks(file_path, height, prominence, distance, width, plot, quiet) -> (count, times, pressures, peaks)`:
  - Reads the file, skips the header, parses `values[0]` (time) and `values[1]` (pressure) from tab-split lines, ignoring non-numeric rows.
  - Uses `scipy.signal.find_peaks(pressures, height, prominence, distance, width)`.
  - **End-peak heuristic:** for series > 10 points, inspects the last 10 samples; if they are rising / plateauing / elevated and no peak already sits near the end, appends a synthetic end peak (subject to height/distance checks). This catches a final peak that `find_peaks` misses at the array boundary.
  - Prints results (or just the count in `--quiet`); plots if `--plot` and single-file.
- `multi_file_plot(results, plot)`: overlays multiple files on one chart with distinct colors/markers.
- `main()`: `argparse` — `file_paths` (1+), `--height`, `--prominence` (default 0.01), `--distance` (default 10), `--width`, `--plot`, `--quiet`. Sets `count_peaks.multiple_files` to suppress per-file plots when several files are passed.

Input format: tab-delimited, header line skipped, columns `[time, pressure, ...]`. Companion notes: `peakCount.md`. A GUI sibling exists in `NanofabToolkit/ALDPeakCounter`.

## 3. `gencert.py`

One-off PKCS12→PEM converter for the server's TLS cert.

- Hard-coded paths: reads `C:\ProgramData\certify\assets\nfhistory.nanofab.utah.edu\<...>.pfx`; writes `C:\Users\phelanh\Desktop\Work\cert.pem` and `key.pem`.
- Uses `cryptography.hazmat.primitives.serialization.pkcs12.load_key_and_certificates` (password `None`).
- Writes the cert PEM and the **private key with `NoEncryption()`** (unencrypted) in TraditionalOpenSSL format.
- Run by hand on certificate renewal. The unencrypted key matches the nginx/standalone-TLS setup expectations but must be filesystem-protected. (Note: an unused `HTTPServer/SimpleHTTPRequestHandler` import is present — leftover.) See known-issues.

## 4. `init_chem_db.py`

Provisions the chem PostgreSQL schema.

- `get_db_url()`: builds `postgresql+psycopg2://...` from `CHEM_*`/`PG*` env vars (same precedence as the Flask config).
- `read_schema_sql()`: loads `chem_schema.sql` from the script dir.
- `init_database()`: creates an engine and executes the schema statement-by-statement (splitting on `;`, skipping `BEGIN`/`COMMIT`).
- `__main__` runs `init_database()`.

> Important: this applies only `chem_schema.sql` (v1). It does **not** apply `chem_schema_migration_v2.sql` or the runtime-only columns/tables the live `chem_service` uses (`last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). A fresh DB built only with this script will be missing those — see the flaskserver known-issues (#4) and `known-issues/UNanofabTools/utilities.md`.

## 5. `fetch_ssh.py`

Developer convenience to retrieve the live `chem_inventory.py` from the server.

- Connects via a `paramiko.ProxyCommand` jump (`phelanh@lab1-10.eng.utah.edu` using `~/.ssh/CADE`) to host `nfhistory`, user `phelan`.
- `AutoAddPolicy()` for host keys (accepts unknown hosts — fine for a personal tool, not for automation).
- Runs `cat ~/server/UNanofabTools/app/blueprints/chem_inventory.py` and writes the bytes to local `chem_inventory_remote.py` (this is the origin of the empty/duplicate `chem_inventory_remote.py` artifacts in the tree).
- Personal/dev only; hard-coded usernames, hosts, and paths.

## 6. `NMonStore.py` — stub

Non-functional placeholder. Ensures `VOLTDATA.txt` exists, then loops incrementing `loopNumber`, appending it to the file, with a `# Your code logic goes here` comment, breaking at 5. `rstVolt` truncation branch is dead (constant 0). Intended as a "neutral monitor" data store; never completed.

- **Action:** finish (define the real data source/format) or remove. See known-issues.

## 7. Maintenance notes
- `peakCount.py`: behavior overlaps the NanofabToolkit ALD peak counter and the DAT graphers' parsing — consider consolidating the pressure-file parsing.
- `gencert.py`: parameterize paths and read the PFX password from the environment; drop the unused HTTP-server import.
- `init_chem_db.py`: extend to apply all migrations so a fresh DB matches production.
- `fetch_ssh.py`: keep as a personal tool or replace with a documented `scp`/CI step; don't use `AutoAddPolicy` in anything automated.
- `NMonStore.py`: resolve (finish or delete).

See the layman guide at `presentation/UNanofabTools/utilities/README.md`.
