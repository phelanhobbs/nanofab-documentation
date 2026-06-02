# Module 13 - HSCDownloader And CORES Data

## Goal

The maintainer understands `HSCDownloader.py`, where it lives, what it pulls, what it writes, how it runs today, and what risks belong in the maintenance plan.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`](../../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- [`../../presentation/UNanofabTools/hscdownloader/README.md`](../../presentation/UNanofabTools/hscdownloader/README.md)
- [`../../documentation/UNanofabTools/hscdownloader/README.md`](../../documentation/UNanofabTools/hscdownloader/README.md)
- [`../../known-issues/UNanofabTools/hscdownloader.md`](../../known-issues/UNanofabTools/hscdownloader.md)

## Verbatim Script

READ ALOUD:

"`HSCDownloader.py` is the CORES to `HSCDATA` supply line. It pulls machine usage data from the CORES/n8n side and writes CSV files that the website displays. If the downloader stops, the website may still be up, but machine data can become stale."

SHOW:

Open `HSC-Downloader.pptx`.

READ ALOUD:

"The first fact to preserve is location. The production downloader is not in a separate `~/HSCDownloader` directory. `HSCDownloader.py` lives in the same production install directory as `run.py`: `/home/phelan/server/UNanofabTools/`. Any instruction saying to `cd ~/HSCDownloader` is stale."

"The second fact is supervision. The downloader currently runs inside the `downloader` tmux session, not systemd. That means it has the same silent-failure and reboot risks as the Flask app."

## Source Demo

DO:

Show:

```text
../UNanofabTools/HSCDownloader.py
../../documentation/UNanofabTools/hscdownloader/README.md
../../known-issues/UNanofabTools/hscdownloader.md
```

DO:

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py ../../documentation/UNanofabTools/hscdownloader/README.md ../../known-issues/UNanofabTools/hscdownloader.md
```

READ ALOUD:

"This search connects downloader behavior to docs and known issues. It should reveal where requests are made, where data is saved, how time or scheduling is handled, and whether any secret-bearing patterns need attention."

## Risk Frame

READ ALOUD:

"The downloader risks are operational and security-related. Operationally, it should be supervised, logged, monitored, and checked for freshness. Security-wise, any token or credential used to call CORES or n8n must not be hard-coded in source long term. It should live in protected configuration and be rotated if exposed."

"A maintainer should know how to answer: Is the downloader running? When did it last write `HSCDATA`? What happens if CORES is down? Where are errors logged? Is the credential protected? How would we restart it? How would we migrate it to systemd?"

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `HSCDownloader.py` do? | Pulls CORES/n8n machine usage data and writes CSV outputs used by the website. |
| Where does it live in production? | `/home/phelan/server/UNanofabTools/`, beside `run.py`. |
| What tmux session owns it today? | `downloader`. |
| What data tree does it write? | `HSCDATA`. |
| Why can the website be up while CORES data is stale? | nginx/Flask can be healthy while the downloader has stopped, errored, or stopped writing fresh CSVs. |
| What is the reliability improvement for the downloader? | Move it from tmux-only operation to a supervised service with restart/logging/health checks, such as systemd. |
| What is the secret-handling improvement for the downloader? | Move credentials/tokens out of source into protected config and rotate any exposed values. |

REQUIRE:

The maintainer can locate `HSCDownloader.py`, explain its data product, and describe how to check whether data is fresh.

## Stop Point

STOP POINT:

Stop here if the maintainer says there is a separate production `~/HSCDownloader` install. Correct the path and revisit the live-server facts.
