# Utilities — Known Issues & Technical Debt

Working list for the standalone helper scripts. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security / broken · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `gencert.py` writes an unencrypted private key — Medium (security)
- **Where:** `key.private_bytes(..., encryption_algorithm=NoEncryption())`.
- **Risk:** the TLS private key sits on disk unprotected; if read, the cert can be impersonated.
- **Note/Fix:** this matches the nginx/standalone-TLS expectation, so encrypting it would require server-config changes. At minimum, lock down filesystem permissions and document where the key lives.

### 2. `gencert.py` has hard-coded Windows paths + unused imports — Low
- **Where:** input `.pfx` path and output `.pem` paths are literals; `http.server` imports are unused.
- **Fix:** take paths as arguments / read the PFX password from the environment; remove the dead HTTP-server import.

### 3. `init_chem_db.py` only applies the v1 schema — High
- **Where:** runs `chem_schema.sql` only.
- **Risk:** a fresh chem database is missing the v2 migration and the runtime-only objects (`containers.last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). Chem add/scan/report/transaction features will error on a clean install.
- **Fix:** extend the script to apply `chem_schema_migration_v2.sql` and the reconciliation DDL listed in `known-issues/UNanofabTools/flaskserver.md` (#4).

### 4. `init_chem_db.py` naive statement splitting — Low
- **Where:** splits the SQL on `;` and skips `BEGIN`/`COMMIT`.
- **Risk:** breaks if any statement legitimately contains a semicolon (e.g. inside a function body or string).
- **Fix:** execute the whole file via psql, or use a proper SQL parser.

### 5. `fetch_ssh.py` uses AutoAddPolicy and hard-coded identity — Medium
- **Where:** `set_missing_host_key_policy(AutoAddPolicy())`; hard-coded `phelanh`/`phelan`, jump host, and key path.
- **Risk:** auto-accepting unknown host keys is unsafe for anything automated; personal credentials make it non-portable.
- **Fix:** keep it strictly as a personal dev tool, or replace with a documented `scp`/CI step using verified host keys.

### 6. `fetch_ssh.py` produces the confusing `chem_inventory_remote.py` artifacts — Low
- **Where:** writes output to `chem_inventory_remote.py`; an empty file by that name and a dead blueprint copy exist in the tree.
- **Risk:** maintainers confuse the fetched copy / dead blueprint with live code.
- **Fix:** write to a clearly-named scratch path (e.g. `_fetched/`); delete the dead artifacts.

### 7. `NMonStore.py` is an unfinished stub — Medium
- **Where:** the whole file — counts to 5, writes to `VOLTDATA.txt`, `# Your code logic goes here`.
- **Risk:** dead/placeholder code in the repo; unclear intent.
- **Fix:** finish it (define the real monitor data source/format) or delete it.

### 8. `peakCount.py` end-peak heuristic is untested — Low/Medium
- **Where:** the custom "add a peak at the end" logic.
- **Risk:** heuristic thresholds (1% plateau tolerance, 5% elevation) may over/under-count on unusual data; no tests.
- **Fix:** add tests with known peak counts; document the heuristic's assumptions.

### 9. Overlapping pressure-file parsing — Low
- **Where:** `peakCount.py`, the DAT graphers, and the NanofabToolkit ALD counter all parse pressure/time files slightly differently.
- **Fix:** consider a shared parsing helper to avoid divergent behavior.

---

## Suggested priority order
1. #3 make `init_chem_db.py` produce a complete database — High
2. #1 protect the TLS private key — Medium (security)
3. #7 resolve the `NMonStore.py` stub — Medium
4. #5 tighten / scope `fetch_ssh.py` — Medium
5. #2, #4, #6, #8, #9 cleanup — Low
