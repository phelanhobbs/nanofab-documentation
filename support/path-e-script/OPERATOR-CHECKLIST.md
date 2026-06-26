# Path E Operator Checklist

Use this before, during, and after any Path E handoff. It is the short operational checklist; the detailed rules are in `00-operator-protocol.md`, and the human presentation guide is [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md).

## Choose The Script Tier

| Situation | Use | Expected size |
|---|---|---:|
| You need a practical live handoff script with one file per module. | `support/path-e-script/` | 18,851 words |
| You need the smallest generated full Path E that still meets the requested long-form floor. | `support/path-e-script-minimum/scripts/` | 77,769 words |
| You need a much deeper generated version, but still below the 250k ceiling. | `support/path-e-script-medium/scripts/` | 217,669 words |
| You have no time limit and want the maximal generated handoff. | `support/path-e-script-verbose/scripts/` | 298,037 words |

If the goal is complete maintainer independence and time genuinely does not matter, use the verbose tier. If the goal is a human-run handoff that can actually fit into a few weeks, use the practical script pack first and pull in the longer tiers where a module needs extra depth.

## Before Session One

- Open `START-HERE.md` and read Path E.
- Open `support/PRESENTATION-GUIDE.md`.
- Open `support/path-e-script/TIMING.md`.
- Open the README for the chosen tier.
- Confirm the documentation repo branch and commit.
- Confirm `../UNanofabTools/` and `../NanofabToolkit/` exist if source verification is part of the session.
- Confirm whether live `nfhistory` access will be used.
- Confirm slides can be opened with speaker notes visible.
- Create a handoff notes file outside the repo first, for example `/tmp/nanofab-path-e/handoff-notes.md`.

## Start Here

For the practical script pack:

1. `support/path-e-script/00-operator-protocol.md`
2. `support/path-e-script/module-00-set-the-contract.md`
3. Continue through `module-21-final-no-contact-check.md` in filename order.

For any generated tier:

1. `<tier>/scripts/00-operator-and-session-plan.md`
2. `<tier>/scripts/module-00-set-the-contract.md`
3. Continue through `<tier>/scripts/module-21-final-no-contact-check.md` in filename order.

## During Each Module

- Show the relevant slide deck first.
- Open the matching layman README.
- Open the matching developer documentation.
- Open source code only when it proves the point.
- Run live commands only when they are safe and needed.
- Ask every explain-back question.
- Compare the answer to the expected answer in the script.
- Record missing facts, weak answers, drift, and open questions.

## Stop Conditions

Stop the session instead of continuing if:

- a command or screen would expose a secret value;
- the maintainer cannot explain the evidence path back;
- the source repo needed for verification is missing;
- live production state disagrees with the docs and the difference is not understood;
- an IT-owned boundary is being treated as Nanofab-owned work;
- a known issue cannot be classified by owner, severity, or evidence;
- the next step would require editing production during a handoff session.

## After Each Session

- Update the handoff notes with what was covered.
- Record homework and unresolved questions.
- Decide whether any doc or known-issues file needs an update before the next session.
- Keep Nanofab-actionable work separate from IT-ticket work.
- If documentation changed, run `bash support/audit.sh` and `git diff --check`.

## Completion Rule

Path E is complete only when the future maintainer can operate, audit, recover, and extend the system from written evidence. Finishing the files is not enough if any answer still depends on asking Faith.
