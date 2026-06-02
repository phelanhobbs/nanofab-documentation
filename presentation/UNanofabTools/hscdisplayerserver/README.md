# HSC Displayer Server (Legacy) — A Plain-English Guide

This guide explains `HSCDisplayerServer.py`, the **original, all-in-one version of the website's server**. Written for a non-coder; terms are defined as they appear.

## What it is

`HSCDisplayerServer.py` is a single, very large program (about 2,600 lines) that was the cleanroom website's server before it was rewritten. It does everything the current website does — logins, the task list, the machine pages, accepting sensor data — but all packed into **one file**.

The current website is a tidied-up, reorganized version of this. If you've seen the "Flask server" sessions, this is the predecessor: same jobs, older structure. It's labeled "legacy" because new work happens in the new version, not here.

## Why it's worth understanding

Two reasons:

1. **History.** Knowing where the current server came from explains a lot about why the new one is organized the way it is.
2. **It may still be the running one.** Depending on the deployment, this monolith — or the new version — is what actually serves the site. A maintainer needs to know which is live and how this one works.

## What it does

All the same things the current website does, including:

- **Logins** — usernames, passwords, two-factor via Duo, admin permissions.
- **The task list** — assign, claim, complete, attach files.
- **Machine pages** — tables and graphs for each tool, plus log-file browsing and downloads.
- **Accepting sensor data** — the same Raspberry Pi endpoints (particle data, Parylene batches, Denton 18 pressures).
- **An admin panel** — manage users and permissions.

The big difference from the new version is purely organizational: here it's all in one file instead of being split into tidy sections.

## How it's built (and how that differs from the new version)

- The new website is built on **Flask**, a popular framework that handles a lot of the plumbing for you and encourages splitting code into neat sections.
- This legacy server is built on Python's **built-in web server tools** instead — more bare-bones, with the developer writing more of the plumbing by hand.

In practice that means this file contains one enormous "switchboard" that looks at each incoming web address and decides what to do — login here, machine page there, sensor data over there — all in two long stretches of code (one for page views, one for form submissions and uploads). The new version breaks that switchboard into separate, labeled chapters.

Everything else is conceptually the same as the new server: it stores users and tasks in small databases, reads machine spreadsheets to draw the pages, hashes passwords so they're never stored in plain text, requires two-factor login, and cleans up old sessions in the background.

## A "debug mode" switch

Like the new server, this one has a **debug mode** for testing on a personal computer — it skips the two-factor and encryption steps so a developer can work locally. The code is emphatic that this must **never** be turned on for the real server. Same rule as the new version.

## The bottom line

Think of `HSCDisplayerServer.py` as the **first draft** of the website's server: complete and functional, but everything in one big file. The current Flask version is the **clean rewrite** of the same idea. This guide exists so that anyone maintaining the system understands the original — where the features came from, how it's wired, and why the rewrite was organized the way it was.

For the deeper, developer-level details (the exact addresses it answers and how each is handled), see the successor documentation for this tool.
