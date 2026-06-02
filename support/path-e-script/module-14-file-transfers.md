# Module 14 - File Transfers From Machine PCs

## Goal

The maintainer understands how machine-control-PC scripts upload logs, why personal-account dependencies matter, and what a safer long-term upload model would look like.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx`](../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- [`../../presentation/UNanofabTools/filetransfer/README.md`](../../presentation/UNanofabTools/filetransfer/README.md)
- [`../../documentation/UNanofabTools/filetransfer/README.md`](../../documentation/UNanofabTools/filetransfer/README.md)
- [`../../known-issues/UNanofabTools/filetransfer.md`](../../known-issues/UNanofabTools/filetransfer.md)

## Verbatim Script

READ ALOUD:

"The file-transfer scripts are the bridge from machine-control PCs to the `LogData` tree on `nfhistory`. This is not the same as CORES data. CORES data comes through `HSCDownloader.py` into `HSCDATA`. Machine-control-PC logs come through transfer scripts into `LogData`."

SHOW:

Open `File-Transfer-Scripts.pptx`.

READ ALOUD:

"These scripts matter because the website's machine log views are only as good as the uploaded files. If the scripts stop running, authenticate as the wrong account, write to the wrong path, or fail silently, the website can look alive while the underlying logs are stale."

"There is also an account-dependency issue. Some transfer workflows depend on a personal CADE account or personal setup. That is fragile for a handoff. A better Nanofab-side fix is a purpose-bound SSH key that authenticates as the shared `phelan` server account and is limited to the upload purpose. A cleaner long-term dedicated UNIX service account would require University IT because Nanofab cannot create UNIX accounts."

## Source Demo

DO:

Run:

```sh
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools ../../documentation/UNanofabTools/filetransfer ../../known-issues/UNanofabTools/filetransfer.md
```

READ ALOUD:

"This search finds upload mechanics, account names, target paths, and script types. The maintainer should know which scripts live on control PCs, which code lives in the repo, and which parts are not automatically visible from the server."

SHOW:

Open [`../../known-issues/UNanofabTools/filetransfer.md`](../../known-issues/UNanofabTools/filetransfer.md).

READ ALOUD:

"Known issues here should focus on reliability, account independence, safe key management, upload path correctness, and observability. It is not enough that a script worked on one person's workstation. The successor needs a repeatable operational model."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What data tree do file-transfer scripts write? | `LogData`. |
| How is `LogData` different from `HSCDATA`? | `LogData` is uploaded machine-control-PC logs; `HSCDATA` is CORES-derived CSV data written by `HSCDownloader.py`. |
| Why are personal-account dependencies risky? | Uploads can break when a person's CADE account, key, workstation, permissions, or employment status changes. |
| What is the Nanofab-side fix? | Use a purpose-bound SSH key authenticating as `phelan` for upload workflows, with documented controls. |
| What would require University IT? | A dedicated UNIX service account or per-machine/per-user UNIX accounts on `nfhistory`. |
| How would you tell whether uploads are fresh? | Check recent modification times, expected files per machine, transfer logs/output, and website data freshness. |
| What should be documented for each machine-control PC? | Script location, schedule/trigger, source path, target path, account/key used, expected files, failure signs, and owner. |

REQUIRE:

The maintainer can distinguish CORES downloader data from machine-control-PC uploaded logs and can describe the account-dependency risk.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify the difference between `HSCDATA` and `LogData`.
