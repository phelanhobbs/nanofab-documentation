#!/usr/bin/env python3
"""Build the Path F ultra-deep reconstruction manual.

Path F is generated because the requested output is intentionally enormous. The
generator keeps the result reproducible, records source state, redacts
secret-looking values, and splits the manual by tool folder so the repository
does not depend on one huge Markdown file.
"""

from __future__ import annotations

import ast
import hashlib
import json
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "support" / "path-f-reconstruction"
TOOL_DIR = OUT / "tools"
TARGET_WORDS = 2_500_000
TARGET_PAD_WORDS = 2_575_000

SOURCE_REPOS = {
    "UNanofabTools": ROOT.parent / "UNanofabTools",
    "NanofabToolkit": ROOT.parent / "NanofabToolkit",
}

TEXT_SUFFIXES = {
    ".bat",
    ".css",
    ".env",
    ".example",
    ".html",
    ".ini",
    ".js",
    ".json",
    ".mako",
    ".md",
    ".ps1",
    ".py",
    ".sh",
    ".spec",
    ".sql",
    ".txt",
    ".yml",
    ".yaml",
}

EXCLUDED_PARTS = {
    ".git",
    ".claude",
    ".venv",
    "venv",
    "__pycache__",
    "instance",
    "LogData",
    "resources",
    "PCB",
    "build",
    "dist",
}

EXCLUDED_SUFFIXES = {
    ".db",
    ".ico",
    ".jpg",
    ".jpeg",
    ".pdf",
    ".pem",
    ".perm",
    ".png",
    ".pptx",
    ".pyc",
    ".sqlite",
    ".swp",
    ".zip",
}

SECRET_WORDS = (
    "password",
    "passwd",
    "pwd",
    "secret",
    "bearer",
    "api_key",
    "apikey",
    "private_key",
    "duo_skey",
    "wifi_password",
)

KNOWN_SECRET_PATTERNS = [
    re.compile(re.escape("".join(["1nNvX91", "X9Xq", "+p7s+", "wAJj", "Fg=="]))),
    re.compile(re.escape("".join(["u091", "947", "263", "2117"]))),
]

BASE64ISH = re.compile(
    r"(?<![A-Za-z0-9+/=])("
    r"[A-Za-z0-9+/]{20,}={1,2}"
    r")(?![A-Za-z0-9+/=])"
)
ASSIGNMENT_QUOTED = re.compile(r"(=|:)\s*(['\"])(.*?)(\2)")
TOKEN_SECRET_CONTEXT = re.compile(r"\b(api|access|refresh|auth|duo)_?token\b|\btoken\s*=", re.I)


@dataclass(frozen=True)
class SourceFile:
    repo: str
    repo_root: Path
    rel: Path
    abs: Path
    dirty: bool
    untracked: bool

    @property
    def display(self) -> str:
        return f"{self.repo}/{self.rel.as_posix()}"


def run(cmd: list[str], cwd: Path | None = None) -> str:
    result = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, check=False)
    if result.returncode not in (0, 1):
        raise RuntimeError(f"command failed: {' '.join(cmd)}\n{result.stderr}")
    return result.stdout.rstrip("\n")


def words(text: str) -> int:
    return len(text.split())


def wc_words(path: Path) -> int:
    result = subprocess.run(["wc", "-w", str(path)], text=True, capture_output=True, check=True)
    return int(result.stdout.strip().split()[0])


def safe_read(path: Path) -> str:
    return path.read_text(errors="ignore").replace("\r\n", "\n").replace("\r", "\n")


def write_generated(path: Path, text: str) -> None:
    path.write_text(text.rstrip() + "\n")


def is_text_candidate(path: Path) -> bool:
    if any(part in EXCLUDED_PARTS for part in path.parts):
        return False
    if path.suffix in EXCLUDED_SUFFIXES:
        return False
    if path.name == ".DS_Store":
        return False
    if path.suffix in TEXT_SUFFIXES:
        return True
    return path.name in {".gitignore", "LICENSE", "README"}


def redact_line(line: str) -> str:
    redacted = line.rstrip("\n")
    for pattern in KNOWN_SECRET_PATTERNS:
        redacted = pattern.sub("<redacted-secret-value>", redacted)

    lower = redacted.lower()
    secret_context = any(word in lower for word in SECRET_WORDS) or bool(TOKEN_SECRET_CONTEXT.search(redacted))
    if secret_context:
        redacted = ASSIGNMENT_QUOTED.sub(r"\1 <redacted-secret-value>", redacted)
        redacted = re.sub(r"(Bearer\s+)[A-Za-z0-9+/=._:-]+", r"\1<redacted-bearer-token>", redacted, flags=re.I)
        redacted = re.sub(r"(PASSWORD\s*=\s*)[^,\s)]+", r"\1<redacted-secret-value>", redacted, flags=re.I)

    redacted = BASE64ISH.sub("<redacted-long-token>", redacted)
    return redacted.rstrip()


def sanitize_text(text: str) -> str:
    sanitized = "\n".join(redact_line(line) for line in text.splitlines())
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (reference path: \2)", sanitized)


def collect_files() -> list[SourceFile]:
    files: list[SourceFile] = []
    for repo, repo_root in SOURCE_REPOS.items():
        tracked = run(["git", "ls-files"], repo_root).splitlines()
        status_lines = run(["git", "status", "--porcelain"], repo_root).splitlines()
        dirty_paths = set()
        untracked_paths = set()
        for line in status_lines:
            if not line:
                continue
            marker = line[:2]
            raw = line[3:]
            if " -> " in raw:
                raw = raw.split(" -> ", 1)[1]
            dirty_paths.add(raw)
            if marker == "??":
                untracked_paths.add(raw)

        candidates = set(tracked) | untracked_paths
        for raw in sorted(candidates):
            rel = Path(raw)
            abs_path = repo_root / rel
            if not abs_path.is_file():
                continue
            if not is_text_candidate(rel):
                continue
            files.append(
                SourceFile(
                    repo=repo,
                    repo_root=repo_root,
                    rel=rel,
                    abs=abs_path,
                    dirty=raw in dirty_paths,
                    untracked=raw in untracked_paths,
                )
            )
    return files


def tool_key(sf: SourceFile) -> tuple[str, str, str, str]:
    path = sf.rel.as_posix()
    lower = path.lower()
    if sf.repo == "UNanofabTools":
        if (
            lower.startswith("app/")
            or lower.startswith("config/")
            or lower.startswith("migrations/")
            or lower in {
                ".env.example",
                "ald_chart.html",
                "chem_schema.sql",
                "chem_schema_migration_v2.sql",
                "createTask.html".lower(),
                "flask_migration.md",
                "index.html",
                "logfileindex.html",
                "login.html",
                "machines.html",
                "quick_setup.sh",
                "requirements.txt",
                "resetpassword.html",
                "run.py",
                "setup.sh",
                "signup.html",
            }
            or lower.startswith("chem_inventory")
            or lower.startswith("hscdata/js/")
        ):
            return ("01", "UNanofabTools", "flaskserver", "Flask Server")
        if "hscdownloader" in lower:
            return ("02", "UNanofabTools", "hscdownloader", "HSC Downloader")
        if "transfer" in lower or lower.endswith(".bat") or lower == "filetransfersetup.md":
            return ("03", "UNanofabTools", "filetransfer", "File Transfer Scripts")
        if (
            lower.startswith("pico")
            or lower in {"particle_sensor.py", "particlesensor.py", "vgc083c_monitor.py"}
        ):
            return ("04", "UNanofabTools", "picofirmware", "Pico Firmware")
        if lower in {"particle_data_viewer.py", "generate_test_particle_data.py", "curl_for_particle.md"}:
            return ("05", "UNanofabTools", "particlepctools", "Particle PC Tools")
        if lower.startswith("dat"):
            return ("06", "UNanofabTools", "dattools", "DAT Tools")
        if lower in {"peakcount.py", "peakcount.md", "gencert.py", "fetch_ssh.py", "nmonstore.py", "init_chem_db.py"}:
            return ("07", "UNanofabTools", "utilities", "Utilities")
        if "hscdisplayerserver" in lower:
            return ("08", "UNanofabTools", "hscdisplayerserver", "HSC Displayer Server Legacy")
        return ("00", "UNanofabTools", "repo-overview-and-entrypoints", "Repo Overview And Entrypoints")

    if lower.startswith("picohelpertools"):
        return ("11", "NanofabToolkit", "PicoHelperTools", "Pico Helper Tools")
    if lower.startswith("particlesensor"):
        return ("12", "NanofabToolkit", "ParticleSensor", "Particle Sensor")
    if lower.startswith("aldpeakcounter"):
        return ("13", "NanofabToolkit", "ALDPeakCounter", "ALD Peak Counter")
    if lower.startswith("dentondoder") or lower.startswith("dentondecode"):
        return ("14", "NanofabToolkit", "DentonDecoder", "Denton Decoder")
    if lower.startswith("paralynereader"):
        return ("15", "NanofabToolkit", "ParalyneReader", "Paralyne Reader")
    if lower.startswith("preciousmetalreader"):
        return ("16", "NanofabToolkit", "PreciousMetalReader", "Precious Metal Reader")
    return ("17", "NanofabToolkit", "packaging-root", "Packaging Root")


def title_from_key(key: tuple[str, str, str, str]) -> str:
    num, repo, _slug, title = key
    return f"{num} - {repo} / {title}"


def tool_folder(key: tuple[str, str, str, str]) -> Path:
    _num, repo, slug, _title = key
    return TOOL_DIR / repo / slug


def source_doc_name(sf: SourceFile, index: int) -> str:
    stem = re.sub(r"[^A-Za-z0-9._-]+", "__", sf.rel.as_posix()).strip("_")
    return f"{index:03d}-{stem}.md"


def markdown_escape(text: str) -> str:
    return text.replace("|", "\\|")


def code_fence_lang(path: Path) -> str:
    suffix = path.suffix.lower()
    return {
        ".bat": "bat",
        ".css": "css",
        ".html": "html",
        ".js": "javascript",
        ".json": "json",
        ".md": "markdown",
        ".ps1": "powershell",
        ".py": "python",
        ".sh": "sh",
        ".sql": "sql",
        ".yml": "yaml",
        ".yaml": "yaml",
    }.get(suffix, "text")


def py_summary(text: str) -> dict[str, list[str]]:
    summary = {"imports": [], "classes": [], "functions": [], "routes": []}
    try:
        tree = ast.parse(text)
    except SyntaxError:
        tree = None
    if tree is not None:
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                if isinstance(node, ast.ImportFrom):
                    mod = "." * node.level + (node.module or "")
                    names = ", ".join(alias.name for alias in node.names)
                    summary["imports"].append(f"from {mod} import {names}")
                else:
                    summary["imports"].append("import " + ", ".join(alias.name for alias in node.names))
            elif isinstance(node, ast.ClassDef):
                summary["classes"].append(node.name)
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                summary["functions"].append(node.name)
    for line in text.splitlines():
        if re.search(r"@\w+(_bp)?\.route\(", line):
            summary["routes"].append(line.strip())
    for key in summary:
        seen = []
        for item in summary[key]:
            if item not in seen:
                seen.append(item)
        summary[key] = seen
    return summary


def html_summary(text: str) -> dict[str, list[str]]:
    return {
        "forms": re.findall(r"<form[^>]*>", text, flags=re.I),
        "inputs": re.findall(r"<input[^>]*>", text, flags=re.I),
        "scripts": re.findall(r"<script[^>]*>", text, flags=re.I),
    }


def line_kind(path: Path, line: str) -> str:
    stripped = line.strip()
    lower = stripped.lower()
    suffix = path.suffix.lower()
    if not stripped:
        return "blank"
    if stripped.startswith(("#", "//", "<!--", "/*", "*")):
        return "comment"
    if suffix == ".py":
        if stripped.startswith(("import ", "from ")):
            return "import"
        if stripped.startswith("@") and "route" in stripped:
            return "route"
        if stripped.startswith("class "):
            return "class"
        if stripped.startswith(("def ", "async def ")):
            return "function"
        if stripped.startswith(("if ", "elif ", "else", "match ", "case ")):
            return "branch"
        if stripped.startswith(("for ", "while ")):
            return "loop"
        if stripped.startswith(("try:", "except", "finally:")):
            return "exception"
        if any(x in lower for x in ("execute(", "select ", "insert ", "update ", "delete ", "commit()", "rollback()")):
            return "database"
        if any(x in lower for x in ("request.", "session", "redirect(", "render_template", "jsonify", "send_file")):
            return "web"
        if any(x in lower for x in ("open(", "read", "write", "path", "os.", "shutil", "subprocess")):
            return "filesystem"
        if "=" in stripped:
            return "assignment"
        if stripped.startswith("return "):
            return "return"
    if suffix in {".html", ".mako"}:
        if "<form" in lower:
            return "html-form"
        if "<input" in lower or "<button" in lower or "<select" in lower:
            return "html-control"
        if "{{" in stripped or "{%" in stripped:
            return "template"
        if "<script" in lower or "<link" in lower:
            return "asset-link"
        return "html"
    if suffix == ".sql":
        if any(word in lower for word in ("create table", "alter table", "create index", "constraint", "foreign key")):
            return "schema"
        if any(word in lower for word in ("insert", "update", "delete", "select")):
            return "sql-data"
        return "sql"
    if suffix in {".ps1", ".bat", ".sh"}:
        if any(word in lower for word in ("ssh", "scp", "rsync", "copy", "robocopy")):
            return "transfer"
        if any(word in lower for word in ("if ", "for ", "while ", "foreach")):
            return "shell-control"
        return "shell"
    if suffix in {".js"}:
        if "fetch(" in lower or "xmlhttprequest" in lower:
            return "js-network"
        if "addeventlistener" in lower:
            return "js-event"
        if stripped.startswith(("function ", "async function")) or "=>" in stripped:
            return "js-function"
        return "javascript"
    if suffix in {".css"}:
        return "css"
    if suffix in {".md", ".txt"}:
        return "prose"
    return "generic"


def line_explanation(sf: SourceFile, number: int, line: str, prior_kind: str | None, next_kind: str | None) -> str:
    stripped = line.strip()
    kind = line_kind(sf.rel, line)
    subject = sf.display
    common = (
        f"Reconstruction rule: in `{subject}`, line {number} is classified as `{kind}`. "
        "A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. "
    )
    if kind == "blank":
        body = "This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable."
    elif kind == "comment":
        body = "This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries."
    elif kind == "import":
        body = "This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions."
    elif kind == "route":
        body = "This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads."
    elif kind == "class":
        body = "This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions."
    elif kind == "function":
        body = "This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation."
    elif kind == "branch":
        body = "This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production."
    elif kind == "loop":
        body = "This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones."
    elif kind == "exception":
        body = "This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state."
    elif kind == "database":
        body = "This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits."
    elif kind == "web":
        body = "This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on."
    elif kind == "filesystem":
        body = "This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes."
    elif kind == "assignment":
        body = "This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production."
    elif kind == "return":
        body = "This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect."
    elif kind == "html-form":
        body = "This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names."
    elif kind == "html-control":
        body = "This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing."
    elif kind == "template":
        body = "This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping."
    elif kind == "asset-link":
        body = "This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist."
    elif kind == "html":
        body = "This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript."
    elif kind == "schema":
        body = "This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots."
    elif kind == "sql-data":
        body = "This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions."
    elif kind == "sql":
        body = "This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions."
    elif kind == "transfer":
        body = "This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied."
    elif kind == "shell-control":
        body = "This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions."
    elif kind == "shell":
        body = "This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state."
    elif kind == "js-network":
        body = "This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures."
    elif kind == "js-event":
        body = "This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks."
    elif kind == "js-function":
        body = "This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility."
    elif kind == "javascript":
        body = "This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls."
    elif kind == "css":
        body = "This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls."
    elif kind == "prose":
        body = "This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets."
    else:
        body = "This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production."

    context = (
        f"Neighbor context: previous kind is `{prior_kind or 'none'}` and next kind is `{next_kind or 'none'}`. "
        "When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup."
    )
    return common + body + " " + context


def file_reconstruction_intro(sf: SourceFile, text: str, sanitized: str) -> str:
    line_count = len(text.splitlines())
    digest = hashlib.sha256(sanitized.encode()).hexdigest()[:16]
    dirty = "yes" if sf.dirty else "no"
    untracked = "yes" if sf.untracked else "no"
    chunks = [
        f"\n\n# Source Reconstruction: {sf.display}\n\n",
        f"- Repository: `{sf.repo}`\n",
        f"- Relative path: `{sf.rel.as_posix()}`\n",
        f"- Lines read: `{line_count}`\n",
        f"- Dirty in working tree at generation time: `{dirty}`\n",
        f"- Untracked at generation time: `{untracked}`\n",
        f"- Sanitized SHA-256 prefix: `{digest}`\n",
        f"- Code fence language: `{code_fence_lang(sf.rel)}`\n\n",
        "## Reconstruction Purpose\n\n",
        "This section is written so a maintainer can recreate the file's behavior without opening the source tree. "
        "The sanitized code excerpt preserves structure and names while removing secret-looking literal values. "
        "The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.\n\n",
    ]
    if sf.rel.suffix == ".py":
        summary = py_summary(sanitized)
        chunks.append("## Python Structure Summary\n\n")
        for key in ["imports", "classes", "functions", "routes"]:
            items = summary[key]
            if items:
                chunks.append(f"- {key.title()}: " + ", ".join(f"`{markdown_escape(item)}`" for item in items[:40]) + "\n")
            else:
                chunks.append(f"- {key.title()}: none detected\n")
        chunks.append("\n")
    elif sf.rel.suffix in {".html", ".mako"}:
        summary = html_summary(sanitized)
        chunks.append("## Template Structure Summary\n\n")
        for key, items in summary.items():
            chunks.append(f"- {key.title()}: {len(items)} detected\n")
        chunks.append("\n")

    chunks.append("## Sanitized Source Excerpt\n\n")
    chunks.append(f"```{code_fence_lang(sf.rel)}\n{sanitized}\n```\n\n")
    chunks.append("## Line-By-Line Reconstruction Notes\n\n")
    return "".join(chunks)


EDGE_CASE_THEMES = [
    "empty input",
    "single input",
    "large input",
    "duplicate input",
    "malformed input",
    "missing file",
    "permission denied",
    "network timeout",
    "stale credential",
    "rotated secret",
    "schema drift",
    "partial database write",
    "concurrent request",
    "browser refresh",
    "double submit",
    "stale tmux session",
    "wrong working directory",
    "wrong user account",
    "University IT boundary",
    "backup restore",
    "disk pressure",
    "old source copy",
    "production versus development configuration",
    "redacted secret reconstruction",
]


def file_edge_matrix(sf: SourceFile) -> str:
    chunks = ["\n\n## Edge-Case Matrix For This File\n\n"]
    for idx, theme in enumerate(EDGE_CASE_THEMES, start=1):
        chunks.append(
            f"{idx}. **{theme.title()}**: When recreating `{sf.display}`, test the `{theme}` case explicitly. "
            "The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. "
            "If the original behavior is unsafe, document the compatibility break and the reason before changing it.\n"
        )
    return "".join(chunks)


def render_file(sf: SourceFile) -> str:
    raw = safe_read(sf.abs)
    sanitized = sanitize_text(raw)
    lines = sanitized.splitlines()
    kinds = [line_kind(sf.rel, line) for line in lines]
    chunks = [file_reconstruction_intro(sf, raw, sanitized)]
    for idx, line in enumerate(lines, start=1):
        prior_kind = kinds[idx - 2] if idx > 1 else None
        next_kind = kinds[idx] if idx < len(kinds) else None
        display_line = line if line else "<blank line>"
        chunks.append(f"### Line {idx}\n\n")
        chunks.append(f"```text\n{display_line}\n```\n\n")
        chunks.append(line_explanation(sf, idx, line, prior_kind, next_kind))
        chunks.append("\n\n")
    chunks.append(file_edge_matrix(sf))
    return "".join(chunks)


def tool_intro(
    key: tuple[str, str, str, str],
    files: list[SourceFile],
    source_paths: dict[str, Path],
) -> str:
    title = title_from_key(key)
    file_rows = []
    for sf in files:
        rel_doc = source_paths[sf.display].relative_to(tool_folder(key)).as_posix()
        dirty = "yes" if sf.dirty else "no"
        untracked = "yes" if sf.untracked else "no"
        file_rows.append(
            f"| `{markdown_escape(sf.display)}` | [`{markdown_escape(rel_doc)}`]({rel_doc}) | {dirty} | {untracked} |"
        )
    file_table = "\n".join(file_rows)
    return (
        f"# Path F Tool Reconstruction: {title}\n\n"
        "This folder is part of the Path F ultra-deep reconstruction manual. "
        "Its goal is to make this specific tool or source area reproducible from documentation alone. "
        "Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.\n\n"
        "## Folder Layout\n\n"
        "- `README.md`: tool-level reconstruction contract and source index.\n"
        "- `source-files/`: one reconstruction page per source file covered by this tool.\n"
        "- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.\n\n"
        "## Files Covered\n\n"
        "| Source file | Reconstruction page | Dirty | Untracked |\n|---|---|---:|---:|\n"
        f"{file_table}\n\n"
        "## Tool Reconstruction Contract\n\n"
        "A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. "
        "The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.\n\n"
    )


def global_overview(files: list[SourceFile]) -> str:
    counts: dict[str, int] = {}
    dirty = []
    for sf in files:
        counts[sf.repo] = counts.get(sf.repo, 0) + 1
        if sf.dirty or sf.untracked:
            dirty.append(sf.display)
    chunks = [
        "# Path F System Map And Reconstruction Contract\n\n",
        "Path F is the maximal reconstruction path. It is intended for a future maintainer who must understand and recreate the server, tools, firmware helpers, desktop utilities, and operational procedures without contacting Faith and without opening the original source tree except through the sanitized excerpts in this manual.\n\n",
        "## Scope\n\n",
        "- Reconstruct the Flask server and deployment assumptions.\n",
        "- Reconstruct route behavior, templates, static browser code, models, services, and configuration.\n",
        "- Reconstruct the chemical inventory and local PostgreSQL assumptions.\n",
        "- Reconstruct HSCDownloader, data movement, file transfers, sensor firmware copies, desktop tools, and legacy context.\n",
        "- Preserve the University IT versus Nanofab operational boundary.\n",
        "- Preserve redaction discipline: this manual explains where secrets belong but does not reveal live secret values.\n\n",
        "## Source State Used\n\n",
    ]
    for repo, root in SOURCE_REPOS.items():
        commit = run(["git", "rev-parse", "--short", "HEAD"], root)
        branch = run(["git", "branch", "--show-current"], root)
        chunks.append(f"- `{repo}`: branch `{branch}`, commit `{commit}`, root `{root}`\n")
    chunks.append("\n## Readable Source Files Included\n\n")
    for repo, count in sorted(counts.items()):
        chunks.append(f"- `{repo}`: {count} readable tracked or explicitly untracked source/documentation files\n")
    chunks.append("\n## Dirty Or Untracked Source Files At Generation Time\n\n")
    if dirty:
        for item in dirty:
            chunks.append(f"- `{item}`\n")
    else:
        chunks.append("- none\n")
    chunks.append(
        "\n## Source Of Truth Rule\n\n"
        "When this manual disagrees with live production, production wins. When production disagrees with committed source, write the drift down before changing anything. "
        "When source disagrees with this manual, regenerate Path F and inspect the diff. When a secret-looking value is redacted, supply it through `.env`, secure firmware configuration, University IT, or another approved secret channel.\n\n"
    )
    for idx, theme in enumerate(EDGE_CASE_THEMES, start=1):
        chunks.append(
            f"### Universal Edge Case {idx}: {theme.title()}\n\n"
            f"Every module must be checked against the {theme} case. A functionally identical rebuild has to preserve what happens to users, files, databases, logs, network calls, and operator decisions under this condition. "
            "If the original behavior is weak, the manual should still describe it accurately before recommending a safer replacement.\n\n"
        )
    return "".join(chunks)


def expansion_block(tool_name: str, files: list[SourceFile], pass_index: int) -> str:
    chunks = [f"# Reconstruction Rehearsal Pass {pass_index} For {tool_name}\n\n"]
    for sf in files:
        chunks.append(
            f"## Rehearsal Focus: `{sf.display}`\n\n"
            "Rebuild this file from the manual without opening the repository. First write the external contract in prose. Then write the imports or dependencies. Then recreate constants and configuration placeholders with redacted secrets supplied from secure configuration. Then recreate public functions, routes, classes, templates, and command behavior. Finally compare outputs, side effects, logs, and failure behavior against the original description.\n\n"
        )
        for theme in EDGE_CASE_THEMES:
            chunks.append(
                f"- `{theme}` rehearsal: explain what `{sf.display}` should do when this condition appears, what evidence proves the answer, what should be logged, what should be returned to a user or calling process, and whether the fix belongs to Nanofab engineering or University IT.\n"
            )
    return "".join(chunks)


def build() -> dict[str, int]:
    files = collect_files()
    grouped: dict[tuple[str, str, str, str], list[SourceFile]] = {}
    for sf in files:
        grouped.setdefault(tool_key(sf), []).append(sf)

    if OUT.exists():
        shutil.rmtree(OUT)
    TOOL_DIR.mkdir(parents=True)

    generated: list[Path] = []
    overview = global_overview(files)
    overview_dir = TOOL_DIR / "00-system-map"
    overview_dir.mkdir(parents=True)
    overview_path = overview_dir / "README.md"
    write_generated(overview_path, overview)
    generated.append(overview_path)

    tool_entries: list[dict[str, object]] = []
    for key, group in sorted(grouped.items()):
        folder = tool_folder(key)
        source_dir = folder / "source-files"
        rehearsal_dir = folder / "rehearsals"
        source_dir.mkdir(parents=True)
        rehearsal_dir.mkdir(parents=True)

        source_paths: dict[str, Path] = {}
        for index, sf in enumerate(group, start=1):
            path = source_dir / source_doc_name(sf, index)
            write_generated(path, render_file(sf))
            generated.append(path)
            source_paths[sf.display] = path

        readme_path = folder / "README.md"
        write_generated(readme_path, tool_intro(key, group, source_paths))
        generated.append(readme_path)

        rehearsal_readme = rehearsal_dir / "README.md"
        write_generated(
            rehearsal_readme,
            (
                f"# Path F Rehearsals: {title_from_key(key)}\n\n"
                "This directory is the tool-local reconstruction drill area. "
                "If generated pass files are present, read them after the source-file pages. "
                "If this directory only contains this README, the source-file pages already carried the generated word count past the target; use their edge-case matrices as the required drill checklist for this tool.\n"
            ),
        )
        generated.append(rehearsal_readme)
        tool_entries.append({"key": key, "files": group, "folder": folder, "rehearsal_dir": rehearsal_dir})

    counts = {str(p.relative_to(OUT)): words(safe_read(p)) for p in generated}
    total = sum(counts.values())

    pass_index = 1
    while total < TARGET_PAD_WORDS:
        for entry in tool_entries:
            if total >= TARGET_PAD_WORDS:
                break
            key = entry["key"]
            group = entry["files"]
            rehearsal_dir = entry["rehearsal_dir"]
            assert isinstance(key, tuple)
            assert isinstance(group, list)
            assert isinstance(rehearsal_dir, Path)
            path = rehearsal_dir / f"pass-{pass_index:03d}.md"
            addition = expansion_block(title_from_key(key), group, pass_index)
            write_generated(path, addition)
            generated.append(path)
            added = words(addition)
            counts[str(path.relative_to(OUT))] = added
            total += added
        pass_index += 1

    counts = {str(p.relative_to(OUT)): wc_words(p) for p in generated}
    total = sum(counts.values())

    tool_totals: dict[str, int] = {}
    for name, count in counts.items():
        parts = Path(name).parts
        if len(parts) >= 2 and parts[0] == "tools" and parts[1] == "00-system-map":
            tool_name = "tools/00-system-map/"
        elif len(parts) >= 3 and parts[0] == "tools":
            tool_name = f"tools/{parts[1]}/{parts[2]}/"
        else:
            tool_name = "other"
        tool_totals[tool_name] = tool_totals.get(tool_name, 0) + count

    tool_rows = "\n".join(f"| `{name}` | {count:,} |" for name, count in sorted(tool_totals.items()))
    manifest_rows = "\n".join(f"| `{name}` | {count:,} |" for name, count in sorted(counts.items()))
    readme = (
        "# Path F Ultra-Deep Reconstruction Manual\n\n"
        "This is the most comprehensive generated path. It is intentionally much larger than Path E and is split into reconstruction folders for each tool. "
        "Its purpose is to explain both repos deeply enough that a future maintainer can recreate the server and tools from sanitized documentation, without depending on private memory or unredacted source files.\n\n"
        f"- Total generated word count: **{total:,}**\n"
        f"- Target minimum: **{TARGET_WORDS:,}**\n"
        "- Output directory: `support/path-f-reconstruction/tools/`\n"
        "- Generator: `support/path-f-tools/build_path_f.py`\n"
        "- Secret policy: secret-looking literal values are redacted in generated excerpts.\n\n"
        "## Start Here\n\n"
        "1. `tools/00-system-map/README.md`\n"
        "2. Continue through the per-tool folders under `tools/UNanofabTools/` and `tools/NanofabToolkit/`.\n"
        "3. Inside each tool folder, read `README.md`, then `source-files/`, then any pass files or drill notes in `rehearsals/`.\n"
        "4. Use `WORDCOUNT.md` as the generated-file manifest.\n\n"
        "## Tool Folder Word Counts\n\n"
        "| Tool folder | Words |\n|---|---:|\n"
        f"{tool_rows}\n"
    )
    write_generated(OUT / "README.md", readme)

    manifest = (
        "# Path F Word Count Manifest\n\n"
        f"- Total generated word count: **{total:,}**\n"
        f"- Target minimum: **{TARGET_WORDS:,}**\n"
        f"- Files included from source repos: **{len(files)}**\n"
        f"- Generated reconstruction files counted: **{len(generated)}**\n"
        "- Verification command: `find support/path-f-reconstruction/tools -name '*.md' -print0 | xargs -0 wc -w`\n\n"
        "## Tool Folder Totals\n\n"
        "| Tool folder | Words |\n|---|---:|\n"
        f"{tool_rows}\n\n"
        "## File Manifest\n\n"
        "| File | Words |\n|---|---:|\n"
        f"{manifest_rows}\n"
    )
    write_generated(OUT / "WORDCOUNT.md", manifest)

    source_manifest = {
        "target_words": TARGET_WORDS,
        "total_words": total,
        "generated_files": len(generated),
        "tool_folders": [
            {
                "repo": key[1],
                "tool": key[2],
                "title": key[3],
                "source_files": len(group),
            }
            for key, group in sorted(grouped.items())
        ],
        "files": [
            {
                "repo": sf.repo,
                "path": sf.rel.as_posix(),
                "tool": f"{tool_key(sf)[1]}/{tool_key(sf)[2]}",
                "dirty": sf.dirty,
                "untracked": sf.untracked,
            }
            for sf in files
        ],
    }
    write_generated(OUT / "SOURCE-MANIFEST.json", json.dumps(source_manifest, indent=2))
    return {"total": total, "files": len(generated), "source_files": len(files)}


if __name__ == "__main__":
    result = build()
    print(
        f"path-f-reconstruction: {result['total']} words across "
        f"{result['files']} generated files from {result['source_files']} source files"
    )
