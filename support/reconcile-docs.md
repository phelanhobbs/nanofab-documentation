# Reconcile Docs Runbook

When the user says something like "I updated the server, make sure the docs are up to date" or "reconcile docs from pending drift", follow this runbook.

## Inputs

- `support/source-baseline.json` — last reconciled SHAs per source repo.
- `support/source-to-docs-map.json` — source-path-glob → docs-files mapping.
- `support/.pending-drift.jsonl` — append-only queue written by the post-commit hooks in sibling source repos. One JSON object per line: `{repo, sha, timestamp, subject, files}`.
- Sibling source repos at `../UNanofabTools` and `../NanofabToolkit`.

If `.pending-drift.jsonl` is missing or empty, fall back to diffing each source repo's current HEAD against the baseline SHA — the hook may not have been installed yet, or this may be a fresh clone.

## Steps

1. **Verify sibling repos exist.** If either is missing, stop and report.
2. **Collect changed files.** Union of all `files` entries in `.pending-drift.jsonl` per repo. If the file is empty, run `git diff --name-only <baseline-sha>..HEAD` in each repo.
3. **Map changed files to docs.** For each changed source path, find matching globs in `source-to-docs-map.json`. Collect the affected docs files. Track any source paths with NO mapping — these go into a "needs mapping" list.
4. **Inspect the changes.** For each affected source file, read the diff (`git diff <baseline-sha>..HEAD -- <path>` in the source repo). Read the affected docs files.
5. **Propose edits.** Generate concrete edit proposals for each affected doc, grouped by file. Do not apply them yet — show the user first.
6. **On user approval:**
   - Apply the edits.
   - Run `bash support/audit.sh` and report results.
   - Update `support/source-baseline.json` with the new HEAD SHAs for any repos that were reconciled. Bump the `updated` date.
   - Truncate `support/.pending-drift.jsonl` (`: > support/.pending-drift.jsonl`).
   - For any source paths with no mapping, propose additions to `source-to-docs-map.json`.

## Output format

Lead with a short summary table:

| Repo | Commits since baseline | Source files changed | Docs needing review |
|---|---:|---:|---:|

Then per docs file: what changed in source, what to update in docs, suggested edit.

End with the "needs mapping" list if any.

## Stop conditions

- Sibling repo missing.
- Source diff is huge (>500 files) — ask the user to scope it first.
- Source file referenced by a doc has been deleted — flag for user decision rather than auto-removing doc sections.
- A doc file's wording has been heavily customized beyond what the source change implies — propose, don't impose.

## Notes

- The hook uses python3 for JSON-encoding the file list. If python3 isn't available, `files` will be `[]` and you should fall back to baseline-diff.
- Hooks are installed by `bash support/install-hooks.sh` and are not version-controlled in the source repos. Re-run after any fresh clone.
