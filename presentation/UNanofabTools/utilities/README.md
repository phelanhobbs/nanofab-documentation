# Utilities — A Plain-English Guide

This guide covers a handful of small, standalone helper programs in the repository that don't belong to any larger tool. Written for a non-coder; terms are defined as they appear.

These are odds-and-ends: a peak counter, a certificate converter, a database setup script, a remote-file fetcher, and one unfinished placeholder. They share nothing except being small, single-purpose helpers.

## peakCount.py — counting peaks in pressure data

When a vacuum or deposition process runs, the pressure rises and falls, producing "peaks" in the data. Counting those peaks is sometimes how you count cycles or events in a run.

`peakCount.py` is a command-line tool that reads a data file of pressure readings and counts the peaks for you. You can:

- give it one file or several at once,
- tune how big or distinct a bump must be to count as a peak,
- and optionally show a graph with the detected peaks marked.

It uses well-established math (a standard peak-finding algorithm) plus a little extra logic to catch a peak right at the end of a run, which simple algorithms often miss. There's a companion notes file (`peakCount.md`) and a fuller graphical version of this idea in the separate NanofabToolkit (the "ALD Peak Counter").

## gencert.py — preparing the website's security certificate

A secure website needs a **certificate** (the thing that gives you the padlock in the browser). Certificates often arrive in one combined file format (`.pfx`), but the server software needs them split into two separate files (a public `cert.pem` and a private `key.pem`).

`gencert.py` does that one-time conversion: it reads the combined `.pfx` file and writes out the two `.pem` files the server expects. It's run by hand whenever the certificate is renewed. (It writes the private key without a passphrase, which is what the server's setup expects — but that means the key file must be kept somewhere safe.)

## init_chem_db.py — setting up the chemical database

The chemical inventory (covered in the server sessions) lives in a PostgreSQL database. Before that database can be used, its tables have to be created.

`init_chem_db.py` does exactly that: it connects to the PostgreSQL database and runs the setup script (`chem_schema.sql`) that creates all the inventory tables and views. You run it once when first setting up the inventory on a new server. (Note: the live inventory has gained a few extra pieces over time that aren't in that setup script yet — the server's developer notes cover this.)

## fetch_ssh.py — grabbing a file off the server

This is a small **developer convenience**, not something normal users touch. It logs in to the server (through the university's secure gateway) and copies one specific file — the chemical-inventory code — down to the developer's machine, so it can be compared against the local copy.

It's the kind of personal helper a developer writes for themselves. It has the developer's own usernames and paths baked in, so it isn't meant for general use.

## NMonStore.py — an unfinished placeholder

This file is a **stub** — a skeleton that was started but never finished. As written, it just counts to five while writing numbers to a text file, with a comment literally saying "Your code logic goes here." It doesn't do anything useful yet. It appears to be the beginning of a "neutral monitor" data-storing program that was never completed. A future maintainer should either finish it or remove it.

## Summary

| File | One-line purpose | Status |
|------|------------------|--------|
| `peakCount.py` | Count peaks in pressure data files | Working |
| `gencert.py` | Convert a `.pfx` certificate into `.pem` files | Working (run by hand) |
| `init_chem_db.py` | Create the chemical-inventory database tables | Working (run once) |
| `fetch_ssh.py` | Developer helper to pull a file off the server | Personal/dev only |
| `NMonStore.py` | Intended data-storing monitor | Unfinished stub |

These are the workshop drawer of the project — small tools kept around for specific occasional jobs.
