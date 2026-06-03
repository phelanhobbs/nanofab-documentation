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
import os
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

NAVIGATION_FILES = {
    "NAVIGATOR.md",
    "RECONSTRUCTION-CHECKLIST.md",
    "TROUBLESHOOTING-ROUTES.md",
    "MAINTAINER-FIRST-HOUR.md",
    "GLOSSARY.md",
    "REBUILD-EVIDENCE-TEMPLATE.md",
}

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


def rel_link(from_dir: Path, target: Path) -> str:
    return os.path.relpath(target, from_dir).replace(os.sep, "/")


def source_doc_name(sf: SourceFile, index: int) -> str:
    stem = re.sub(r"[^A-Za-z0-9._-]+", "__", sf.rel.as_posix()).strip("_")
    return f"{index:03d}-{stem}.md"


DEFAULT_PLAYBOOK = {
    "role": "Source area without a more specific generated playbook.",
    "open_when": "Open this folder when the source file path is the closest match for the behavior being rebuilt.",
    "rebuild_focus": "Preserve file names, imports, command behavior, public interfaces, on-disk paths, and operator-facing output.",
    "proof": [
        "Recreate the listed files from the sanitized excerpts.",
        "Run the recreated entry points or import checks in a clean environment.",
        "Compare outputs, logs, files, and failure behavior against the reconstruction notes.",
    ],
    "external_inputs": ["Any redacted secret, local path, host-specific account, or live database value must come from approved local configuration."],
    "pitfalls": ["Do not infer a secret from redacted text.", "Do not treat stale local paths as production truth without checking live state."],
}


TOOL_PLAYBOOKS = {
    "UNanofabTools/repo-overview-and-entrypoints": {
        "role": "Repository-level orientation, setup notes, migration summaries, and legacy handoff context.",
        "open_when": "Open this when you need the original repo story before choosing a specific tool folder.",
        "rebuild_focus": "Preserve the setup sequence, repo-level assumptions, migration history, and relationship between old and modern server code.",
        "proof": [
            "A new maintainer can explain which code is modern, which code is historical, and where each tool lives.",
            "The recreated repo has the same top-level entrypoint and setup expectations.",
            "No repo-level note contradicts the current Path F navigator or source manifest.",
        ],
        "external_inputs": ["Adjacent repo location", "Python environment", "production host facts from live verification"],
        "pitfalls": ["Old README claims may predate the Flask refactor.", "Treat live production as stronger evidence than historical migration notes."],
    },
    "UNanofabTools/flaskserver": {
        "role": "Modern Flask web application, including auth, tasks, machine pages, particle-data API, chemical inventory, templates, static assets, config, and migrations.",
        "open_when": "Open this first for any server rebuild, browser bug, route behavior, database schema, auth, task, machine-data, chem-inventory, or particle API question.",
        "rebuild_focus": "Recreate the Flask app package, routes, templates, services, models, config loading, SQLite files, local PostgreSQL chem schema, HSCDATA readers, and deployment entrypoint.",
        "proof": [
            "A clean virtualenv can install requirements and import `app` plus `run.py` without missing local modules.",
            "A local Flask instance serves login, tasks, machines, and chem pages with the expected templates.",
            "Particle POST and GET contracts match the firmware and desktop viewers.",
            "Chem inventory operations use local PostgreSQL assumptions and preserve barcode, transaction, and scan flows.",
            "Route inventory and configuration names match the source and the formal developer docs.",
        ],
        "external_inputs": [
            ".env values for Flask secret, Duo, database, and production host behavior",
            "local SQLite instance files or migrations",
            "local PostgreSQL chem database credentials",
            "HSCDATA and LogData directory contents",
            "nginx/TLS/service configuration from live server docs",
        ],
        "pitfalls": [
            "Chem PostgreSQL is local to the VM, not an external database server.",
            "Device ingest routes have different auth expectations than browser routes.",
            "Templates and JavaScript rely on exact route names and field names.",
        ],
    },
    "UNanofabTools/hscdownloader": {
        "role": "CORES n8n data downloader that writes HSCDATA CSVs consumed by the machine portal.",
        "open_when": "Open this when machine pages stop updating, service IDs change, CORES changes payloads, or HSCDATA CSVs need to be recreated.",
        "rebuild_focus": "Preserve the bearer-authenticated CORES calls, machine-to-service-ID mapping, per-machine CSV transforms, scheduler loop, and HSCDATA output file names.",
        "proof": [
            "A test CORES response can be normalized into the expected full and `small_` CSV files.",
            "Every active `save<Machine>()` path writes the expected columns.",
            "The Flask machines page can read the recreated `small_` files.",
        ],
        "external_inputs": ["CORES bearer token from secure storage", "CORES service IDs", "HSCDATA directory permissions", "network access to n8n"],
        "pitfalls": ["A rotated token looks like stale machine data.", "Changing CSV columns can silently break graph rendering."],
    },
    "UNanofabTools/filetransfer": {
        "role": "Windows and shell transfer scripts that move machine-controller files to the server.",
        "open_when": "Open this when a machine control PC stops uploading logs or a transfer path/account/key needs replacement.",
        "rebuild_focus": "Preserve source directories, destination paths, SSH/SCP behavior, Windows quoting, retry/error output, and account boundaries.",
        "proof": [
            "A dry run or test file transfer reaches the expected server directory.",
            "Paths with spaces and missing source directories fail visibly.",
            "The recreated script does not depend on undocumented personal credentials.",
        ],
        "external_inputs": ["Machine control PC paths", "SSH key or service account approved for transfer", "server destination path", "network reachability"],
        "pitfalls": ["Personal-account dependencies are not a long-term operational model.", "Windows quoting failures can look like authentication failures."],
    },
    "UNanofabTools/picofirmware": {
        "role": "Older UNanofabTools copies of Pico firmware and Pico diagnostics.",
        "open_when": "Open this for historical Pico code, unique unfinished scripts, WiFi diagnostics, or comparison against the canonical NanofabToolkit PicoHelperTools folder.",
        "rebuild_focus": "Preserve MicroPython imports, sensor read loops, WiFi handling, HTTP POST payload shape, endpoint URLs, and diagnostic LED behavior.",
        "proof": [
            "A Pico can boot the recreated firmware without import errors.",
            "WiFi diagnostics succeed or fail with clear output.",
            "Sensor payloads match the Flask particle or machine API contracts.",
        ],
        "external_inputs": ["WiFi SSID and password from secure local config", "Pico MAC/device identity", "server endpoint URL", "sensor wiring"],
        "pitfalls": ["Canonical Pico firmware lives in NanofabToolkit/PicoHelperTools.", "Some UNanofabTools Pico scripts are incomplete or historical."],
    },
    "UNanofabTools/particlepctools": {
        "role": "Older PC-side particle data viewer and synthetic particle-data generator.",
        "open_when": "Open this for historical desktop viewer behavior, test particle-data generation, or comparison with NanofabToolkit/ParticleSensor.",
        "rebuild_focus": "Preserve API URLs, JSON parsing, room map behavior, historical charting, and safe test-data generation behavior.",
        "proof": [
            "The viewer can fetch current and historical particle data from a test server.",
            "Room labels color correctly from API `room_name` and `sensor_number` values.",
            "The generator can target localhost without accidentally writing to production.",
        ],
        "external_inputs": ["Particle API URL", "TLS behavior", "test server target", "room naming convention"],
        "pitfalls": ["Canonical maintained viewer behavior is in NanofabToolkit/ParticleSensor.", "Timezone conversion has known drift risk."],
    },
    "UNanofabTools/dattools": {
        "role": "DATfixer and DATgrapher command-line tools for Denton 635 log conversion and plotting.",
        "open_when": "Open this when a raw Denton `.DAT` log needs decoding or a cleaned log needs a pressure graph.",
        "rebuild_focus": "Preserve binary marker parsing, cleaned text format, timestamp extraction, pressure extraction, graph options, and CLI flags.",
        "proof": [
            "A representative `.DAT` file produces the same cleaned text shape.",
            "A cleaned text file produces the expected pressure/time plot.",
            "Malformed or incomplete logs fail with a documented message.",
        ],
        "external_inputs": ["Representative Denton `.DAT` logs", "matplotlib backend", "local filesystem write permission"],
        "pitfalls": ["DATfixer and DATgrapher duplicate parsing assumptions.", "Graph display behavior differs on headless hosts."],
    },
    "UNanofabTools/utilities": {
        "role": "Standalone helpers including peak counting, certificate conversion, SSH fetch helper, chem DB init, and unfinished monitor storage.",
        "open_when": "Open this for one-off helper rebuilds or to decide whether a helper should be retained, replaced, or retired.",
        "rebuild_focus": "Preserve CLI flags, file formats, certificate output expectations, SSH behavior, database bootstrap behavior, and explicit unfinished status.",
        "proof": [
            "Peak counting returns the same cycle count on known input.",
            "Certificate conversion writes files in the expected format without exposing passwords.",
            "SSH fetch behavior is either recreated as a personal dev helper or replaced by a documented safer flow.",
        ],
        "external_inputs": ["Input data files", "PFX/certificate password from secure storage", "SSH host/key material", "database credentials"],
        "pitfalls": ["Do not promote personal helper credentials to production.", "Some files are intentionally stubs or one-off scripts."],
    },
    "UNanofabTools/hscdisplayerserver": {
        "role": "Legacy monolithic HSC displayer server retained for historical reference.",
        "open_when": "Open this when you find old server behavior that predates the Flask app or need to compare a legacy route to the modern implementation.",
        "rebuild_focus": "Preserve only enough behavior to understand migration history unless an explicit legacy rescue is required.",
        "proof": [
            "A maintainer can identify which behavior moved to the Flask server.",
            "Any recreated legacy behavior is isolated from the production Flask path.",
        ],
        "external_inputs": ["Historical HSCDATA files", "legacy server host assumptions"],
        "pitfalls": ["Do not revive legacy server code as the primary path without a written migration reason."],
    },
    "NanofabToolkit/PicoHelperTools": {
        "role": "Canonical Pico firmware and helper scripts for sensor devices.",
        "open_when": "Open this first for Pico firmware rebuilds, sensor device setup, MAC discovery, network diagnostics, and MicroPython deployment.",
        "rebuild_focus": "Preserve MicroPython boot behavior, sensor drivers, WiFi setup, payload schemas, endpoint URLs, and device setup instructions.",
        "proof": [
            "A Pico can run the recreated boot and sensor script without missing modules.",
            "Network check and MAC discovery work on hardware.",
            "Payloads accepted by the Flask API are byte-for-byte compatible in field names and units.",
        ],
        "external_inputs": ["WiFi credentials from secure storage", "Pico device identity", "server URL", "sensor wiring and power"],
        "pitfalls": ["Hard-coded secrets must be replaced by approved configuration.", "Hardware failures can masquerade as firmware failures."],
    },
    "NanofabToolkit/ParticleSensor": {
        "role": "Canonical desktop particle sensor viewer and API client.",
        "open_when": "Open this for maintained particle desktop GUI behavior, API processing, packaging, or current-vs-historical particle data workflows.",
        "rebuild_focus": "Preserve GUI layout, API client behavior, data processing, room map semantics, package entrypoint, and environment data display.",
        "proof": [
            "The GUI launches from a clean environment.",
            "Current and historical API responses render with the expected rooms, tables, and charts.",
            "Packaging inputs still produce an executable with the expected assets.",
        ],
        "external_inputs": ["Particle API URL", "TLS/certificate behavior", "PyQt/matplotlib dependencies", "packaging assets"],
        "pitfalls": ["Keep API processing and GUI copies synchronized.", "Timezone handling is a known risk area."],
    },
    "NanofabToolkit/ALDPeakCounter": {
        "role": "Desktop GUI for ALD pressure peak counting.",
        "open_when": "Open this when ALD pressure files need a GUI workflow or the shared peak-count algorithm must be rebuilt.",
        "rebuild_focus": "Preserve file parsing, peak detection parameters, end-peak heuristic, plotting, GUI controls, and packaging behavior.",
        "proof": [
            "Known ALD data returns the same peak count.",
            "The GUI can load one file and multiple files.",
            "Packaged app includes required plotting hooks and assets.",
        ],
        "external_inputs": ["Representative ALD data files", "PyQt/matplotlib/scipy stack", "packaging icon/assets"],
        "pitfalls": ["The peak algorithm overlaps UNanofabTools/peakCount.py.", "Boundary peaks are easy to miss."],
    },
    "NanofabToolkit/DentonDecoder": {
        "role": "Desktop Denton decoder and graphing tool.",
        "open_when": "Open this for GUI Denton conversion/viewing workflows distinct from command-line DATfixer/DATgrapher.",
        "rebuild_focus": "Preserve decoder behavior, graphing behavior, GUI actions, package entrypoint, and PyInstaller hooks.",
        "proof": [
            "Known Denton input converts to the expected readable output.",
            "Graphs render without blocking or missing dependencies.",
            "The GUI and packaged executable launch successfully.",
        ],
        "external_inputs": ["Representative Denton logs", "GUI dependencies", "packaging hooks/assets"],
        "pitfalls": ["Do not confuse this GUI workflow with UNanofabTools command-line DAT tools."],
    },
    "NanofabToolkit/ParalyneReader": {
        "role": "Desktop Parylene analog log reader and plotting GUI.",
        "open_when": "Open this for Parylene log viewing, time-series parsing, GUI behavior, or packaging reconstruction.",
        "rebuild_focus": "Preserve log parsing, GUI state, plotting, file selection, error messages, and package assets.",
        "proof": [
            "Known Parylene logs load and plot correctly.",
            "Malformed logs produce useful errors.",
            "The GUI launches from source and packaged form.",
        ],
        "external_inputs": ["Representative Parylene logs", "GUI dependencies", "packaging icon/assets"],
        "pitfalls": ["Local logs and generated artifacts should not become source-of-truth documentation."],
    },
    "NanofabToolkit/PreciousMetalReader": {
        "role": "Desktop tool for retrieving and presenting precious metal usage data.",
        "open_when": "Open this for precious metal monthly retrieval, CORES-style data access, GUI behavior, or packaging reconstruction.",
        "rebuild_focus": "Preserve month retrieval behavior, API contracts, CSV/table output, GUI controls, and packaging entrypoints.",
        "proof": [
            "A test retrieval returns the expected month data shape.",
            "The GUI presents results without blocking or crashing on empty months.",
            "Packaging includes required dependencies and assets.",
        ],
        "external_inputs": ["Approved data endpoint credentials", "month/date inputs", "GUI dependencies", "packaging assets"],
        "pitfalls": ["Network/API failures need visible operator feedback.", "Do not embed tokens in source."],
    },
    "NanofabToolkit/packaging-root": {
        "role": "NanofabToolkit root docs, shared packaging hooks, license, and CI workflow.",
        "open_when": "Open this when rebuilding packaging infrastructure, GitHub Actions, PyInstaller hooks, or repo-level metadata.",
        "rebuild_focus": "Preserve package workflow behavior, hook names, asset inclusion rules, license text, and root README expectations.",
        "proof": [
            "Packaging hooks are discoverable by PyInstaller.",
            "The ParticleSensor build workflow still names the right paths.",
            "Root metadata matches the tool folders.",
        ],
        "external_inputs": ["GitHub Actions environment", "PyInstaller dependency versions", "release artifact expectations"],
        "pitfalls": ["Packaging fixes can affect multiple desktop tools.", "Generated release artifacts are not source files."],
    },
}


def playbook_for(key: tuple[str, str, str, str]) -> dict[str, object]:
    _num, repo, slug, _title = key
    return TOOL_PLAYBOOKS.get(f"{repo}/{slug}", DEFAULT_PLAYBOOK)


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


def source_breadcrumbs(sf: SourceFile) -> str:
    key = tool_key(sf)
    source_dir = tool_folder(key) / "source-files"
    tool_readme = tool_folder(key) / "README.md"
    links = [
        ("Path F Home", OUT / "README.md"),
        ("Navigator", OUT / "NAVIGATOR.md"),
        ("Troubleshooting Routes", OUT / "TROUBLESHOOTING-ROUTES.md"),
        ("Reconstruction Checklist", OUT / "RECONSTRUCTION-CHECKLIST.md"),
        ("First Hour", OUT / "MAINTAINER-FIRST-HOUR.md"),
        ("Glossary", OUT / "GLOSSARY.md"),
        ("Evidence Template", OUT / "REBUILD-EVIDENCE-TEMPLATE.md"),
        ("Tool Index", TOOL_DIR / "INDEX.md"),
        ("System Map", TOOL_DIR / "00-system-map" / "README.md"),
        ("Owning Tool README", tool_readme),
    ]
    return (
        "## Breadcrumbs\n\n"
        + " | ".join(f"[{label}]({rel_link(source_dir, target)})" for label, target in links)
        + "\n\n"
        "If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.\n\n"
    )


def file_reconstruction_intro(sf: SourceFile, text: str, sanitized: str) -> str:
    line_count = len(text.splitlines())
    digest = hashlib.sha256(sanitized.encode()).hexdigest()[:16]
    dirty = "yes" if sf.dirty else "no"
    untracked = "yes" if sf.untracked else "no"
    chunks = [
        f"\n\n# Source Reconstruction: {sf.display}\n\n",
        source_breadcrumbs(sf),
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


def bullet_list(items: list[str]) -> str:
    return "".join(f"- {item}\n" for item in items)


def tool_intro(
    key: tuple[str, str, str, str],
    files: list[SourceFile],
    source_paths: dict[str, Path],
) -> str:
    title = title_from_key(key)
    playbook = playbook_for(key)
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
        "## When To Open This Folder\n\n"
        f"{playbook['open_when']}\n\n"
        "## What This Tool Does\n\n"
        f"{playbook['role']}\n\n"
        "## Rebuild Focus\n\n"
        f"{playbook['rebuild_focus']}\n\n"
        "## External Inputs You Must Supply\n\n"
        f"{bullet_list(playbook['external_inputs'])}\n"
        "## Proof That The Rebuild Works\n\n"
        f"{bullet_list(playbook['proof'])}\n"
        "## Common Ways To Get Lost\n\n"
        f"{bullet_list(playbook['pitfalls'])}\n"
        "## Folder Layout\n\n"
        "- `README.md`: tool-level reconstruction contract and source index.\n"
        "- `source-files/`: one reconstruction page per source file covered by this tool.\n"
        "- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.\n\n"
        "## Recommended Reading Order\n\n"
        "1. Read this README and write a one-paragraph contract for the tool.\n"
        "2. Open only the source-file pages needed for that contract.\n"
        "3. For each edited or recreated file, complete the file's edge-case matrix.\n"
        "4. Run the proof checks above before declaring the tool rebuilt.\n\n"
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


def tool_entry_parts(entry: dict[str, object]) -> tuple[tuple[str, str, str, str], list[SourceFile], Path]:
    key = entry["key"]
    files = entry["files"]
    folder = entry["folder"]
    assert isinstance(key, tuple)
    assert isinstance(files, list)
    assert isinstance(folder, Path)
    return key, files, folder


def group_totals_from_counts(counts: dict[str, int]) -> dict[str, int]:
    totals: dict[str, int] = {}
    for name, count in counts.items():
        parts = Path(name).parts
        if name in NAVIGATION_FILES:
            group = "navigation/"
        elif name == "tools/INDEX.md":
            group = "tools/INDEX.md"
        elif len(parts) >= 2 and parts[0] == "tools" and parts[1] == "00-system-map":
            group = "tools/00-system-map/"
        elif len(parts) >= 3 and parts[0] == "tools":
            group = f"tools/{parts[1]}/{parts[2]}/"
        else:
            group = "other"
        totals[group] = totals.get(group, 0) + count
    return totals


def tool_word_count(counts: dict[str, int], folder: Path) -> int:
    prefix = folder.relative_to(OUT).as_posix() + "/"
    return sum(count for name, count in counts.items() if name.startswith(prefix))


def render_tools_index(tool_entries: list[dict[str, object]], counts: dict[str, int]) -> str:
    rows = []
    for entry in tool_entries:
        key, files, folder = tool_entry_parts(entry)
        playbook = playbook_for(key)
        rel = folder.relative_to(TOOL_DIR).as_posix()
        rows.append(
            "| "
            f"[`{markdown_escape(key[1] + '/' + key[2])}`]({rel}/README.md) | "
            f"{markdown_escape(playbook['role'])} | "
            f"{len(files)} | "
            f"{tool_word_count(counts, folder):,} | "
            f"{markdown_escape(playbook['open_when'])} |"
        )
    return (
        "# Path F Tool Index\n\n"
        "Use this file as the table of contents for the reconstruction body. "
        "It exists so a maintainer can choose a tool folder directly instead of opening the 3.6M-word corpus linearly.\n\n"
        "## How To Use This Index\n\n"
        "1. Find the behavior, failure, or rebuild target in the table.\n"
        "2. Open that tool folder's `README.md` first.\n"
        "3. Open only the source-file pages named by that tool README.\n"
        "4. Return to `../RECONSTRUCTION-CHECKLIST.md` before declaring the rebuild complete.\n\n"
        "## Tool Folders\n\n"
        "| Tool folder | Role | Source files | Words | Open when |\n|---|---|---:|---:|---|\n"
        + "\n".join(rows)
        + "\n"
    )


def render_navigator(tool_entries: list[dict[str, object]], counts: dict[str, int]) -> str:
    tool_lookup = {f"{tool_entry_parts(entry)[0][1]}/{tool_entry_parts(entry)[0][2]}": tool_entry_parts(entry)[2] for entry in tool_entries}

    def tool_link(tool_id: str, label: str | None = None) -> str:
        folder = tool_lookup[tool_id]
        text = label or tool_id
        return f"[`{text}`]({folder.relative_to(OUT).as_posix()}/README.md)"

    quick_routes = [
        (
            "Rebuild or debug the production web app",
            f"{tool_link('UNanofabTools/flaskserver')} plus [`tools/00-system-map`](tools/00-system-map/README.md)",
            "Local Flask import/run succeeds; route, template, database, API, and config contracts match the source pages.",
        ),
        (
            "Machine pages stopped updating",
            f"{tool_link('UNanofabTools/hscdownloader')} then {tool_link('UNanofabTools/flaskserver')}",
            "CORES data becomes full and `small_` HSCDATA CSVs; Flask machine pages read and graph the expected columns.",
        ),
        (
            "Particle sensors or particle GUI need rebuilding",
            f"{tool_link('NanofabToolkit/PicoHelperTools')} then {tool_link('UNanofabTools/flaskserver')} then {tool_link('NanofabToolkit/ParticleSensor')}",
            "Pico payloads are accepted by the API; desktop GUI renders current and historical data.",
        ),
        (
            "Machine control PC upload broke",
            f"{tool_link('UNanofabTools/filetransfer')} plus [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md)",
            "A test file transfers from the control PC path to the expected server destination with visible failure modes.",
        ),
        (
            "Denton raw logs need decoding",
            f"{tool_link('UNanofabTools/dattools')} for CLI flow or {tool_link('NanofabToolkit/DentonDecoder')} for GUI flow",
            "Known Denton input produces the expected cleaned output and graph behavior.",
        ),
        (
            "ALD peak counting needs rebuilding",
            f"{tool_link('NanofabToolkit/ALDPeakCounter')} and {tool_link('UNanofabTools/utilities')}",
            "Known pressure files return the same peak counts in CLI and GUI contexts.",
        ),
        (
            "Parylene logs need a desktop reader",
            tool_link("NanofabToolkit/ParalyneReader"),
            "Known Parylene logs load, parse, and plot; malformed logs produce clear errors.",
        ),
        (
            "Precious metal data retrieval needs rebuilding",
            tool_link("NanofabToolkit/PreciousMetalReader"),
            "Known month/date inputs return the expected table shape without embedded credentials.",
        ),
        (
            "Packaging, hooks, or GitHub Actions broke",
            tool_link("NanofabToolkit/packaging-root"),
            "PyInstaller hooks and workflow paths match the tool entrypoints and assets.",
        ),
        (
            "You found historical server behavior",
            tool_link("UNanofabTools/hscdisplayerserver"),
            "The legacy behavior is mapped to modern Flask behavior or explicitly isolated as historical.",
        ),
    ]

    route_rows = "\n".join(f"| {need} | {folder} | {proof} |" for need, folder, proof in quick_routes)

    tool_rows = []
    for entry in tool_entries:
        key, files, folder = tool_entry_parts(entry)
        playbook = playbook_for(key)
        tool_rows.append(
            "| "
            f"[`{markdown_escape(key[1] + '/' + key[2])}`]({folder.relative_to(OUT).as_posix()}/README.md) | "
            f"{len(files)} | "
            f"{tool_word_count(counts, folder):,} | "
            f"{markdown_escape(playbook['open_when'])} |"
        )

    return (
        "# Path F Navigator\n\n"
        "This is the first file to open when Path F feels too large. "
        "Path F is intentionally exhaustive, but it is not meant to be read like a novel. "
        "Choose the failing system, open the matching tool README, then use the source-file pages only as evidence.\n\n"
        "## Do Not Get Lost Rules\n\n"
        "1. Do not start with `source-files/` unless a tool README points you there.\n"
        "2. Do not read the Flask folder linearly unless you are rebuilding the entire server.\n"
        "3. Do not treat redacted values as recoverable secrets; supply them from approved local configuration.\n"
        "4. Do not treat Path F as live-state truth; production and fresh surveys can override generated documentation.\n"
        "5. Use `TROUBLESHOOTING-ROUTES.md` when you have a symptom but not a tool name.\n"
        "6. Do not close a rebuild until the proof checks in `RECONSTRUCTION-CHECKLIST.md` are complete and `REBUILD-EVIDENCE-TEMPLATE.md` is filled in.\n\n"
        "## Fast Route Chooser\n\n"
        "| Need | Open | Done when |\n|---|---|---|\n"
        f"{route_rows}\n\n"
        "## Required Reading Sequence\n\n"
        "1. Read [`MAINTAINER-FIRST-HOUR.md`](MAINTAINER-FIRST-HOUR.md) if you are new or responding under stress.\n"
        "2. Read this navigator.\n"
        "3. Read [`TROUBLESHOOTING-ROUTES.md`](TROUBLESHOOTING-ROUTES.md) if you have a symptom.\n"
        "4. Read [`GLOSSARY.md`](GLOSSARY.md) for unfamiliar terms before guessing.\n"
        "5. Read [`RECONSTRUCTION-CHECKLIST.md`](RECONSTRUCTION-CHECKLIST.md).\n"
        "6. Read [`tools/INDEX.md`](tools/INDEX.md) if your target is not obvious from the route chooser.\n"
        "7. Read [`tools/00-system-map/README.md`](tools/00-system-map/README.md) to understand source-of-truth and edge-case rules.\n"
        "8. Read one tool `README.md` at a time.\n"
        "9. Open source-file pages only when implementing or verifying that specific file; use their breadcrumbs to climb back out.\n\n"
        "## Tool Map\n\n"
        "| Tool folder | Source files | Words | Open when |\n|---|---:|---:|---|\n"
        + "\n".join(tool_rows)
        + "\n\n"
        "## External Inputs That Path F Cannot Invent\n\n"
        "- Live secret values: Flask secret, Duo values, CORES bearer token, WiFi password, SSH keys, certificate passwords, and endpoint credentials.\n"
        "- Live server state: active tmux sessions, nginx state, TLS renewal state, PostgreSQL state, SQLite instance files, HSCDATA contents, and IT-managed backup status.\n"
        "- Hardware state: Pico wiring, machine control PC paths, cleanroom network reachability, sensor identity, and representative log files.\n"
        "- University IT decisions: root access, VM patching, root-owned SSH keys, off-box backups, firewall changes, and UNIX account creation.\n\n"
        "## Fresh-Consumer Test\n\n"
        "Use this test whenever the documentation has changed substantially:\n\n"
        "```sh\n"
        "bash support/audit.sh\n"
        "sed -n '1,220p' support/path-f-reconstruction/NAVIGATOR.md\n"
        "sed -n '1,220p' support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md\n"
        "sed -n '1,180p' support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md\n"
        "sed -n '1,220p' support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md\n"
        "sed -n '1,160p' support/path-f-reconstruction/GLOSSARY.md\n"
        "sed -n '1,120p' support/path-f-reconstruction/tools/INDEX.md\n"
        "```\n\n"
        "A fresh consumer should be able to choose a folder for their task without opening `WORDCOUNT.md` or browsing every generated source page.\n"
    )


def render_reconstruction_checklist(tool_entries: list[dict[str, object]]) -> str:
    chunks = [
        "# Path F Reconstruction Checklist\n\n",
        "Use this checklist to decide whether a rebuild is actually complete. "
        "The source-file pages explain line-level behavior; this file defines the proof gates that prevent a maintainer from getting buried in detail without finishing the system.\n\n",
        "## Universal Completion Gates\n\n",
        "1. **Scope gate**: name the exact tool folder, source files, external inputs, and live systems involved.\n",
        "2. **Recreate gate**: rebuild the files, commands, routes, templates, schemas, or firmware behavior from the sanitized excerpts and notes.\n",
        "3. **Edge-case gate**: test the universal edge cases that apply: empty input, malformed input, missing file, permission denied, stale credential, schema drift, partial write, concurrent request, wrong working directory, wrong user account, IT boundary, and production-vs-development configuration.\n",
        "4. **Evidence gate**: save command output, screenshots, generated files, database diffs, logs, or written observations that prove the rebuilt behavior matches the documented contract.\n",
        "5. **Handoff gate**: write down any deliberate compatibility break, unresolved live-state difference, redacted value location, or IT ticket.\n\n",
        "## Source-Of-Truth Order\n\n",
        "1. Live production evidence wins over generated documentation.\n",
        "2. Current sibling source repo state wins over old prose in the documentation bundle.\n",
        "3. Generated Path F source excerpts win over memory and guesses.\n",
        "4. Historical notes explain why something exists, but they do not override current source or live state.\n\n",
        "## Secret And Configuration Rule\n\n",
        "Every redacted value must be supplied through approved configuration, a local `.env`, secure firmware provisioning, University IT, or another approved secret channel. "
        "Never reconstruct a live secret by guessing from placeholder length, surrounding prose, old screenshots, generated excerpts, or shell history.\n\n",
        "## Per-Tool Proof Checklist\n\n",
    ]

    for entry in tool_entries:
        key, files, folder = tool_entry_parts(entry)
        playbook = playbook_for(key)
        chunks.append(f"### `{key[1]}/{key[2]}`\n\n")
        chunks.append(f"- Folder: [`{folder.relative_to(OUT).as_posix()}/README.md`]({folder.relative_to(OUT).as_posix()}/README.md)\n")
        chunks.append(f"- Source files covered: `{len(files)}`\n")
        chunks.append(f"- Role: {playbook['role']}\n")
        chunks.append("- External inputs to identify before rebuilding:\n")
        for item in playbook["external_inputs"]:
            chunks.append(f"  - {item}\n")
        chunks.append("- Proof checks:\n")
        for item in playbook["proof"]:
            chunks.append(f"  - {item}\n")
        chunks.append("- Drift traps to check:\n")
        for item in playbook["pitfalls"]:
            chunks.append(f"  - {item}\n")
        chunks.append("\n")

    chunks.append(
        "## Final No-Contact Test\n\n"
        "A future maintainer passes Path F only when they can pick any one tool folder, state what it owns, identify what external values must come from outside the repo, rebuild or simulate the tool, run the proof checks, and explain whether remaining work belongs to Nanofab engineering or University IT.\n"
    )
    return "".join(chunks)


def tool_lookup_from_entries(tool_entries: list[dict[str, object]]) -> dict[str, Path]:
    return {f"{tool_entry_parts(entry)[0][1]}/{tool_entry_parts(entry)[0][2]}": tool_entry_parts(entry)[2] for entry in tool_entries}


def root_tool_link(tool_lookup: dict[str, Path], tool_id: str, label: str | None = None) -> str:
    text = label or tool_id
    return f"[`{text}`]({tool_lookup[tool_id].relative_to(OUT).as_posix()}/README.md)"


def render_troubleshooting_routes(tool_entries: list[dict[str, object]]) -> str:
    lookup = tool_lookup_from_entries(tool_entries)
    rows = [
        (
            "Website down or blank",
            "Nanofab for Flask process; IT for VM/nginx/root-owned service state",
            f"{root_tool_link(lookup, 'UNanofabTools/flaskserver')} and [`tools/00-system-map`](tools/00-system-map/README.md)",
            "`tmux ls`, Flask process logs, nginx status if accessible, disk space, Python import/run behavior",
            "Local import/run works or live process is restored; any root/nginx/VM action is written as an IT ticket.",
        ),
        (
            "Login, signup, reset, or Duo broken",
            "Nanofab for Flask/auth code; IT only if network/VM/certificate state blocks auth",
            root_tool_link(lookup, "UNanofabTools/flaskserver"),
            "Auth blueprint, auth service, `.env` values, Duo config, session DB behavior, browser redirects",
            "Expected login/reset route behavior works in a test path and secrets remain outside source.",
        ),
        (
            "Chemical inventory broken",
            "Nanofab for Flask/chem schema; IT only for VM/PostgreSQL service actions outside `phelan` authority",
            root_tool_link(lookup, "UNanofabTools/flaskserver"),
            "Chem routes, chem service, local PostgreSQL schema, barcode templates, transaction tables, upload scans",
            "Add/edit/move/remove/report/scan workflows preserve database state and visible output.",
        ),
        (
            "Machine pages stale or missing data",
            "Nanofab for downloader/code/HSCDATA; CORES owner for upstream payload/token; IT for network/VM failures",
            f"{root_tool_link(lookup, 'UNanofabTools/hscdownloader')} then {root_tool_link(lookup, 'UNanofabTools/flaskserver')}",
            "CORES token, service IDs, downloader output, `small_` CSV columns, Flask machine readers",
            "Fresh test data writes expected CSVs and the machine page renders matching tables/graphs.",
        ),
        (
            "Machine control PC upload failed",
            "Nanofab for script paths/keys; IT for service account or UNIX account creation",
            root_tool_link(lookup, "UNanofabTools/filetransfer"),
            "Windows path, SSH key, destination directory, quoting, network reachability, account ownership",
            "A test file transfers to the expected server path with visible success/failure output.",
        ),
        (
            "Particle sensor not reporting",
            "Nanofab for firmware/API; local facilities/network owner for WiFi/hardware; IT only for VM/network boundaries",
            f"{root_tool_link(lookup, 'NanofabToolkit/PicoHelperTools')} then {root_tool_link(lookup, 'UNanofabTools/flaskserver')}",
            "Pico power, WiFi credentials, MAC/device identity, endpoint URL, API payload shape, server logs",
            "Hardware posts a payload accepted by Flask and visible to the particle data consumer.",
        ),
        (
            "Particle desktop GUI will not launch or display data",
            "Nanofab for desktop code/API URL/dependencies",
            root_tool_link(lookup, "NanofabToolkit/ParticleSensor"),
            "Python environment, PyQt/matplotlib imports, API URL, TLS behavior, current/historical JSON shape",
            "GUI launches and renders current plus historical data from a test or production-safe endpoint.",
        ),
        (
            "Pico cannot connect to WiFi",
            "Nanofab for firmware/provisioning; network owner for WiFi availability",
            root_tool_link(lookup, "NanofabToolkit/PicoHelperTools"),
            "WiFi SSID/password source, Pico MAC, signal/power, network-check script, endpoint DNS",
            "Network diagnostic gives a clear pass/fail and no WiFi secret is committed.",
        ),
        (
            "Denton/ALD/Parylene data will not parse",
            "Nanofab for desktop/CLI parser behavior",
            f"{root_tool_link(lookup, 'UNanofabTools/dattools')}, {root_tool_link(lookup, 'NanofabToolkit/DentonDecoder')}, {root_tool_link(lookup, 'NanofabToolkit/ALDPeakCounter')}, or {root_tool_link(lookup, 'NanofabToolkit/ParalyneReader')}",
            "Representative input file, parser assumptions, graph backend, GUI dependency stack",
            "Known input produces expected cleaned output, plot, count, or explicit malformed-file error.",
        ),
        (
            "Packaging build failed",
            "Nanofab for packaging files/dependencies; GitHub/admin owner for CI secrets or runner issues",
            root_tool_link(lookup, "NanofabToolkit/packaging-root"),
            "PyInstaller spec, hooks, assets, workflow paths, dependency versions, release artifacts",
            "Build can reproduce the expected executable/artifact or the failure is isolated to CI environment.",
        ),
        (
            "Root account, UNIX accounts, backups, firewall, or VM patching question",
            "University IT",
            "[`tools/00-system-map`](tools/00-system-map/README.md) and [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md)",
            "Live-server docs, snapshots, IT ownership notes, root boundary, backup notes",
            "Nanofab action is limited to documentation, read-only verification, or an IT ticket.",
        ),
    ]
    table = "\n".join(
        "| "
        f"{markdown_escape(problem)} | {markdown_escape(owner)} | {open_first} | {markdown_escape(checks)} | {markdown_escape(done)} |"
        for problem, owner, open_first, checks, done in rows
    )
    return (
        "# Path F Troubleshooting Routes\n\n"
        "Use this file when the maintainer starts with a symptom rather than a tool name. "
        "Each row says who likely owns the fix, where to start reading, what to check live, and what proof closes the issue.\n\n"
        "## Symptom Routes\n\n"
        "| Problem | Likely owner | Open first | Live checks | Proof of fix |\n|---|---|---|---|---|\n"
        f"{table}\n\n"
        "## Escalation Rule\n\n"
        "If the row names University IT, do not turn it into a Nanofab code task. Record the evidence, preserve the read-only findings, and open or update the appropriate IT ticket.\n"
    )


def render_first_hour(tool_entries: list[dict[str, object]]) -> str:
    lookup = tool_lookup_from_entries(tool_entries)
    return (
        "# Path F Maintainer First Hour\n\n"
        "This is the stress-case entry point for a new maintainer. "
        "Use it before touching code, restarting services, editing firmware, or rewriting documentation.\n\n"
        "## Minute 0-10: Establish The Map\n\n"
        "1. Read [`README.md`](README.md).\n"
        "2. Read [`NAVIGATOR.md`](NAVIGATOR.md), especially the Do Not Get Lost rules.\n"
        "3. Read [`TROUBLESHOOTING-ROUTES.md`](TROUBLESHOOTING-ROUTES.md) if there is an active failure.\n"
        "4. Read [`GLOSSARY.md`](GLOSSARY.md) for any unfamiliar names before guessing.\n\n"
        "## Minute 10-25: Identify Ownership\n\n"
        "1. Decide whether the task is Nanofab-owned, IT-owned, CORES-owned, hardware/network-owned, or mixed.\n"
        "2. If it involves root, UNIX accounts, VM backups, firewall, or base patching, stop and write it as an IT-bound item.\n"
        "3. If it involves a redacted value, identify the approved source for that value before running code.\n\n"
        "## Minute 25-40: Choose One Folder\n\n"
        "Use this shortcut list:\n\n"
        f"- Server/browser/auth/chem/API: {root_tool_link(lookup, 'UNanofabTools/flaskserver')}\n"
        f"- CORES to machine pages: {root_tool_link(lookup, 'UNanofabTools/hscdownloader')}\n"
        f"- Machine PC uploads: {root_tool_link(lookup, 'UNanofabTools/filetransfer')}\n"
        f"- Pico firmware: {root_tool_link(lookup, 'NanofabToolkit/PicoHelperTools')}\n"
        f"- Particle desktop GUI: {root_tool_link(lookup, 'NanofabToolkit/ParticleSensor')}\n"
        f"- Denton/ALD/Parylene/Precious Metal desktop tools: [`tools/INDEX.md`](tools/INDEX.md)\n"
        f"- Legacy server context: {root_tool_link(lookup, 'UNanofabTools/hscdisplayerserver')}\n\n"
        "## Minute 40-55: Read Only The Right Evidence\n\n"
        "1. Read the chosen tool `README.md`.\n"
        "2. Write down the external inputs that cannot be recovered from Path F.\n"
        "3. Open source-file pages only for the files directly involved.\n"
        "4. Use the breadcrumbs at the top of each source page if you land there from search.\n\n"
        "## Minute 55-60: Decide The Next Action\n\n"
        "Choose exactly one:\n\n"
        "- Continue with a Nanofab code/documentation fix and fill out [`REBUILD-EVIDENCE-TEMPLATE.md`](REBUILD-EVIDENCE-TEMPLATE.md).\n"
        "- Collect live evidence and create an IT/CORES/hardware ticket.\n"
        "- Stop because a required secret, hardware device, or live system is unavailable.\n\n"
        "Do not spend the first hour reading random source-file pages. The first hour is for orientation, ownership, and choosing the narrowest useful evidence path.\n"
    )


def render_glossary() -> str:
    terms = [
        ("nfhistory", "Production VM/host for the Nanofab history web app and related data workflows."),
        ("UNanofabTools", "Source repo for the Flask server, HSC downloader, file-transfer scripts, older Pico copies, DAT tools, utilities, and legacy server context."),
        ("NanofabToolkit", "Sibling source repo for the maintained desktop tools and canonical Pico helper tools."),
        ("Path F", "Ultra-deep generated reconstruction manual intended to support rebuilding behavior from sanitized documentation."),
        ("Path E", "All-encompassing presentation/script path for live maintainer handoff, not a source reconstruction corpus."),
        ("phelan", "Shared UNIX account used by Nanofab-side maintenance on nfhistory; not root."),
        ("root", "University IT-owned administrative account on the VM. Nanofab maintainers should not modify root-owned paths."),
        ("iceolate", "University IT administrative host referenced in root SSH context."),
        ("CADE", "University access hop used in the documented SSH path to nfhistory."),
        ("tmux", "Terminal multiplexer used to keep long-running server/downloader sessions alive."),
        ("CORES", "Upstream system providing machine form data through n8n webhooks."),
        ("n8n", "Webhook automation service used by CORES data exports."),
        ("HSCDATA", "CSV data tree written by HSCDownloader and read by machine pages."),
        ("small_ CSV", "Trimmed per-machine CSV variant consumed by the web portal tables and graphs."),
        ("LogData", "Server-side data tree for logged cleanroom data, separate from generated documentation."),
        ("Flask server", "Modern web app under `UNanofabTools/app` plus `run.py`, config, templates, services, and models."),
        ("Blueprint", "Flask route grouping such as auth, tasks, machines, API, or chem inventory."),
        ("Duo", "Two-factor authentication integration used by the Flask auth flow."),
        ("SQLite instance files", "Local database files for users, sessions, tasks, and particle sensor data."),
        ("local PostgreSQL chem database", "Chemical inventory database running locally on the VM, not an external PostgreSQL host."),
        ("Particle API", "Flask API contract used by Pico firmware and particle desktop viewers."),
        ("Pico", "Raspberry Pi Pico W device running MicroPython firmware for sensor workflows."),
        ("PicoHelperTools", "Canonical NanofabToolkit folder for Pico firmware and setup helpers."),
        ("ParticleSensor", "NanofabToolkit desktop particle data viewer/API client."),
        ("DAT", "Denton binary or cleaned log data handled by DATfixer/DATgrapher and related desktop tools."),
        ("DentonDecoder", "NanofabToolkit GUI workflow for Denton data conversion/viewing."),
        ("ALDPeakCounter", "NanofabToolkit GUI for ALD pressure peak counting."),
        ("ParalyneReader", "NanofabToolkit Parylene log reader; spelling follows existing repo naming."),
        ("PreciousMetalReader", "NanofabToolkit tool for retrieving and presenting precious metal usage data."),
        ("PyInstaller", "Packaging tool used for desktop app builds and hooks."),
        ("redacted value", "A secret-looking value replaced with a placeholder in generated excerpts. It must come from secure configuration, never from guessing."),
        ("IT boundary", "Responsibility line where root, VM patching, backups, firewall, and UNIX account creation belong to University IT."),
    ]
    rows = "\n".join(f"| `{markdown_escape(term)}` | {markdown_escape(definition)} |" for term, definition in terms)
    return (
        "# Path F Glossary\n\n"
        "Use this when a maintainer sees a name, acronym, host, account, tool, or data path and needs to know what it means before reading source pages.\n\n"
        "| Term | Meaning |\n|---|---|\n"
        f"{rows}\n"
    )


def render_evidence_template() -> str:
    return (
        "# Path F Rebuild Evidence Template\n\n"
        "Copy this structure into an issue, PR description, handoff note, or maintenance log whenever a tool is rebuilt, simulated, repaired, or deliberately not rebuilt.\n\n"
        "## Summary\n\n"
        "- Tool or workflow rebuilt:\n"
        "- Date:\n"
        "- Maintainer:\n"
        "- Reason for rebuild or investigation:\n"
        "- Final status: completed / partial / blocked / IT ticket / retired\n\n"
        "## Scope\n\n"
        "- Path F folder used:\n"
        "- Source-file pages used:\n"
        "- Live systems touched:\n"
        "- Systems intentionally not touched:\n\n"
        "## External Inputs Supplied\n\n"
        "- Secrets/config values supplied from approved storage:\n"
        "- Hardware or sample files used:\n"
        "- Live server/database paths used:\n"
        "- IT/CORES/network assumptions verified:\n\n"
        "## Commands And Actions\n\n"
        "```sh\n"
        "# paste commands here\n"
        "```\n\n"
        "## Evidence Collected\n\n"
        "- Logs:\n"
        "- Screenshots:\n"
        "- Output files:\n"
        "- Database checks:\n"
        "- Browser/API checks:\n"
        "- Hardware observations:\n\n"
        "## Edge Cases Tested\n\n"
        "- Empty input:\n"
        "- Malformed input:\n"
        "- Missing file:\n"
        "- Permission denied:\n"
        "- Stale credential:\n"
        "- Schema drift:\n"
        "- Partial write or network interruption:\n"
        "- Wrong working directory/account:\n"
        "- Production versus development configuration:\n\n"
        "## Compatibility And Drift\n\n"
        "- Behavior preserved exactly:\n"
        "- Deliberate compatibility breaks:\n"
        "- Differences from live production:\n"
        "- Differences from sibling source repo state:\n"
        "- Documentation updates needed:\n\n"
        "## Ownership And Follow-Up\n\n"
        "- Nanofab-owned follow-up:\n"
        "- University IT ticket needed:\n"
        "- CORES/upstream ticket needed:\n"
        "- Hardware/network follow-up:\n"
        "- No-contact handoff note for the next maintainer:\n"
    )


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
        tool_entries.append(
            {
                "key": key,
                "files": group,
                "folder": folder,
                "rehearsal_dir": rehearsal_dir,
                "source_paths": source_paths,
            }
        )

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
    tools_index_path = TOOL_DIR / "INDEX.md"
    write_generated(tools_index_path, render_tools_index(tool_entries, counts))
    generated.append(tools_index_path)

    first_hour_path = OUT / "MAINTAINER-FIRST-HOUR.md"
    write_generated(first_hour_path, render_first_hour(tool_entries))
    generated.append(first_hour_path)

    navigator_path = OUT / "NAVIGATOR.md"
    write_generated(navigator_path, render_navigator(tool_entries, counts))
    generated.append(navigator_path)

    troubleshooting_path = OUT / "TROUBLESHOOTING-ROUTES.md"
    write_generated(troubleshooting_path, render_troubleshooting_routes(tool_entries))
    generated.append(troubleshooting_path)

    checklist_path = OUT / "RECONSTRUCTION-CHECKLIST.md"
    write_generated(checklist_path, render_reconstruction_checklist(tool_entries))
    generated.append(checklist_path)

    glossary_path = OUT / "GLOSSARY.md"
    write_generated(glossary_path, render_glossary())
    generated.append(glossary_path)

    evidence_path = OUT / "REBUILD-EVIDENCE-TEMPLATE.md"
    write_generated(evidence_path, render_evidence_template())
    generated.append(evidence_path)

    counts = {str(p.relative_to(OUT)): wc_words(p) for p in generated}
    total = sum(counts.values())

    group_totals = group_totals_from_counts(counts)
    group_rows = "\n".join(f"| `{name}` | {count:,} |" for name, count in sorted(group_totals.items()))
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
        "1. [`MAINTAINER-FIRST-HOUR.md`](MAINTAINER-FIRST-HOUR.md) - use this first if you are new, under stress, or responding to a live issue.\n"
        "2. [`NAVIGATOR.md`](NAVIGATOR.md) - choose the right tool folder without reading the corpus linearly.\n"
        "3. [`TROUBLESHOOTING-ROUTES.md`](TROUBLESHOOTING-ROUTES.md) - map symptoms to likely owner, live checks, and proof of fix.\n"
        "4. [`GLOSSARY.md`](GLOSSARY.md) - resolve names, acronyms, hosts, accounts, and data paths before guessing.\n"
        "5. [`RECONSTRUCTION-CHECKLIST.md`](RECONSTRUCTION-CHECKLIST.md) - use this to prove a rebuild is complete.\n"
        "6. [`REBUILD-EVIDENCE-TEMPLATE.md`](REBUILD-EVIDENCE-TEMPLATE.md) - copy this into maintenance notes, issues, or PRs.\n"
        "7. [`tools/INDEX.md`](tools/INDEX.md) - dense index of every tool folder.\n"
        "8. [`tools/00-system-map/README.md`](tools/00-system-map/README.md) - source-of-truth and universal edge-case rules.\n"
        "9. Continue through the per-tool folders under `tools/UNanofabTools/` and `tools/NanofabToolkit/`.\n\n"
        "## Generated Group Word Counts\n\n"
        "| Group | Words |\n|---|---:|\n"
        f"{group_rows}\n"
    )
    write_generated(OUT / "README.md", readme)

    manifest = (
        "# Path F Word Count Manifest\n\n"
        f"- Total generated word count: **{total:,}**\n"
        f"- Target minimum: **{TARGET_WORDS:,}**\n"
        f"- Files included from source repos: **{len(files)}**\n"
        f"- Generated reconstruction files counted: **{len(generated)}**\n"
        "- Verification command: `{ printf '%s\\0' support/path-f-reconstruction/NAVIGATOR.md support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md support/path-f-reconstruction/GLOSSARY.md support/path-f-reconstruction/REBUILD-EVIDENCE-TEMPLATE.md; find support/path-f-reconstruction/tools -name '*.md' -print0; } | xargs -0 wc -w`\n\n"
        "## Generated Group Totals\n\n"
        "| Group | Words |\n|---|---:|\n"
        f"{group_rows}\n\n"
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
