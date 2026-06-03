# Medium Full Path E - Module 08: Machines And Logs

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-08-machines-logs.md

# Module 8 - Machines, Logs, And The File-Based Data Model

## Goal

The maintainer understands how machine pages, downloaded CORES data, uploaded machine logs, file browsing, downloads, and graphs depend on file trees as much as on databases.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md` (repo path: presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (repo path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Not all important data lives in a relational database. Machine pages and log views rely heavily on file trees. That makes backup, path correctness, naming conventions, and upload freshness operationally important."

SHOW:

Open `07-Machines-and-Logs.pptx`.

READ ALOUD:

"The machine pages are where cleanroom users expect to see useful historical machine data. Some of that data comes from `HSCDATA`, written by `HSCDownloader.py`. Some comes from `LogData`, written by machine-control-PC transfer scripts. Some views provide file browsing, downloads, and graphing. If a file tree is missing or stale, the website may still run but display incomplete or outdated information."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/machines.py
../UNanofabTools/HSCDATA
../UNanofabTools/LogData
```

If local source does not contain live data trees, read this instead:

READ ALOUD:

"The local source checkout may not contain production data trees. That is normal. Production data trees live on `nfhistory`, under the production install. We still use the source to understand route behavior and docs to understand live layout."

DO:

Run:

```sh
rg -n "HSCDATA|LogData|download|graph|machine|csv|send_file|safe_join" ../UNanofabTools/app
```

READ ALOUD:

"This search highlights file-based behavior. For any file-serving route, inspect path joining and sanitization. For any graphing route, identify the expected input file shape. For any download route, confirm it does not allow arbitrary file access."

## Data Durability Frame

READ ALOUD:

"File data creates a different durability problem from database data. A SQL backup alone is not enough if `HSCDATA`, `LogData`, or `uploads` are missing. The documentation says University IT handles off-box backups, but the Nanofab maintainer should confirm that the VM-level backup covers the app instance, uploads, logs, `HSCDATA`, `LogData`, and local PostgreSQL data."

SHOW:

Open live-server docs where backup and data trees are discussed.

READ ALOUD:

"Do not casually say there are no backups. The correct statement is that backups are IT-handled and coverage should be confirmed, especially for operational data trees and local PostgreSQL."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is `HSCDATA`? | The file tree of CORES-derived machine usage CSV data used by machine pages. |
| What writes `HSCDATA`? | `HSCDownloader.py`. |
| What is `LogData`? | The file tree of uploaded machine-control-PC logs and related log data. |
| What writes `LogData`? | File-transfer scripts from machine-control PCs, plus app/device flows where documented. |
| Why can the website be up while machine data is stale? | Flask/nginx may be healthy while downloader or file-transfer data pipelines have stopped or stopped writing fresh files. |
| Which file trees must be backed up? | `HSCDATA`, `LogData`, `uploads`, `instance/`, sensor/log file directories, and related production data paths. |
| What should a maintainer inspect before changing file download routes? | Path construction/sanitization, `safe_join` or equivalent protections, allowed directories, auth guards, and arbitrary-file-read risk. |

REQUIRE:

The maintainer can explain the difference between app uptime and data freshness.

## Stop Point

STOP POINT:

Stop here if the maintainer treats database backup as sufficient without file-tree backup.


# Expanded Module 08: Machines And Logs

READ ALOUD:

This expanded section revisits Module 08, Machines And Logs. The focus is HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 08

READ ALOUD:

We are now doing the orientation pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 08

READ ALOUD:

We are now doing the evidence pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 08

READ ALOUD:

We are now doing the source-code pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 08

READ ALOUD:

We are now doing the live-state pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 08

READ ALOUD:

We are now doing the failure-mode pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 07 — Machines and Log Files

The `machines` blueprint is the largest *display-side* module: it powers a page for every machine in the cleanroom plus a generic log-file browser, download endpoint, and graphing endpoint. The supporting logic lives in `app/services/data_service.py`, which knows how to parse CSV/TXT files and turn them into Chart.js graph data.

## What you get per machine

For each machine the team has a CSV file in the `DATA_DIR` (default `HSCDATA/`) named like `small_<MachineName>_DataCollection.csv`. The blueprint renders a generic page that shows:

- A sortable HTML table of every row in that CSV.
- One or more Chart.js graphs over selected columns.

For tools that produce raw run logs (ALD's RF + pressure data, Denton 635 logs, Parylene's analog data, Denton 18 pump logs), there's also a log-file browser that lists files chronologically and lets users download them or graph their contents.

## The blueprint — `machines.py`

### Index pages

```python
@machines_bp.route('/')
@login_required
def index():
    """Display machines index page"""
    return render_template('index.html')


@machines_bp.route('/machines')
@login_required
def machines():
    """Display machines page"""
    return render_template('machines.html')


@machines_bp.route('/logfiles')
@login_required
def log_files():
    """Display log files index"""
    return render_template('logFileIndex.html')
```

Three static pages: the site root, the "all machines" index, and the "all log files" index. All require login.

### Per-machine pages

There are roughly 17 routes that all look the same:

```python
@machines_bp.route('/ald')
@login_required
def ald():
    """Display ALD machine data"""
    return render_machine_data('ALD', [['Chuck Temperature (C)', 'Precursor Temperature (C)']])
```

The list groups by category:

- **Deposition Tools**: ALD, E-beam, MOCVD, Parylene, PECVD, Denton 635, Denton 18
- **Dry Etch Tools**: DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics
- **Furnace Tools**: CleanOx, DopedOx, LTO, Nitride, Poly, Allwin

Each route is one line: call `render_machine_data(machine_name, graph_columns)`. The second argument is a list of column groups to graph. For example, ALD passes `[['Chuck Temperature (C)', 'Precursor Temperature (C)']]` — meaning "one graph containing both of those columns plotted over time." Most machines pass an empty list, meaning "no graphs, just the table."

A few of them (Parylene, Denton 635) instead call `render_log_files('Paralyne', 'uploads')` because they produce per-run log files rather than (or in addition to) a summary CSV.

### The two helpers

#### `render_machine_data` — generic CSV viewer

```python
def render_machine_data(machine, graph_columns):
    """Helper to render machine data page"""
    data_dir = current_app.config['DATA_DIR']
    csv_file = os.path.join(data_dir, f'small_{machine}_DataCollection.csv')

    html_table = data_service.csv_to_html_table(csv_file)

    graphs = []
    for cols in graph_columns:
        graph_data = data_service.prepare_graph_data(csv_file, cols if isinstance(cols, list) else [cols])
        graphs.append(graph_data)

    return render_template('machine_data.html',
                         machine=machine,
                         table_html=html_table,
                         graphs=graphs)
```

- Find the CSV for this machine.
- Convert it to an HTML table.
- For each group of columns to graph, build the Chart.js data.
- Render the generic `machine_data.html` template with that info.

#### `render_log_files` — log-file browser

```python
def render_log_files(machine, datatype):
    """Helper to render log files page"""
    log_dir = current_app.config['LOG_DATA_DIR']
    directory_path = os.path.join(log_dir, machine, datatype)

    files = []
    date_format = 2 if machine == 'Denton635' else (1 if machine == 'Paralyne' else 0)

    if os.path.exists(directory_path):
        all_files = os.listdir(directory_path)
        files = data_service.sort_files_by_time(all_files, date_format)

    return render_template('log_files.html',
                         machine=machine,
                         datatype=datatype,
                         files=files)
```

- Look in `LogData/<machine>/<datatype>/`.
- Different machines name their log files differently; the `date_format` variable picks the right parser (0 = `MM_DD_YYYY_HH-MM AM`, 1 = `YYYYMMDDHHMMSS`, 2 = an embedded date in a `.dat` filename).
- List the directory, sort by parsed time, render.

### Log-file routes

```python
@machines_bp.route('/aldlog/rfdata')
@login_required
def ald_rf_data():
    """Display ALD RF log data"""
    return render_log_files('ALD', 'RF')


@machines_bp.route('/aldlog/pressuredata')
@login_required
def ald_pressure_data():
    """Display ALD pressure log data"""
    return render_log_files('ALD', 'Pressure')


@machines_bp.route('/paralyneuploads')
@login_required
def parylene_uploads():
    """Display Parylene uploads"""
    return render_log_files('Paralyne', 'uploads')
```

Three more entry points into the generic log browser.

### `/download/<path>` — safe download

```python
@machines_bp.route('/download/<path:filepath>')
@login_required
def download_file(filepath):
    """Download a file"""
    filepath = unquote(filepath)

    log_dir = os.path.realpath(current_app.config['LOG_DATA_DIR'])

    # Handle Desktop/Logs paths (legacy mapping)
    if 'Desktop/Logs/' in filepath:
        relative_path = filepath.split('Desktop/Logs/')[1]
        actual_path = os.path.realpath(os.path.join(log_dir, relative_path))
    else:
        actual_path = os.path.realpath(filepath)

    # Ensure resolved path is within the data directory
    if not actual_path.startswith(log_dir + os.sep):
        return jsonify({'error': 'Access denied'}), 403

    if os.path.isfile(actual_path):
        return send_file(actual_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404
```

This is the path-traversal-safe download endpoint, and it's worth reading carefully because the security is in the details.

- **`filepath = unquote(filepath)`** — turn `%20` back into spaces, etc.
- **`log_dir = os.path.realpath(...)`** — resolve symlinks to a canonical path. This is important: if `LOG_DATA_DIR` were a symlink, we want to compare against the real underlying path.
- **Legacy mapping for `Desktop/Logs/...`** — older PowerShell transfer scripts hard-coded the Windows path `Desktop/Logs/`. The endpoint accepts those URLs and strips off the prefix.
- **`actual_path = os.path.realpath(filepath)`** — resolve the resulting path, again following symlinks. If the path is relative, it's resolved against the process's working directory.
- **`if not actual_path.startswith(log_dir + os.sep):`** — the gatekeeper. After resolution, the resulting path must lie strictly *inside* the log directory. If the user sneaks a `../../etc/passwd` in, `realpath` resolves it to `/etc/passwd`, which doesn't start with `LOG_DATA_DIR/`, and we return 403.
- **`send_file(actual_path, as_attachment=True)`** — Flask sets the `Content-Disposition: attachment` header so the browser downloads rather than displaying inline.

Path traversal is the most common file-server vulnerability; this implementation handles it correctly using `realpath` + prefix check.

### `/graph/<path>` — visualize a log file

```python
@machines_bp.route('/graph/<path:filepath>')
@login_required
def graph_file(filepath):
    """Graph a log file"""
    filepath = unquote(filepath)

    log_dir = os.path.realpath(current_app.config['LOG_DATA_DIR'])
    actual_path = os.path.realpath(filepath)

    # Ensure resolved path is within the data directory
    if not actual_path.startswith(log_dir + os.sep):
        return jsonify({'error': 'Access denied'}), 403

    parts = filepath.split(os.sep)

    try:
        graph_data = []
        if len(parts) > 2 and parts[1] == 'ALD':
            if parts[2] == 'RF':
                graph_data = [['For Pwr (W) ', 'Refl Pwr (W)']]
            elif parts[2] == 'Pressure':
                graph_data = [['Pressure ']]
        elif len(parts) > 2 and parts[1] == 'Paralyne' and parts[2] == 'analog':
            graph_data = [['Vacuum pressure']]

        data = data_service.prepare_graph_data(actual_path, graph_data[0] if graph_data else [])
        return render_template('graph.html', graph_data=json.dumps(data))
    except Exception as e:
        current_app.logger.error(f"Error graphing file: {e}")
        return jsonify({'error': str(e)}), 400
```

Same path-safety check as `/download`, then a switch over the URL parts to decide which columns to graph:

- `.../ALD/RF/...` → plot "For Pwr (W)" and "Refl Pwr (W)".
- `.../ALD/Pressure/...` → plot "Pressure".
- `.../Paralyne/analog/...` → plot "Vacuum pressure".

The chosen columns flow into `data_service.prepare_graph_data`, which knows how to extract them from CSV or TXT.

The rendered template `graph.html` loads Chart.js client-side and feeds in the JSON-encoded data.

### `/submitALDData` — ALD deposition-rate calculator

```python
@machines_bp.route('/submitALDData', methods=['POST'])
@login_required
def submit_ald_data():
    """Submit ALD data for graphing"""
    material = request.form.get('material')
    depmode = request.form.get('depmode')
    chuck_temp = request.form.get('temp')

    depo_rates = data_service.calculate_ald_deposition_rate(material, depmode, chuck_temp)

    if depo_rates:
        labels = list(range(1, len(depo_rates) + 1))
        graph_data = {
            'labels': labels,
            'datasets': [{
                'label': 'Deposition Rate (nm/cycle)',
                'data': depo_rates,
                'borderColor': 'rgba(75, 192, 192, 1)',
                'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                'fill': False
            }]
        }
        return render_template('ald_graph.html', graph_data=json.dumps(graph_data))
    else:
        return jsonify({'error': 'Data not found'}), 404
```

A custom form-driven calculator: the user picks a material + deposition mode + chuck temperature, and the service filters the ALD CSV for matching runs and computes deposition rate = thickness ÷ cycles. The result is rendered as a Chart.js bar.

## The service — `data_service.py`

A collection of plain functions that read files and shape data.

### CSV → HTML table

```python
def csv_to_html_table(csv_file):
    """Convert CSV file to HTML table"""
    html_output = "<table id='sortableTable' border='1'>"

    with open(csv_file, newline='') as f:
        reader = csv.reader(f)
        header_row = next(reader)
        html_output += "<thead><tr>" + "".join(f"<th>{cell}</th>" for cell in header_row) + "</tr></thead><tbody>"

        for row in reader:
            html_output += "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"

    html_output += "</tbody></table>"
    return html_output
```

A by-hand CSV-to-HTML conversion. The output gets an `id='sortableTable'`, which the front-end's `tablesort.js` recognizes to enable column sorting.

Note: this does **not** escape HTML special characters in cell values. If a CSV cell contained `<script>...</script>`, that would render as actual script. Since the CSVs are produced by trusted machine software, this is okay in practice — but it's a known sharp edge worth flagging.

### CSV/TXT → Chart.js data

```python
def prepare_graph_data(file_path, y_axes):
    """Prepare data for graphing from CSV or TXT file"""
    _, file_extension = os.path.splitext(file_path)

    if file_extension.lower() == '.csv':
        return graph_csv(file_path, y_axes)
    elif file_extension.lower() == '.txt':
        return graph_txt(file_path, y_axes)
    else:
        raise ValueError("Unsupported file type")
```

A dispatcher: read CSV with `csv.DictReader`, or TXT with manual tab-splitting.

```python
def graph_csv(csv_file, y_axes):
    """Convert CSV data to graph format"""
    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        run = []
        data = {y_axis: [] for y_axis in y_axes}

        for row in reader:
            run.append(row[reader.fieldnames[0]])
            for y_axis in y_axes:
                try:
                    data[y_axis].append(float(row[y_axis]))
                except (ValueError, KeyError) as e:
                    current_app.logger.warning(f"Error converting {y_axis} value: {e}")
                    data[y_axis].append(0)

        return create_graph_data(run, data, y_axes)


def graph_txt(txt_file, y_axes):
    """Convert TXT data to graph format"""
    with open(txt_file, 'r') as file:
        lines = file.readlines()
        headers = lines[0].strip().split('\t')
        run = []
        data = {y_axis: [] for y_axis in y_axes}

        for line in lines[1:]:
            values = line.strip().split('\t')
            row = dict(zip(headers, values))
            run.append(row[headers[0]])

            for y_axis in y_axes:
                try:
                    data[y_axis].append(float(row[y_axis]))
                except (ValueError, KeyError) as e:
                    current_app.logger.warning(f"Error converting {y_axis} value: {e}")
                    data[y_axis].append(0)

        return create_graph_data(run, data, y_axes)
```

Both functions:

- Treat the first column as the x-axis labels (run numbers, timestamps, whatever it happens to be).
- Build one list of y-values per requested y-axis column.
- Fall back to `0` on missing/garbage values, with a warning logged.

Then `create_graph_data` packages everything into the JSON shape Chart.js expects:

```python
def create_graph_data(labels, data, y_axes):
    """Create graph data structure for Chart.js"""
    try:
        return {
            'labels': labels,
            'datasets': [
                {
                    'label': f'{y_axis} over Time',
                    'data': data[y_axis],
                    'borderColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
                    'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.2)',
                } for y_axis in y_axes
            ]
        }
    except Exception as e:
        current_app.logger.error(f"Error creating graph data: {e}")
        return {}
```

The `random.randint` calls pick a random color for each line. Charts will have different colors every refresh — fun visually, mildly less helpful for compare-runs use cases.

### Sorting log files by their embedded timestamps

```python
def sort_files_by_time(files, date_format):
    """Sort files by timestamp extracted from filename"""
    try:
        file_details = []

        for file in files:
            # Extract run number
            match = re.search(r'Event_Log_Run#(\d+)', file)
            run_number = int(match.group(1)) if match else float('inf')

            # Extract date based on format
            if date_format == 0:
                parts = file.rsplit('_')
                run_date = '_'.join(parts[:4])
                dt = datetime.strptime(run_date, "%m_%d_%Y_%I-%M %p")
            elif date_format == 1:
                parts = file.rsplit('_')
                run_date = '_'.join(parts[:1])
                dt = datetime.strptime(run_date, "%Y%m%d%H%M%S")
            elif date_format == 2:
                date_start_pos = file.find('.dat ')
                if date_start_pos != -1:
                    date_part = file[date_start_pos + 5:]
                    if date_part.endswith('.dat'):
                        date_part = date_part[:-4]
                    date_time_str = date_part.replace('_', ':')
                    dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
                else:
                    dt = datetime.now()
            else:
                dt = datetime.now()

            file_details.append((file, run_number, dt))

        # Sort by run number first, then by date
        sorted_files = sorted(file_details, key=lambda x: (x[1], x[2]), reverse=True)
        return [file for file, _, _ in sorted_files]

    except ValueError:
        return []
```

This function is a small puzzle. Different machines produce filenames in different formats, and the function takes a `date_format` integer to pick the right parser. Then there's an *additional* concept: a "run number" buried in some filenames (`Event_Log_Run#123_...`), which sorts ahead of the date.

The output is the file list sorted newest-first (or by run number first if available), which is how `log_files.html` displays them.

### ALD deposition-rate calculator

```python
def calculate_ald_deposition_rate(material, depmode, chuck_temp):
    """Calculate ALD deposition rate"""
    df = get_machine_data('ALD')
    if df is None:
        return None

    filtered_df = df[
        (df['Film Deposited'] == material) &
        (df['Deposition Mode'] == depmode) &
        (df['Chuck Temperature (C)'] == int(chuck_temp))
    ]

    if not filtered_df.empty:
        filtered_df['Deposition Rate'] = filtered_df['Measured Thickness (nm)'] / filtered_df['Number of Cycles']
        filtered_df['Deposition Rate'] = filtered_df['Deposition Rate'].fillna(0)
        return filtered_df['Deposition Rate'].tolist()

    return None
```

Uses pandas (`get_machine_data` reads the ALD CSV into a DataFrame). Filters down to rows matching the chosen material, deposition mode, and chuck temperature. Computes `thickness / cycles` per row and returns the list. NaNs become 0.

## Recap

This module's responsibility: present machine data and run-logs to logged-in users.

- **Each machine** has a generic page driven by its CSV file under `DATA_DIR`.
- **Tools that produce raw logs** also have a log-file browser, plus a per-file viewer/grapher.
- **Two security guardrails** to know about:
  - All routes are behind `@login_required`.
  - The `/download/<path>` and `/graph/<path>` endpoints validate that the resolved real path is inside `LOG_DATA_DIR` before serving — no path traversal.

Everything machine-related visible to users flows through this blueprint plus `data_service`.

Next: `08-IoT-API-Endpoints.md`.
