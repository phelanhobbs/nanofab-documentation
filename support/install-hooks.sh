#!/bin/sh
# Installs a post-commit hook in UNanofabTools and NanofabToolkit that appends
# commit info to support/.pending-drift.jsonl in this documentation repo.
#
# Re-running this script is safe (overwrites existing hook).
#
# Usage:
#   bash support/install-hooks.sh

set -e

DOCS_REPO="$(cd "$(dirname "$0")/.." && pwd)"
DRIFT_FILE="$DOCS_REPO/support/.pending-drift.jsonl"

install_hook() {
    repo_path="$1"
    if [ ! -d "$repo_path/.git" ]; then
        echo "skip: $repo_path is not a git repo"
        return
    fi
    hook_path="$repo_path/.git/hooks/post-commit"
    cat > "$hook_path" <<HOOK
#!/bin/sh
# Auto-installed by nanofab-documentation/support/install-hooks.sh
# Appends a JSON line describing the new commit to the docs repo drift queue.
DRIFT_FILE="$DRIFT_FILE"
[ -d "\$(dirname "\$DRIFT_FILE")" ] || exit 0
REPO_NAME="\$(basename "\$(git rev-parse --show-toplevel)")"
SHA="\$(git rev-parse HEAD)"
TS="\$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SUBJECT="\$(git log -1 --pretty=%s | tr -d '\n' | sed 's/"/\\\\"/g')"
FILES_JSON="\$(git diff-tree --no-commit-id --name-only -r HEAD | python3 -c 'import sys,json; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))' 2>/dev/null)"
[ -z "\$FILES_JSON" ] && FILES_JSON="[]"
printf '{"repo":"%s","sha":"%s","timestamp":"%s","subject":"%s","files":%s}\n' \\
    "\$REPO_NAME" "\$SHA" "\$TS" "\$SUBJECT" "\$FILES_JSON" >> "\$DRIFT_FILE"
HOOK
    chmod +x "$hook_path"
    echo "installed: $hook_path"
}

install_hook "$DOCS_REPO/../UNanofabTools"
install_hook "$DOCS_REPO/../NanofabToolkit"

touch "$DRIFT_FILE"
echo
echo "Done. Drift queue: $DRIFT_FILE"
echo "When you want docs reconciled, tell Claude: \"reconcile docs from pending drift\""
