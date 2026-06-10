#!/usr/bin/env bash
# audit.sh — mechanical-check pass over the handoff deliverables.
#
# Run from the repository root as `bash support/audit.sh`.
# Prints a starter report to stdout.
# The output is intended to be a first-pass aid for an LLM evaluator
# (see support/EVALUATE.md). It catches the easy mechanical stuff —
# missing files, broken markdown links, stale string references —
# so the LLM can focus on substance.
#
# Read-only. Modifies nothing.

set +e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -d "$SCRIPT_DIR/../presentation" ] && [ -d "$SCRIPT_DIR/../documentation" ]; then
  cd "$SCRIPT_DIR/.." || exit 1
else
  cd "$SCRIPT_DIR" || exit 1
fi

UNANOFABTOOLS_SRC="${UNANOFABTOOLS_SRC:-../UNanofabTools}"
NANOFABTOOLKIT_SRC="${NANOFABTOOLKIT_SRC:-../NanofabToolkit}"

c_red()   { printf '\033[31m%s\033[0m' "$1"; }
c_yel()   { printf '\033[33m%s\033[0m' "$1"; }
c_grn()   { printf '\033[32m%s\033[0m' "$1"; }
c_bold()  { printf '\033[1m%s\033[0m' "$1"; }

# Disable color if not on a terminal
if [ ! -t 1 ]; then
  c_red()  { printf '%s' "$1"; }
  c_yel()  { printf '%s' "$1"; }
  c_grn()  { printf '%s' "$1"; }
  c_bold() { printf '%s' "$1"; }
fi

sec() { printf '\n\n%s\n' "$(c_bold "===== $1 =====")"; }

# ----------------------------------------------------------------------
# 0. Where are we?
# ----------------------------------------------------------------------
sec "0. CONTEXT"
echo "  pwd:       $(pwd)"
echo "  date:      $(date)"
echo "  hostname:  $(hostname 2>/dev/null)"
echo
echo "  Documentation trees:"
for d in presentation documentation known-issues; do
  if [ -d "$d" ]; then
    echo "    $(c_grn '✓') $d/"
  else
    echo "    $(c_red '✗') $d/  (MISSING)"
  fi
done
echo
echo "  Adjacent source repos for source-code verification:"
for d in "$UNANOFABTOOLS_SRC" "$NANOFABTOOLKIT_SRC"; do
  if [ -d "$d/.git" ] || [ -d "$d" ]; then
    echo "    $(c_grn '✓') $d/"
  else
    echo "    $(c_yel '!') $d/  (not present beside this docs repo)"
  fi
done
echo
echo "  Top-level orchestrator files:"
for f in START-HERE.md support/PRESENTATION-GUIDE.md support/path-e-script/README.md support/path-e-script/TIMING.md support/path-e-script-minimum/README.md support/path-e-script-medium/README.md support/path-e-script-verbose/README.md support/path-f-reconstruction/README.md support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md support/path-f-reconstruction/NAVIGATOR.md support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md support/path-f-reconstruction/GLOSSARY.md support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md support/path-f-reconstruction/REBUILD-EVIDENCE-TEMPLATE.md support/path-f-reconstruction/FIXTURE-AND-EVIDENCE-INDEX.md support/path-f-reconstruction/tools/INDEX.md support/path-f-reconstruction/WORDCOUNT.md support/EVALUATE.md support/REDACTION-NOTE.md support/audit.sh; do
  if [ -f "$f" ]; then
    echo "    $(c_grn '✓') $f  ($(wc -l <"$f" | tr -d ' ') lines)"
  else
    echo "    $(c_red '✗') $f  (MISSING)"
  fi
done

# ----------------------------------------------------------------------
# 1. Coverage matrix
# ----------------------------------------------------------------------
sec "1. COVERAGE MATRIX"

UNANOFAB_TOOLS=(flaskserver serveraccess liveserver hscdownloader filetransfer dattools utilities picofirmware particlepctools hscdisplayerserver)
NANOFABKIT_TOOLS=(PicoHelperTools ParticleSensor ParalyneReader ALDPeakCounter DentonDecoder PreciousMetalReader)

check_tool() {
  local repo="$1" tool="$2" needs_issues="$3"
  local layman="presentation/$repo/$tool/README.md"
  local slidesdir="presentation/$repo/$tool/slides"
  local docdir="documentation/$repo/$tool"
  local issues="known-issues/$repo/$tool.md"

  local layman_ok slides_ok docs_ok issues_ok pptx_count

  [ -f "$layman" ] && layman_ok="$(c_grn '✓')" || layman_ok="$(c_red '✗')"
  if [ -d "$slidesdir" ]; then
    pptx_count=$(find "$slidesdir" -maxdepth 1 -name "*.pptx" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$pptx_count" -ge 1 ]; then
      slides_ok="$(c_grn '✓') ($pptx_count)"
    else
      slides_ok="$(c_yel 'dir-no-pptx')"
    fi
  else
    slides_ok="$(c_red '✗')"
  fi
  if [ -d "$docdir" ]; then
    local mdcount; mdcount=$(find "$docdir" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    docs_ok="$(c_grn '✓') ($mdcount md)"
  else
    docs_ok="$(c_red '✗')"
  fi
  if [ "$needs_issues" = "yes" ]; then
    [ -f "$issues" ] && issues_ok="$(c_grn '✓')" || issues_ok="$(c_red '✗')"
  else
    issues_ok="(n/a)"
  fi

  printf '  %-16s %-22s %-12s %-16s %-12s %s\n' "$repo" "$tool" "$layman_ok" "$slides_ok" "$docs_ok" "$issues_ok"
}

printf '  %-16s %-22s %-12s %-16s %-12s %s\n' "Repo" "Tool" "Layman" "Slides" "Dev docs" "Issues"
printf '  %-16s %-22s %-12s %-16s %-12s %s\n' "----" "----" "------" "------" "--------" "------"
for t in "${UNANOFAB_TOOLS[@]}"; do
  check_tool "UNanofabTools" "$t" "yes"
done
for t in "${NANOFABKIT_TOOLS[@]}"; do
  check_tool "NanofabToolkit" "$t" "yes"
done

echo
echo "  Master indexes:"
for p in \
  presentation/UNanofabTools/README.md \
  documentation/UNanofabTools/README.md \
  known-issues/UNanofabTools/README.md \
  presentation/NanofabToolkit/README.md \
  documentation/NanofabToolkit/README.md \
  known-issues/NanofabToolkit/README.md ; do
  if [ -f "$p" ]; then
    echo "    $(c_grn '✓') $p"
  else
    echo "    $(c_red '✗') $p  (MISSING)"
  fi
done

# ----------------------------------------------------------------------
# 2. Stale-string checks
# ----------------------------------------------------------------------
sec "2. STALE STRINGS (should be zero hits, or only in snapshots/known-issues meta)"

# Search scope: handoff content only, not the snapshots (raw output) or this
# evaluator prompt (which intentionally contains stale examples to search for).
SEARCH=(presentation documentation known-issues START-HERE.md)
EXCLUDE_GREP=(--exclude-dir=snapshots --exclude-dir=_build --exclude='*.pptx' --exclude='.DS_Store')

run_check() {
  local label="$1" pat="$2" extra="$3"
  printf '\n  Check: %s\n' "$(c_bold "$label")"
  local out
  out=$(grep -rn "${EXCLUDE_GREP[@]}" -E "$pat" "${SEARCH[@]}" 2>/dev/null)
  if [ -z "$out" ]; then
    echo "    $(c_grn 'clean — 0 hits')"
  else
    local n; n=$(echo "$out" | wc -l | tr -d ' ')
    echo "    $(c_yel "$n hits — review the surrounding context")"
    echo "$out" | sed 's/^/    /' | head -25
    [ "$n" -gt 25 ] && echo "    ... (showing first 25 of $n)"
  fi
  [ -n "$extra" ] && echo "    note: $extra"
}

# Old install path
run_check "Stale ~/UNanofabTools path (should be ~/server/UNanofabTools after the 2026-06-01 phelan snapshot)" \
  '~/UNanofabTools[/ ]' \
  "any hit outside snapshots/ is stale; the install lives at ~/server/UNanofabTools/"

# Stale separate HSCDownloader
run_check "Stale ~/HSCDownloader references (HSCDownloader.py lives in the same install dir, no separate folder)" \
  '~/HSCDownloader[/ ]|cd ~/HSCDownloader' \
  "should be 0 hits in human-authored content"

# Chem-external
run_check "Stale chem-external references (chem PostgreSQL is LOCAL on 127.0.0.1:5432)" \
  'external.*PostgreSQL|external chem|chem.*external|external server.*chem|separate PostgreSQL' \
  "any hit outside snapshots/ should be reframed as local"

# "No backups" without IT framing
run_check "Stale 'no backups' framing (backups are IT-handled — find any place that says 'no backups' without that context)" \
  'no backups|No backups|nothing backs up|backups are missing' \
  "context-check: every hit should be followed within ~5 lines by 'IT' or 'University IT' or 'off-box'"

# "Per-person UNIX account" without IT-ticket framing
run_check "Stale 'create UNIX users' recommendations (Nanofab can't useradd — must be tagged as IT ticket)" \
  'create UNIX|create per-person|per-person UNIX account|useradd' \
  "context-check: every hit should be followed within ~10 lines by 'IT' or 'IT ticket'"

# "Tighten root SSH" as Nanofab finding
run_check "Stale 'tighten root SSH' as Nanofab to-do (root SSH is IT's path; chmod is an IT ticket)" \
  'tighten root|disable.*root SSH|PermitRootLogin prohibit|PermitRootLogin no' \
  "should be 0 hits as a Nanofab recommendation — context should always say IT-bound"

# iceolate context — should always be tagged IT
echo
printf '  Check: %s\n' "$(c_bold "Every iceolate mention should be tagged as IT's host")"
ic_hits=$(grep -rn "${EXCLUDE_GREP[@]}" -E 'iceolate' "${SEARCH[@]}" 2>/dev/null)
if [ -z "$ic_hits" ]; then
  echo "    $(c_yel 'no hits — surprising; iceolate should be documented as IT host')"
else
  it_tagged=$(echo "$ic_hits" | grep -i -c 'IT\|university' | tr -d ' ')
  total=$(echo "$ic_hits" | wc -l | tr -d ' ')
  echo "    $total iceolate references found; $it_tagged on the same line mention IT"
  echo "    (lines without 'IT' may still be correctly tagged in surrounding context — verify manually)"
  echo "$ic_hits" | sed 's/^/    /' | head -10
fi

# ----------------------------------------------------------------------
# 3. Internal markdown link check
# ----------------------------------------------------------------------
sec "3. BROKEN INTERNAL MARKDOWN LINKS AND ANCHORS"

# Extract markdown links of the form [text](path) where path is relative and points at a .md/.pptx/.sh/etc.
# We only check links that look like local paths (no http(s)://, no mailto:, no computer://).
total_links=0
broken_links=0
broken_list=$(mktemp)

find presentation documentation known-issues support -name "*.md" 2>/dev/null > /tmp/md_files_$$
# include the root orchestrator files too
echo "START-HERE.md" >> /tmp/md_files_$$
echo "README.md" >> /tmp/md_files_$$

while IFS= read -r mdfile; do
  [ -f "$mdfile" ] || continue
  dir=$(dirname "$mdfile")
  # extract paths inside ](...) that don't start with a scheme
  perl -ne 'while (/\[([^\]]+)\]\(([^)]+)\)/g) { print "$2\n"; }' "$mdfile" 2>/dev/null \
    | grep -v -E '^(https?|mailto|computer|tel|ftp)://' \
    | grep -v '^#' \
    | while IFS= read -r link; do
      [ -z "$link" ] && continue
      # strip any #anchor
      target="${link%%#*}"
      [ -z "$target" ] && continue
      # resolve relative to mdfile's directory
      if [[ "$target" = /* ]]; then
        full="$target"
      else
        full="$dir/$target"
      fi
      total_links=$((total_links + 1))
      if [ ! -e "$full" ]; then
        broken_links=$((broken_links + 1))
        echo "    $mdfile  →  $link" >> "$broken_list"
      fi
    done
done < /tmp/md_files_$$

# Re-count after the subshell (since the while-loop ran in a subshell, the counts above didn't persist)
anchor_list=$(mktemp)
python3 - "$anchor_list" <<'PY'
from pathlib import Path
import re
import sys

out = Path(sys.argv[1])
roots = [Path("presentation"), Path("documentation"), Path("known-issues"), Path("support")]
files = []
for root in roots:
    if root.exists():
        files.extend(root.rglob("*.md"))
for extra in (Path("START-HERE.md"), Path("README.md")):
    if extra.exists():
        files.append(extra)

def slugify(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"\s+", "-", text.strip())
    text = re.sub(r"-+", "-", text)
    return text

def anchors_for(path: Path) -> set[str]:
    anchors = set()
    counts = {}
    try:
        lines = path.read_text(errors="ignore").splitlines()
    except OSError:
        return anchors
    for line in lines:
        m = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if not m:
            continue
        base = slugify(m.group(2).strip())
        if not base:
            continue
        count = counts.get(base, 0)
        counts[base] = count + 1
        anchors.add(base if count == 0 else f"{base}-{count}")
    return anchors

cache: dict[Path, set[str]] = {}
bad = []
link_re = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
for mdfile in sorted(set(files)):
    text = mdfile.read_text(errors="ignore")
    for _label, raw in link_re.findall(text):
        if re.match(r"^(https?|mailto|computer|tel|ftp)://", raw):
            continue
        if "#" not in raw:
            continue
        target, anchor = raw.split("#", 1)
        if not anchor:
            continue
        target_path = mdfile if not target else (Path(target) if target.startswith("/") else mdfile.parent / target)
        if not target_path.exists() or target_path.suffix.lower() != ".md":
            continue
        target_path = target_path.resolve()
        if target_path not in cache:
            cache[target_path] = anchors_for(target_path)
        if anchor not in cache[target_path]:
            bad.append(f"    {mdfile}  ->  {raw}")

out.write_text("\n".join(bad) + ("\n" if bad else ""))
PY

# Case-sensitivity pass: `[ -e ]` is case-insensitive on default macOS volumes,
# so a link like 02-How-it-Starts.pptx resolves locally but 404s on Linux.
# Compare each path component against the actual directory listing instead.
case_list=$(mktemp)
python3 - "$case_list" <<'PY'
from pathlib import Path, PurePath
import os, re, sys

out = Path(sys.argv[1])
roots = [Path("presentation"), Path("documentation"), Path("known-issues"), Path("support")]
files = []
for root in roots:
    if root.exists():
        files.extend(root.rglob("*.md"))
for extra in (Path("START-HERE.md"), Path("README.md")):
    if extra.exists():
        files.append(extra)

def exists_cs(p: str) -> bool:
    cur = Path(".")
    for part in PurePath(p).parts:
        try:
            entries = os.listdir(cur)
        except OSError:
            return False
        if part not in entries:
            return False
        cur = cur / part
    return True

bad = []
link_re = re.compile(r"\[([^\]]+)\]\(([^)\s#]+)(?:#[^)]*)?\)")
for mdfile in sorted(set(files)):
    text = mdfile.read_text(errors="ignore")
    for _label, target in link_re.findall(text):
        if re.match(r"^(https?|mailto|computer|tel|ftp)://", target) or target.startswith("#"):
            continue
        rel = os.path.normpath(mdfile.parent / target)
        if rel.startswith(".."):
            continue  # outside the repo (sibling source repos); plain existence is checked above
        if os.path.exists(Path(rel)) and not exists_cs(rel):
            bad.append(f"    {mdfile}  ->  {target}  (case mismatch vs on-disk name)")

out.write_text("\n".join(bad) + ("\n" if bad else ""))
PY

broken_count=$(wc -l < "$broken_list" | tr -d ' ')
anchor_count=$(wc -l < "$anchor_list" | tr -d ' ')
case_count=$(wc -l < "$case_list" | tr -d ' ')
if [ "$broken_count" -eq 0 ]; then
  echo "  $(c_grn 'No broken internal links found.')"
else
  echo "  $(c_red "$broken_count broken internal links:")"
  head -50 "$broken_list"
  [ "$broken_count" -gt 50 ] && echo "  ... (showing first 50)"
fi
if [ "$anchor_count" -eq 0 ]; then
  echo "  $(c_grn 'No broken internal markdown anchors found.')"
else
  echo "  $(c_red "$anchor_count broken internal markdown anchors:")"
  head -50 "$anchor_list"
  [ "$anchor_count" -gt 50 ] && echo "  ... (showing first 50)"
fi
if [ "$case_count" -eq 0 ]; then
  echo "  $(c_grn 'No case-mismatched internal links found.')"
else
  echo "  $(c_red "$case_count case-mismatched internal links (will 404 on case-sensitive filesystems):")"
  head -50 "$case_list"
  [ "$case_count" -gt 50 ] && echo "  ... (showing first 50)"
fi
rm -f "$broken_list" "$anchor_list" "$case_list" /tmp/md_files_$$

# ----------------------------------------------------------------------
# 4. Snapshot presence
# ----------------------------------------------------------------------
sec "4. LIVESERVER SNAPSHOTS"

snapdir=documentation/UNanofabTools/liveserver/snapshots
if [ -d "$snapdir" ]; then
  echo "  Snapshots present:"
  ls -la "$snapdir"/*.txt 2>/dev/null | sed 's/^/    /'
  snap_count=$(find "$snapdir" -maxdepth 1 -name "*.txt" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$snap_count" -eq 0 ]; then
    echo "  $(c_yel 'No snapshots in snapdir — the live-server doc cannot be verified against fresh data.')"
  fi
else
  echo "  $(c_red 'snapshots/ directory missing')"
fi

# ----------------------------------------------------------------------
# 5. Source vs docs spot-checks
# ----------------------------------------------------------------------
sec "5. SOURCE vs DOCS SPOT-CHECKS"
echo "  Source roots:"
echo "    UNanofabTools:  $UNANOFABTOOLS_SRC"
echo "    NanofabToolkit: $NANOFABTOOLKIT_SRC"
echo

# 5a. env var schema
echo "  5a. Env var names in config/config.py vs documented in 03-configuration-reference.md"
if [ -f "$UNANOFABTOOLS_SRC/config/config.py" ]; then
  src_envs=$(grep -oE "os\.getenv\(['\"]([A-Z_][A-Z0-9_]+)['\"]" "$UNANOFABTOOLS_SRC/config/config.py" | sed -E "s/os.getenv\(['\"]//; s/['\"]$//" | sort -u)
  doc_file=documentation/UNanofabTools/flaskserver/03-configuration-reference.md
  if [ -f "$doc_file" ]; then
    missing_in_doc=0
    while IFS= read -r e; do
      [ -z "$e" ] && continue
      if ! grep -q "$e" "$doc_file"; then
        echo "    $(c_yel "env var $e is in config.py but not mentioned in 03-configuration-reference.md")"
        missing_in_doc=$((missing_in_doc + 1))
      fi
    done <<< "$src_envs"
    [ "$missing_in_doc" -eq 0 ] && echo "    $(c_grn 'All config.py env vars are mentioned in the docs.')"
  else
    echo "    $(c_red "03-configuration-reference.md missing")"
  fi
else
  echo "    $(c_yel "$UNANOFABTOOLS_SRC/config/config.py not present — skipping")"
fi

# 5b. Route count
echo
echo "  5b. Number of @app.route / blueprint route decorators"
if [ -d "$UNANOFABTOOLS_SRC/app/blueprints" ]; then
  route_count=$(
    {
      grep -h -E '^[[:space:]]*@[a-z_]+\.route\(' \
        "$UNANOFABTOOLS_SRC/app/blueprints/auth.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/tasks.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/admin.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/machines.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/api.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/chem_inventory.py" \
        "$UNANOFABTOOLS_SRC/app/blueprints/particle_demo_will.py" 2>/dev/null
      grep -h -E '^[[:space:]]*@app\.route\(' "$UNANOFABTOOLS_SRC/app/__init__.py" 2>/dev/null
    } | wc -l | tr -d ' '
  )
  echo "    Registered route decorators in source: $route_count"
  echo "    (Excludes unregistered duplicate blueprints and commented-out decorators.)"
  echo "    Compare against documentation/UNanofabTools/flaskserver/05-http-api-reference.md and 15-Endpoint-Reference presentation material; this count is informational unless paired with a route-by-route audit."
else
  echo "    $(c_yel "$UNANOFABTOOLS_SRC/app/blueprints not present — skipping")"
fi

# 5c. NanofabToolkit canonical content
echo
echo "  5c. NanofabToolkit canonical content (PicoHelperTools, ParticleSensor)"
for sub in PicoHelperTools ParticleSensor; do
  d="$NANOFABTOOLKIT_SRC/$sub"
  if [ -d "$d" ]; then
    fc=$(find "$d" -maxdepth 2 -type f \( -name "*.py" -o -name "*.md" \) | wc -l | tr -d ' ')
    if [ "$fc" -gt 0 ]; then
      echo "    $(c_grn '✓') $NANOFABTOOLKIT_SRC/$sub has $fc .py/.md files (canonical, as claimed)"
    else
      echo "    $(c_red '✗') $NANOFABTOOLKIT_SRC/$sub is empty or near-empty (claimed canonical, but no content)"
    fi
  else
    echo "    $(c_red '✗') $NANOFABTOOLKIT_SRC/$sub directory missing"
  fi
done

# ----------------------------------------------------------------------
# 6. Quick line/file count summary
# ----------------------------------------------------------------------
sec "6. SIZE SUMMARY"

count_md() {
  local dir="$1"
  if [ -d "$dir" ]; then
    local f l
    f=$(find "$dir" -name "*.md" | wc -l | tr -d ' ')
    l=$(find "$dir" -name "*.md" -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
    printf '  %-40s %4s files, %7s lines\n' "$dir" "$f" "$l"
  fi
}

count_md presentation/UNanofabTools
count_md documentation/UNanofabTools
count_md known-issues/UNanofabTools
count_md presentation/NanofabToolkit
count_md documentation/NanofabToolkit
count_md known-issues/NanofabToolkit

deck_count=$(find presentation -name "*.pptx" 2>/dev/null | wc -l | tr -d ' ')
echo
echo "  Total .pptx decks: $deck_count"

# ----------------------------------------------------------------------
# 7. Done
# ----------------------------------------------------------------------
sec "7. DONE"
echo "  This is a mechanical pass. An LLM evaluator should now read support/EVALUATE.md"
echo "  and use this report as a starting point. Refer to sections by number."
echo
