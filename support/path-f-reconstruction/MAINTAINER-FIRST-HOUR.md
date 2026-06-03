# Path F Maintainer First Hour

This is the stress-case entry point for a new maintainer. Use it before touching code, restarting services, editing firmware, or rewriting documentation.

## Minute 0-10: Establish The Map

1. Read [`README.md`](README.md).
2. Read [`NAVIGATOR.md`](NAVIGATOR.md), especially the Do Not Get Lost rules.
3. Read [`TROUBLESHOOTING-ROUTES.md`](TROUBLESHOOTING-ROUTES.md) if there is an active failure.
4. Read [`GLOSSARY.md`](GLOSSARY.md) for any unfamiliar names before guessing.

## Minute 10-25: Identify Ownership

1. Decide whether the task is Nanofab-owned, IT-owned, CORES-owned, hardware/network-owned, or mixed.
2. If it involves root, UNIX accounts, VM backups, firewall, or base patching, stop and write it as an IT-bound item.
3. If it involves a redacted value, identify the approved source for that value before running code.

## Minute 25-40: Choose One Folder

Use this shortcut list:

- Server/browser/auth/chem/API: [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md)
- CORES to machine pages: [`UNanofabTools/hscdownloader`](tools/UNanofabTools/hscdownloader/README.md)
- Machine PC uploads: [`UNanofabTools/filetransfer`](tools/UNanofabTools/filetransfer/README.md)
- Pico firmware: [`NanofabToolkit/PicoHelperTools`](tools/NanofabToolkit/PicoHelperTools/README.md)
- Particle desktop GUI: [`NanofabToolkit/ParticleSensor`](tools/NanofabToolkit/ParticleSensor/README.md)
- Denton/ALD/Parylene/Precious Metal desktop tools: [`tools/INDEX.md`](tools/INDEX.md)
- Legacy server context: [`UNanofabTools/hscdisplayerserver`](tools/UNanofabTools/hscdisplayerserver/README.md)

## Minute 40-55: Read Only The Right Evidence

1. Read the chosen tool `README.md`.
2. Write down the external inputs that cannot be recovered from Path F.
3. Open source-file pages only for the files directly involved.
4. Use the breadcrumbs at the top of each source page if you land there from search.

## Minute 55-60: Decide The Next Action

Choose exactly one:

- Continue with a Nanofab code/documentation fix and fill out [`REBUILD-EVIDENCE-TEMPLATE.md`](REBUILD-EVIDENCE-TEMPLATE.md).
- Collect live evidence and create an IT/CORES/hardware ticket.
- Stop because a required secret, hardware device, or live system is unavailable.

Do not spend the first hour reading random source-file pages. The first hour is for orientation, ownership, and choosing the narrowest useful evidence path.
