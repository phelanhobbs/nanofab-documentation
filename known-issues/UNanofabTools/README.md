# UNanofabTools — Known Issues & Technical Debt

Private working list of bugs, gaps, security concerns, and tech debt for every tool in the repository. Kept deliberately outside the layman presentation and the successor documentation trees so the handoff materials stay clean — this is the to-do list for whoever maintains the code, not part of what gets handed to a new audience.

One file per tool, mirroring the per-tool folders in `../presentation/UNanofabTools/` and `../documentation/UNanofabTools/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| [`flaskserver.md`](flaskserver.md) | The current Flask website | Chem-inventory schema drift; chem write routes unauthenticated |
| [`hscdownloader.md`](hscdownloader.md) | CORES → HSCDATA ETL | CORES Bearer token hard-coded in source |
| [`picofirmware.md`](picofirmware.md) | Raspberry Pi firmware *(older copies — canonical: `NanofabToolkit/PicoHelperTools`)* | WiFi credentials hard-coded; two unique scripts non-functional as written |
| [`particlepctools.md`](particlepctools.md) | Desktop particle viewer *(older copy — canonical: `NanofabToolkit/ParticleSensor`)* + test generator | Generator can accidentally target production |
| [`filetransfer.md`](filetransfer.md) | Per-machine log uploaders | Transfers depend on a personal SSH account |
| [`dattools.md`](dattools.md) | DATfixer + DATgrapher | Binary `.DAT` format parsed by magic bytes with no validation |
| [`utilities.md`](utilities.md) | Standalone helpers | `init_chem_db.py` doesn't build a complete chem database |
| [`serveraccess.md`](serveraccess.md) | SSH access + tmux sessions | tmux is the only supervisor; shared `phelan` is a structural constraint (IT controls user creation); hard-coded IP |
| [`liveserver.md`](liveserver.md) | Findings from the live `nfhistory` surveys | Flask/downloader not under systemd; chem Postgres verified local on `nfhistory`; a handful of IT-bound items (root `authorized_keys` mode, optional unattended-upgrades) |
| [`hscdisplayerserver.md`](hscdisplayerserver.md) | Legacy monolithic server | Run-in-parallel with the Flask app; deprecate and retire |

## How to use this folder

Each file lists items with severity (High / Medium / Low), a brief description, the risk, and a suggested fix — plus a priority order at the bottom. Nothing in these files has been changed in the code yet; they're recommendations, not changelogs.

A few items recur across tools and may be worth treating as cross-cutting initiatives:

- **Secrets in source.** Hard-coded WiFi passwords (`picofirmware`), a CORES Bearer token (`hscdownloader`), and Duo keys imported from a Python module (`hscdisplayerserver`) all belong in environment variables / a protected store, with the secrets themselves rotated.
- **The chem-database schema drift.** The committed `.sql` files are behind the live database; `init_chem_db.py` (in `utilities`) doesn't produce a complete database from scratch; the `flaskserver` issues list enumerates the missing columns/tables. Reconciling this is one project, not several.
- **Personal-account / individual-developer dependencies.** The `filetransfer` scripts log in as a personal CADE account; `fetch_ssh.py` in `utilities` is a personal dev tool. The Nanofab-side fix is a purpose-bound SSH key authenticating as the shared `phelan` server account (no IT involvement). A cleaner long-term fix — a dedicated UNIX service account — has to come from University IT, since the Nanofab team has `sudo` as `phelan` but cannot `useradd`.
- **The IT / Nanofab operational boundary.** Several findings (root SSH from `iceolate`, per-user UNIX accounts, the off-host backup, `unattended-upgrades`, kernel patching) sit on **University IT's** side of the line. The Nanofab admin's tools are `sudo` as `phelan` plus an IT ticket; nothing under `/root/` and no `useradd` is available. Each known-issues file tags items "Nanofab-actionable" vs "IT ticket" so the punch list is honest about who has to do what.
- **The legacy server.** `hscdisplayerserver` is documented for reference but should be retired in favor of the Flask app; until then, confirm which server is actually live so patches go to the right place.

Severity labels follow a shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup. Items that depend on IT cooperation are tagged in-place so they don't muddy the Nanofab-side priority order.
