#!/usr/bin/env python3
"""Build expanded Path E script tiers.

The generated tiers deliberately keep the concise v1 pack intact. Each tier is
assembled from:

- the existing Path E script pack,
- sanitized handoff documentation excerpts,
- slide-source speaker-note text where useful,
- original presenter rehearsal/drill sections.

Generated files avoid Markdown links in embedded excerpts so support/audit.sh can
still validate intentional links without being confused by copied relative links.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

SCRIPT_SRC = ROOT / "support" / "path-e-script"

TIERS = {
    "path-e-script-minimum": {
        "label": "Minimum Acceptable Full Path E",
        "target_min": 50_000,
        "target_max": 100_000,
        "doc_limit": 34,
        "include_slide_notes": False,
        "deep_passes": 2,
        "session_count": 8,
    },
    "path-e-script-medium": {
        "label": "Medium Full Path E",
        "target_min": 100_000,
        "target_max": 250_000,
        "doc_limit": None,
        "include_slide_notes": True,
        "deep_passes": 5,
        "session_count": 12,
    },
    "path-e-script-verbose": {
        "label": "Verbose Maximal Path E",
        "target_min": 250_000,
        "target_max": None,
        "doc_limit": None,
        "include_slide_notes": True,
        "deep_passes": 18,
        "session_count": 22,
    },
}

CORE_DOCS = [
    "START-HERE.md",
    "README.md",
    "support/PRESENTATION-GUIDE.md",
    "support/EVALUATE.md",
    "support/REDACTION-NOTE.md",
    "presentation/UNanofabTools/flaskserver/README.md",
    "presentation/UNanofabTools/flaskserver/01-Server-Overview.md",
    "presentation/UNanofabTools/liveserver/README.md",
    "presentation/UNanofabTools/serveraccess/README.md",
    "documentation/UNanofabTools/flaskserver/01-architecture.md",
    "documentation/UNanofabTools/flaskserver/02-getting-started.md",
    "documentation/UNanofabTools/flaskserver/03-configuration-reference.md",
    "documentation/UNanofabTools/flaskserver/04-database-schema.md",
    "documentation/UNanofabTools/flaskserver/05-http-api-reference.md",
    "documentation/UNanofabTools/flaskserver/06-service-layer-reference.md",
    "documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md",
    "documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md",
    "documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md",
    "documentation/UNanofabTools/flaskserver/10-development-guide.md",
    "documentation/UNanofabTools/serveraccess/README.md",
    "documentation/UNanofabTools/liveserver/README.md",
    "documentation/UNanofabTools/hscdownloader/README.md",
    "documentation/UNanofabTools/filetransfer/README.md",
    "documentation/NanofabToolkit/PicoHelperTools/README.md",
    "documentation/NanofabToolkit/ParticleSensor/README.md",
    "known-issues/UNanofabTools/README.md",
    "known-issues/UNanofabTools/liveserver.md",
    "known-issues/UNanofabTools/serveraccess.md",
    "known-issues/UNanofabTools/flaskserver.md",
    "known-issues/UNanofabTools/hscdownloader.md",
    "known-issues/UNanofabTools/filetransfer.md",
    "known-issues/UNanofabTools/picofirmware.md",
    "known-issues/UNanofabTools/particlepctools.md",
    "known-issues/NanofabToolkit/README.md",
]

MODULES = [
    ("00", "Set The Contract", "workspace, source-of-truth order, safety, and documentation layout"),
    ("01", "Big Picture Of The Server", "the system map, data producers, and ownership boundaries"),
    ("02", "Live Server", "verified production state, tmux, nginx, PostgreSQL, and IT ownership"),
    ("03", "Server Access", "two-hop SSH, shared phelan account, tmux safety, and survey snapshots"),
    ("04", "Flask Startup", "run.py, app factory, extensions, blueprints, and startup drift"),
    ("05", "Configuration And Local Development", "environment variables, secret handling, paths, and local setup"),
    ("06", "Authentication And Admin", "login, authorization, Duo, admin guards, and password handling"),
    ("07", "Tasks", "normal user workflows, task routes, services, database writes, and uploads"),
    ("08", "Machines And Logs", "HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability"),
    ("09", "Device APIs", "Pico/device payloads, unauthenticated routes, and data contracts"),
    ("10", "Chemical Inventory", "local PostgreSQL, schema, routes, barcodes, moves, removals, and reports"),
    ("11", "Request Lifecycle And Endpoints", "browser/device request flow and route drift audits"),
    ("12", "Security Model", "strengths, gaps, secrets, route risks, and IT/Nanofab security split"),
    ("13", "HSCDownloader", "CORES ingestion, HSCDATA freshness, credentials, and supervision"),
    ("14", "File Transfers", "machine-control-PC upload scripts, LogData, and account dependencies"),
    ("15", "Pico And Particle", "canonical NanofabToolkit firmware/viewer source and sensor identity"),
    ("16", "Other Tools", "desktop utilities, data tools, priority, and maintenance scope"),
    ("17", "Legacy Server", "deprecated hscdisplayerserver context and retirement posture"),
    ("18", "Known Issues Triage", "maintenance plan, severity, evidence, owners, and IT tickets"),
    ("19", "Path D Audit Practice", "mechanical audit, source drift, live drift, and evidence notes"),
    ("20", "Operational Scenarios", "outage, stale data, chem DB, access, secrets, and docs/live drift"),
    ("21", "Final No-Contact Check", "exit exam, leave-behind artifacts, and independence criteria"),
]

PASS_NAMES = [
    "Orientation pass",
    "Evidence pass",
    "Source-code pass",
    "Live-state pass",
    "Failure-mode pass",
    "Maintenance-planning pass",
    "Security pass",
    "Recovery pass",
    "Documentation-drift pass",
    "Teach-back pass",
    "Homework-review pass",
    "Quarterly-audit pass",
    "Backup-and-restore pass",
    "Ownership-boundary pass",
    "No-contact rehearsal pass",
    "Operator-error pass",
    "Data-integrity pass",
    "Final-repetition pass",
]


def words(text: str) -> int:
    return len(text.split())


def read(path: Path) -> str:
    return path.read_text(errors="ignore")


def sanitize(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (reference path: \2)", text)
    return "\n".join(line.rstrip() for line in text.splitlines()) + "\n"


def extract_slide_strings(text: str) -> str:
    strings = []
    for match in re.finditer(r'"((?:[^"\\]|\\.){20,})"', text, re.S):
        s = match.group(1)
        try:
            s = json.loads(f'"{s}"')
        except json.JSONDecodeError:
            s = (
                s.replace(r"\'", "'")
                .replace(r"\"", '"')
                .replace(r"\n", "\n")
                .replace(r"\t", "\t")
                .replace(r"\\", "\\")
            )
        s = re.sub(r"\s+", " ", s).strip()
        if len(s.split()) >= 5:
            strings.append(s)
    return "\n".join(f"- {s}" for s in strings)


def slug(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text


def module_filename(module_num: str, title: str) -> str:
    return f"module-{module_num}-{slug(title)}.md"


def all_docs() -> list[Path]:
    found = []
    for base in ["documentation", "presentation", "known-issues"]:
        found.extend((ROOT / base).rglob("*.md"))
    return sorted(found, key=lambda p: str(p.relative_to(ROOT)))


def selected_docs(limit: int | None) -> list[Path]:
    paths = []
    seen = set()
    for rel in CORE_DOCS:
        p = ROOT / rel
        if p.exists() and p not in seen:
            paths.append(p)
            seen.add(p)
    if limit is None:
        for p in all_docs():
            if p not in seen:
                paths.append(p)
                seen.add(p)
    return paths if limit is None else paths[:limit]


def v1_module_text(module_num: str, title: str) -> str:
    specific = SCRIPT_SRC / module_filename(module_num, title)
    if specific.exists():
        return (
            f"\n\n# Existing Path E v1 Module Script: {specific.name}\n\n"
            + sanitize(read(specific))
        )
    return ""


def docs_text(paths: list[Path]) -> str:
    chunks = []
    for p in paths:
        rel = p.relative_to(ROOT)
        chunks.append(f"\n\n# Read-Aloud Documentation Corpus: {rel}\n\n")
        chunks.append("READ ALOUD:\n\n")
        chunks.append(
            "The following source document is included directly in this tier so "
            "the presenter does not need to switch files just to preserve context. "
            "Read it slowly, then pause and ask the maintainer to identify the "
            "operational facts, risks, and owner boundaries it establishes.\n\n"
        )
        chunks.append(sanitize(read(p)))
    return "".join(chunks)


def slide_notes_text() -> str:
    chunks = []
    files = sorted((ROOT / "presentation").rglob("slides/_build/**/*.js"))
    files += sorted((ROOT / "presentation").rglob("slides/_build/*.js"))
    seen = set()
    for p in files:
        if p in seen:
            continue
        seen.add(p)
        extracted = extract_slide_strings(read(p))
        if not extracted.strip():
            continue
        rel = p.relative_to(ROOT)
        chunks.append(f"\n\n# Slide Note Corpus: {rel}\n\n")
        chunks.append("READ ALOUD OR USE AS SPEAKER NOTES:\n\n")
        chunks.append(sanitize(extracted))
    return "".join(chunks)


def deep_pass_text_for_module(module_num: str, title: str, focus: str, pass_count: int) -> str:
    chunks = []
    chunks.append(f"\n\n# Expanded Module {module_num}: {title}\n\n")
    chunks.append(
        "READ ALOUD:\n\n"
        f"This expanded section revisits Module {module_num}, {title}. "
        f"The focus is {focus}. The presenter should not treat this as optional "
        "padding. It is a structured repetition cycle: explain the idea, show "
        "evidence, rehearse failure modes, ask for a teach-back, and record gaps.\n\n"
    )
    for idx in range(pass_count):
        pass_name = PASS_NAMES[idx % len(PASS_NAMES)]
        chunks.append(f"## {pass_name} for Module {module_num}\n\n")
        chunks.append(
            "READ ALOUD:\n\n"
            f"We are now doing the {pass_name.lower()} for {title}. "
            f"The maintainer should connect this module to {focus}. "
            "Do not accept a vague answer. Require a named file, named command, "
            "named source path, or named live-state observation wherever possible.\n\n"
        )
        chunks.append(
            "SHOW:\n\n"
            "- The corresponding slide deck from the Path E deck order.\n"
            "- The matching layman README.\n"
            "- The matching developer reference.\n"
            "- The matching known-issues file if the module has one.\n"
            "- The source repo path if this pass requires code evidence.\n\n"
        )
        chunks.append(
            "DO:\n\n"
            "1. Restate the module's operational purpose.\n"
            "2. Name the highest-risk misunderstanding for this module.\n"
            "3. Name the evidence that resolves that misunderstanding.\n"
            "4. Ask the maintainer to repeat the evidence path from memory.\n"
            "5. Write any incomplete answer into the handoff notes.\n\n"
        )
        chunks.append(
            "EXPECTED MAINTAINER ANSWER:\n\n"
            f"The answer must mention {focus}. It must also separate "
            "Nanofab-owned app or documentation work from University IT-owned "
            "root, VM, backup, patching, or account work whenever that boundary "
            "is relevant. If the module touches production, the answer must say "
            "how to inspect safely without exposing secrets or stopping services.\n\n"
        )
        chunks.append(
            "COMMON WRONG ANSWERS TO CORRECT:\n\n"
            "- Treating a slide as the source of truth instead of evidence.\n"
            "- Treating tmux as a process supervisor.\n"
            "- Treating local PostgreSQL as external.\n"
            "- Assigning root-owned or account-creation work to Nanofab.\n"
            "- Updating historical copies instead of canonical source.\n"
            "- Closing a known issue without source, live, or documented evidence.\n\n"
        )
        chunks.append(
            "STOP CONDITION:\n\n"
            "If the maintainer cannot name the evidence path, stop the module. "
            "Reopen the relevant docs, rerun the safe check, or assign the "
            "missing verification as homework. Do not move on by relying on "
            "confidence or memory.\n\n"
        )
    return "".join(chunks)


def module_for_path(path: Path) -> str:
    rel = str(path.relative_to(ROOT))
    lower = rel.lower()
    name = path.name.lower()

    if rel in {"README.md", "START-HERE.md"} or lower.startswith("support/"):
        if "evaluate" in lower or "audit" in lower:
            return "19"
        if "presentation-guide" in lower:
            return "00"
        return "00"
    if "liveserver" in lower:
        return "02"
    if "serveraccess" in lower:
        return "03"
    if "hscdownloader" in lower:
        return "13"
    if "filetransfer" in lower:
        return "14"
    if "picofirmware" in lower or "picohelpertools" in lower or "particlesensor" in lower or "particlepctools" in lower:
        return "15"
    if "hscdisplayerserver" in lower:
        return "17"
    if "known-issues" in lower:
        return "18"
    if "flaskserver" in lower:
        if "01-architecture" in name or "server-overview" in lower:
            return "01"
        if "02-getting-started" in name or "03-configuration" in name or "configuration" in lower:
            return "05"
        if "04-database-schema" in name or "09-chemical" in lower or "10-database" in lower:
            return "10"
        if "05-http-api" in name or "13-request" in lower or "15-endpoint" in lower:
            return "11"
        if "06-service" in name:
            return "11"
        if "07-authentication" in name or "04-authentication" in lower or "05-admin" in lower:
            return "06"
        if "08-integrations" in name or "08-iot" in lower or "12-consumers" in lower:
            return "09"
        if "09-deployment" in name:
            return "20"
        if "10-development" in name:
            return "05"
        if "06-tasks" in lower:
            return "07"
        if "07-machines" in lower:
            return "08"
        if "11-particle-demo" in lower:
            return "09"
        return "01"
    if "dattools" in lower or "denton" in lower or "paralyne" in lower or "aldpeakcounter" in lower or "preciousmetalreader" in lower or "utilities" in lower:
        return "16"
    return "16"


def docs_by_module(paths: list[Path]) -> dict[str, list[Path]]:
    grouped = {num: [] for num, _, _ in MODULES}
    for p in paths:
        grouped.setdefault(module_for_path(p), []).append(p)
    return grouped


def slide_notes_by_module() -> dict[str, list[tuple[Path, str]]]:
    grouped: dict[str, list[tuple[Path, str]]] = {num: [] for num, _, _ in MODULES}
    files = sorted((ROOT / "presentation").rglob("slides/_build/**/*.js"))
    files += sorted((ROOT / "presentation").rglob("slides/_build/*.js"))
    seen = set()
    for p in files:
        if p in seen:
            continue
        seen.add(p)
        extracted = extract_slide_strings(read(p))
        if not extracted.strip():
            continue
        grouped.setdefault(module_for_path(p), []).append((p, extracted))
    return grouped


def session_plan_text(session_count: int) -> str:
    chunks = ["\n\n# Tier Session Plan\n\n"]
    for i in range(1, session_count + 1):
        chunks.append(f"## Session {i}\n\n")
        chunks.append(
            "READ ALOUD:\n\n"
            "We begin this session by reviewing the prior notes, unresolved "
            "questions, and safety rules. We end by writing evidence, assigning "
            "homework, and checking whether any documentation or known-issues file "
            "must change before the next session.\n\n"
        )
        chunks.append(
            "DO:\n\n"
            "- Confirm branch and source repo state.\n"
            "- Confirm whether live access is needed.\n"
            "- Confirm no secret-bearing screen is projected.\n"
            "- Run the support audit if documentation changed.\n"
            "- Ask for a teach-back from the prior session before adding new material.\n\n"
        )
    return "".join(chunks)


def build_tier(dirname: str, cfg: dict) -> dict:
    out = ROOT / "support" / dirname
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    scripts = out / "scripts"
    scripts.mkdir()

    doc_paths = selected_docs(cfg["doc_limit"])
    grouped_docs = docs_by_module(doc_paths)
    grouped_slides = slide_notes_by_module() if cfg["include_slide_notes"] else {}

    generated_files: list[Path] = []

    intro = (
        f"# {cfg['label']} - Operator And Session Plan\n\n"
        "This file starts the tier. It is generated from the existing Path E script "
        "pack and tier settings. Read it before the module files.\n\n"
        f"Target word count: {cfg['target_min']}"
        + (f" to {cfg['target_max']} words.\n\n" if cfg["target_max"] else " words minimum.\n\n")
        + "\n\n# Existing Operator Protocol\n\n"
        + sanitize(read(SCRIPT_SRC / "00-operator-protocol.md"))
        + "\n\n# Existing Weekly Rollout Plan\n\n"
        + sanitize(read(SCRIPT_SRC / "weekly-rollout-plan.md"))
        + session_plan_text(cfg["session_count"])
    )
    intro_file = scripts / "00-operator-and-session-plan.md"
    intro_file.write_text(intro)
    generated_files.append(intro_file)

    for module_num, title, focus in MODULES:
        chunks = [
            f"# {cfg['label']} - Module {module_num}: {title}\n\n",
            "This generated module file is part of the split Path E tier. Read it "
            "as a self-contained script for this module, then stop at the module's "
            "stop conditions before continuing.\n\n",
            v1_module_text(module_num, title),
            deep_pass_text_for_module(module_num, title, focus, cfg["deep_passes"]),
        ]

        docs = grouped_docs.get(module_num, [])
        if docs:
            chunks.append("\n\n# Module Documentation Corpus\n\n")
            chunks.append(docs_text(docs))

        slides = grouped_slides.get(module_num, [])
        if slides:
            chunks.append("\n\n# Module Slide Note Corpus\n\n")
            for p, extracted in slides:
                rel = p.relative_to(ROOT)
                chunks.append(f"\n\n## Slide Notes From {rel}\n\n")
                chunks.append("READ ALOUD OR USE AS SPEAKER NOTES:\n\n")
                chunks.append(sanitize(extracted))

        module_file = scripts / module_filename(module_num, title)
        module_file.write_text("".join(chunks))
        generated_files.append(module_file)

    counts = [(p, words(read(p))) for p in generated_files]
    count = sum(c for _, c in counts)

    readme = (
        f"# {cfg['label']}\n\n"
        f"Generated split Path E tier directory.\n\n"
        f"- Total script word count: **{count:,}** words.\n"
        f"- Target minimum: **{cfg['target_min']:,}** words.\n"
    )
    if cfg["target_max"]:
        readme += f"- Target maximum: **{cfg['target_max']:,}** words.\n"
    else:
        readme += "- Target maximum: none.\n"
    readme += (
        "\nRead the files in `scripts/` in filename order. The tier is split by "
        "operator/session material plus one file per Path E module.\n\n"
        "Before presenting this tier, read "
        "[`../path-e-script/OPERATOR-CHECKLIST.md`](../path-e-script/OPERATOR-CHECKLIST.md) "
        "and [`../path-e-script/TIMING.md`](../path-e-script/TIMING.md).\n\n"
        "Start here:\n\n"
        "- [`scripts/00-operator-and-session-plan.md`](scripts/00-operator-and-session-plan.md)\n"
        "- [`scripts/module-00-set-the-contract.md`](scripts/module-00-set-the-contract.md)\n"
    )
    (out / "README.md").write_text(readme)

    count_rows = []
    for p, c in counts:
        count_rows.append(f"| `scripts/{p.name}` | {c:,} |\n")

    manifest = [
        f"# Word Count Manifest - {cfg['label']}\n\n",
        f"- Directory: `support/{dirname}/`\n",
        f"- Script files directory: `scripts/`\n",
        f"- Total script word count: **{count:,}**\n",
        f"- Target minimum: **{cfg['target_min']:,}**\n",
        f"- Target maximum: **{cfg['target_max']:,}**\n" if cfg["target_max"] else "- Target maximum: none\n",
        f"- Source docs included: **{len(doc_paths)}**\n",
        f"- Slide notes included: **{bool(cfg['include_slide_notes'])}**\n",
        f"- Deep rehearsal passes per module: **{cfg['deep_passes']}**\n",
        "\n## File Counts\n\n",
        "| File | Words |\n",
        "|---|---:|\n",
        *count_rows,
        "\nVerification command:\n\n",
        "```sh\n",
        f"wc -w support/{dirname}/scripts/*.md\n",
        "```\n",
    ]
    (out / "WORDCOUNT.md").write_text("".join(manifest))
    return {"dirname": dirname, "count": count, "target_min": cfg["target_min"], "target_max": cfg["target_max"]}


def main() -> None:
    results = []
    for dirname, cfg in TIERS.items():
        results.append(build_tier(dirname, cfg))

    failures = []
    for r in results:
        if r["count"] < r["target_min"]:
            failures.append(f"{r['dirname']} below minimum: {r['count']} < {r['target_min']}")
        if r["target_max"] and r["count"] > r["target_max"]:
            failures.append(f"{r['dirname']} above maximum: {r['count']} > {r['target_max']}")

    for r in results:
        print(f"{r['dirname']}: {r['count']} words")

    if failures:
        for failure in failures:
            print(f"ERROR: {failure}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
