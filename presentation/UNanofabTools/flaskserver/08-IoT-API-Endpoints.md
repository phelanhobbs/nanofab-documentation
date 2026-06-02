# 08 — IoT API Endpoints

The file `app/blueprints/api.py` is the server's "back door" for machines: it accepts data pushed by Raspberry Pi Picos and PCs sitting next to lab equipment, and it serves that data back out to consumers in JSON or CSV form. None of these routes require a login — the clients are devices, not humans. Authenticity here relies on the network being locked down (the Picos sit on a private campus SSID), and on the URLs being known only internally.

The endpoints fall into five categories:

| Category | Endpoints | What it does |
|----------|-----------|---------------|
| Parylene SDS analog stream | `/sdsanalog`, `/sdsanalogfinished`, `/api/paralyne/analog/list`, `/api/paralyne/analog/download/<name>` | Accept CSV batches from the Parylene Pi, combine them, expose for download |
| Denton 18 pump | `/denton18pump`, `/denton18pumpfinished` | Record vacuum-pressure samples and finalize the file when a run ends |
| Particle sensors (legacy single-purpose) | `/particle-data` (POST and GET) | Receive SPS30 readings, store latest in DB + history in CSV; retrieve current or historical readings |
| Combined particle+environment sensors | `/sensor-data` (POST and GET) | Receive a combined SPS30 + DHT22 payload, write both to per-sensor CSV and the DB |
| Standalone environmental sensors | `/env-data` (POST and GET) | Receive bare DHT22 temperature/humidity, log to CSV, return historical |

This document walks through them in turn.

## Parylene SDS analog streaming

The Parylene tool has a Raspberry Pi sampling its pressure/vapor/temperature analog lines several times a second. Rather than POST every sample individually, the Pi accumulates rows into CSV "batches" and POSTs each batch with headers identifying it. The server stores each batch as a separate file, then concatenates them at the end of a session.

### POST `/sdsanalog`

```python
@api_bp.route('/sdsanalog', methods=['POST'])
def sds_analog():
    """Handle SDS analog data from Raspberry Pi (Parylene machine)"""
    content_type = request.headers.get('Content-Type', '')

    if content_type == 'text/csv':
        return handle_csv_batch()
    else:
        return jsonify({'status': 'error', 'message': 'Unsupported content type'}), 400
```

A tiny dispatcher: only accepts `Content-Type: text/csv`. Calls the heavy helper `handle_csv_batch()`.

### `handle_csv_batch()`

```python
def handle_csv_batch():
    """Handle CSV batch data from Raspberry Pi"""
    try:
        csv_content = request.data.decode('utf-8')

        # Get batch information from headers
        session_id = request.headers.get('X-Session-ID')
        batch_number = request.headers.get('X-Batch-Number')
        total_batches = request.headers.get('X-Total-Batches')
        is_final_batch = request.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'

        if not session_id or not batch_number or not total_batches:
            return jsonify({'status': 'error', 'message': 'Missing headers'}), 400

        batch_number = int(batch_number)
        total_batches = int(total_batches)

        # Write directly to disk
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
        os.makedirs(temp_dir, exist_ok=True)

        batch_file = os.path.join(temp_dir, f'batch_{batch_number:04d}.csv')
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
        if not os.path.exists(start_time_file):
            with open(start_time_file, 'w') as f:
                f.write(datetime.now().strftime('%Y%m%d%H%M%S'))

        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(csv_content)

        # Check if all batches received
        received_batches = len([f for f in os.listdir(temp_dir) if f.startswith('batch_')])

        if received_batches == total_batches or is_final_batch:
            current_app.logger.info(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
            combine_csv_batches_final(session_id, cleanup=False)

        return jsonify({
            'status': 'success',
            'message': f'Batch {batch_number}/{total_batches} received',
            'session_id': session_id
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error processing CSV batch: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

A handful of important details:

- **Three required headers** identify the batch: `X-Session-ID` (random ID for this run), `X-Batch-Number`, `X-Total-Batches`. Optional `X-Is-Final-Batch` short-circuits the count check if the Pi knows the run is done.
- Each session gets its own temp folder under `LogData/Paralyne/temp/<session>/`.
- The first batch also writes `start_time.txt` — this is the timestamp used in the eventual combined filename.
- Each batch is stored as `batch_NNNN.csv` with a 4-digit zero-padded number so simple lexicographic sort gives chronological order.
- After writing, the server counts files; if we've received every batch (or the Pi flagged this as the final batch), it kicks off `combine_csv_batches_final`.

### POST `/sdsanalogfinished`

```python
@api_bp.route('/sdsanalogfinished', methods=['POST'])
def sds_analog_finished():
    """Handle session finalization and combine all batches"""
    try:
        # Get session ID from request
        if request.content_length and request.content_length > 0:
            data = request.get_json()
            session_id = data.get('session_id') if data else None
        else:
            session_id = None

        if not session_id:
            session_id = request.headers.get('X-Session-ID')

        current_app.logger.info(f"Finalizing session: {session_id}")

        if session_id:
            current_app.logger.info(f"Finalizing session: {session_id}")
            combine_csv_batches_final(session_id)
            message = f"Session {session_id} finalized"
        else:
            message = "No session ID provided"

        return jsonify({'status': 'session_finalized', 'message': message}), 200
    ...
```

An explicit "we're done, please combine now" trigger. It accepts the session ID either in a JSON body or in the `X-Session-ID` header — whichever the Pi sends.

### `combine_csv_batches_final`

```python
def combine_csv_batches_final(session_id, cleanup=True):
    """Combine all CSV batches for a session from disk"""
    try:
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
        if not os.path.exists(temp_dir):
            return

        batches = sorted([f for f in os.listdir(temp_dir) if f.startswith('batch_')])

        if not batches:
            return

        # Determine timestamp
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
        if os.path.exists(start_time_file):
            with open(start_time_file, 'r') as f:
                timestamp = f.read().strip()
        else:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

        # Create combined filename
        combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
        combined_filepath = os.path.join(
            current_app.config['LOG_DATA_DIR'],
            'Paralyne',
            'analog',
            combined_filename
        )

        os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)

        # Write combined file
        with open(combined_filepath, 'w', newline='', encoding='utf-8') as combined_file:
            combined_file.write("timestamp,pressure,vapor,temp\n")

            for batch_filename in batches:
                batch_filepath = os.path.join(temp_dir, batch_filename)
                with open(batch_filepath, 'r', encoding='utf-8') as f:
                    batch_content = f.read()

                lines = batch_content.strip().split('\n')

                # Skip header if present
                if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
                    lines = lines[1:]

                for line in lines:
                    if line.strip():
                        combined_file.write(line.strip() + '\n')

        current_app.logger.info(f"Combined CSV created: {combined_filepath}")

        # Clean up if requested
        if cleanup and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

    except Exception as e:
        current_app.logger.error(f"Error combining CSV batches: {e}")
```

Step by step:

1. Find the session's temp folder.
2. List the batch files (already named so they sort chronologically).
3. Read the start time from `start_time.txt`.
4. Construct the final filename `<timestamp>_SDSLOG_combined_<session_id>.csv`.
5. Write a single combined CSV: header row first, then every batch's contents minus its own header.
6. Optionally delete the temp folder.

This means a finished Parylene run shows up as one neat CSV in `LogData/Paralyne/analog/`, which the log-file browser (covered in `07`) can list and graph.

### GET `/api/paralyne/analog/list` and `/api/paralyne/analog/download/<name>`

```python
@api_bp.route('/api/paralyne/analog/list', methods=['GET'])
def list_paralyne_files():
    """List Parylene analog files (unauthenticated endpoint)"""
    ...
    files = [f for f in os.listdir(directory_path) if f.endswith('.csv')]

    file_info = []
    for file in files:
        file_path = os.path.join(directory_path, file)
        stat = os.stat(file_path)
        file_info.append({
            'filename': file,
            'size': stat.st_size,
            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'download_url': f'/api/paralyne/analog/download/{file}'
        })

    file_info.sort(key=lambda x: x['modified'], reverse=True)
    ...
```

```python
@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])
def download_paralyne_file(filename):
    """Download a Parylene analog file (unauthenticated endpoint)"""
    if '..' in filename or '/' in filename or '\\' in filename:
        return jsonify({'error': 'Invalid filename'}), 400
    if not filename.endswith('.csv'):
        return jsonify({'error': 'File not found'}), 404
    ...
    return send_from_directory(directory_path, filename, as_attachment=True)
```

Two simple endpoints used by the NanofabToolkit `ParalyneReader` desktop app:

- `list` returns a JSON array of every combined CSV in the analog folder, with size and modified time.
- `download/<filename>` returns the file. The route uses `<filename>` (no path separator allowed by Flask's default converter), and additionally rejects any filename containing `..`, `/`, or `\` to prevent traversal. Only `.csv` files are served.

## Denton 18 vacuum pump logging

The Denton 18 evaporator's Pi posts pressure samples (a raw ADC reading, which the server converts to pressure) one at a time. Multiple samples accumulate in a single file across a session.

### POST `/denton18pump`

```python
@api_bp.route('/denton18pump', methods=['POST'])
def denton18_pump():
    """Handle Denton 18 pump data from Raspberry Pi"""
    try:
        data = request.get_json()
        pressure_val = data.get('pressure')

        state_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata')
        os.makedirs(state_dir, exist_ok=True)
        state_file = os.path.join(state_dir, 'current_run.txt')

        if os.path.exists(state_file):
            with open(state_file, 'r') as f:
                denton18_log_file_location = f.read().strip()
        else:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"{timestamp}_DENTON18PUMPLOG.csv"
            denton18_log_file_location = os.path.join(state_dir, filename)

            with open(state_file, 'w') as f:
                f.write(denton18_log_file_location)

            with open(denton18_log_file_location, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['Timestamp', 'Vacuum pressure'])

        # Write data
        running_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pressure_val = pressure_val / 65535.0 * 3.3 * 3.0 / 0.009

        with open(denton18_log_file_location, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([running_timestamp, pressure_val])

        return jsonify({'status': 'success'}), 200

    except Exception as e:
        current_app.logger.error(f"Error processing Denton18 pump data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

The interesting bits:

- **`current_run.txt` is a sentinel file** indicating "we're in the middle of a run; here's the CSV path." If it exists, append to that CSV; if not, create a new timestamped CSV and write the header row, and record its path in `current_run.txt`.
- **The pressure conversion** is `raw / 65535 * 3.3 * 3.0 / 0.009`. Decoded: the Pico has a 16-bit ADC (max value 65535) reading a 0–3.3V analog input. The probe is on a 3× divider (× 3.0) and outputs 9 mV per unit pressure (÷ 0.009). The result is the actual pressure value.
- Each sample is appended to the same CSV until `denton18pumpfinished` is called.

### POST `/denton18pumpfinished`

```python
@api_bp.route('/denton18pumpfinished', methods=['POST'])
def denton18_pump_finished():
    """Handle Denton 18 pump data completion"""
    state_file = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata', 'current_run.txt')
    if os.path.exists(state_file):
        os.remove(state_file)
        return jsonify({'status': 'file closed'}), 200
    else:
        return jsonify({'status': 'no file to close'}), 400
```

Just deletes `current_run.txt`. The next pressure sample will create a new CSV.

## Particle sensors

Particles in cleanroom air are tracked by Sensirion SPS30 sensors wired to Raspberry Pi Picos sitting in various rooms. Each Pico:

- Reads the SPS30 every ~minute.
- Builds a JSON payload with raw mass concentrations + converted number concentrations (per ft³).
- POSTs it to the server.

### Helper: log to per-sensor CSV

```python
def log_historical_particle_data(room_name, sensor_number, timestamp, raw_measurements, converted_values):
    """Log particle sensor data to CSV file for historical tracking"""
    try:
        # Create sensor-specific filename
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filename = f"{sensor_id}_historical.csv"
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)

        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # Check if file exists to determine if we need to write headers
        file_exists = os.path.exists(filepath)

        with open(filepath, 'a', newline='') as f:
            writer = csv.writer(f)

            # Write headers if file is new
            if not file_exists:
                headers = [
                    'timestamp', 'timestamp_iso', 'room_name', 'sensor_number',
                    'mass_pm1', 'mass_pm2_5', 'mass_pm4', 'mass_pm10',
                    'num_pm0_5_ft3', 'num_pm1_ft3', 'num_pm2_5_ft3', 'num_pm4_ft3', 'num_pm10_ft3',
                    'typical_particle_size_um',
                    'num_pm0_5_ft3_dup', 'num_pm1_ft3_dup', 'num_pm2_5_ft3_dup', 'num_pm4_ft3_dup', 'num_pm10_ft3_dup',
                    'bin_0_3_to_0_5', 'bin_0_5_to_1_0', 'bin_1_0_to_2_5', 'bin_2_5_to_4_0', 'bin_4_0_to_10',
                    'mass_pm1_ug_m3', 'mass_pm2_5_ug_m3', 'mass_pm4_ug_m3', 'mass_pm10_ug_m3'
                ]
                writer.writerow(headers)

            # Extract data with defaults
            number_concentrations = converted_values.get('number_concentrations_ft3', {})
            differential_bins = converted_values.get('differential_bins_ft3', {})
            mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})

            # Write data row
            row_data = [
                timestamp.timestamp(),  # Unix timestamp
                timestamp.isoformat(),  # ISO format timestamp
                room_name, sensor_number,
                raw_measurements.get('mass_pm1'),
                ...
```

(Truncated — the full function packs every metric into one row.)

The key design choice: **one CSV per sensor**, named `<room>_<sensor>_historical.csv`. The first POST creates the file with a header row; subsequent POSTs just append. This makes "show me the history of this sensor" a simple file read.

The header set includes some duplicate columns (`num_pm0_5_ft3` and `num_pm0_5_ft3_dup`) — a backwards-compatibility quirk: legacy consumers expected the raw cm³ counts in one set of columns and the ft³ counts in another, but since the unconverted raw counts looked unrealistic, both were replaced with the ft³ values.

### POST `/particle-data`

```python
@api_bp.route('/particle-data', methods=['POST'])
def receive_particle_data():
    """Receive particle sensor data from Pico sensors and store the most recent values"""
    try:
        # Get JSON data from request
        if not request.is_json:
            return jsonify({...}), 400

        data = request.get_json()

        # Validate required fields
        required_fields = ['room_name', 'sensor_number', 'timestamp']
        for field in required_fields:
            if field not in data:
                return jsonify({...}), 400

        # Extract room name and sensor number
        room_name = data['room_name']
        sensor_number = data['sensor_number']

        # Parse timestamp (could be Unix timestamp or ISO string)
        timestamp_value = data['timestamp']
        if isinstance(timestamp_value, (int, float)):
            sensor_timestamp = datetime.fromtimestamp(timestamp_value)
        else:
            try:
                sensor_timestamp = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
            except:
                sensor_timestamp = datetime.utcnow()
```

Pre-flight checks:

- Must be JSON.
- Must have `room_name`, `sensor_number`, `timestamp`.
- Timestamp can come in as a number (Unix seconds) or an ISO 8601 string; both are parsed.

```python
        # Extract measurement data with defaults
        raw_measurements = data.get('raw_measurements', {})
        converted_values = data.get('converted_values', {})
        number_concentrations = converted_values.get('number_concentrations_ft3', {})
        differential_bins = converted_values.get('differential_bins_ft3', {})
        mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})

        # CSV Historical Data Logging
        log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
                                   raw_measurements, converted_values)
```

Pull the nested dictionaries with safe defaults, then log to CSV.

```python
        # Check if we already have data for this sensor
        existing_record = ParticleSensorData.query.filter_by(
            room_name=room_name,
            sensor_number=sensor_number
        ).first()

        if existing_record:
            # Update existing record
            existing_record.timestamp = sensor_timestamp
            existing_record.last_updated = datetime.utcnow()
            ...all field assignments...
        else:
            # Create new record
            new_record = ParticleSensorData(...)
            db.session.add(new_record)

        db.session.commit()
```

The database table `particle_sensor_data` only stores the **latest** reading per (room, sensor) pair — there's a unique constraint enforcing one row per sensor location. Old readings are only preserved in the per-sensor historical CSV.

This is an "upsert": if a row for this (room, sensor) exists, update it in place; otherwise insert. The historical CSV is the source of truth for time series; the DB is just for "show me what's happening right now."

### GET `/particle-data`

```python
@api_bp.route('/particle-data', methods=['GET'])
def get_particle_data():
    """Get current particle sensor data for all sensors or a specific sensor.
    If both room_name and sensor_number are provided, returns historical CSV data."""
    try:
        # Optional query parameters
        room_name = request.args.get('room_name')
        sensor_number = request.args.get('sensor_number')

        # If both room_name and sensor_number are provided, return historical CSV data
        if room_name and sensor_number:
            return get_historical_csv_data(room_name, sensor_number)

        # Build query for current data
        query = ParticleSensorData.query

        if room_name:
            query = query.filter_by(room_name=room_name)

        if sensor_number:
            query = query.filter_by(sensor_number=sensor_number)

        # Get results
        sensors = query.all()

        # Convert to JSON-serializable format
        sensor_data = [sensor.to_dict() for sensor in sensors]

        return jsonify({
            'status': 'success',
            'count': len(sensor_data),
            'sensors': sensor_data
        }), 200
        ...
```

Three behaviors depending on the query string:

- **No params** → return every sensor's current reading.
- **Only `room_name`** → all sensors in that room.
- **Only `sensor_number`** → all sensors with that number (across rooms).
- **Both** → switch to historical CSV mode and return the full time series.

This "one URL, multiple shapes" is unusual; a separate `/particle-data/history` endpoint would be cleaner. As it stands, the consumer must remember which query keys trigger which response shape.

```python
def get_historical_csv_data(room_name, sensor_number):
    """Return historical CSV data for a specific sensor"""
    try:
        # Construct the CSV filename
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filename = f"{sensor_id}_historical.csv"
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)

        # Check if file exists
        if not os.path.exists(filepath):
            return jsonify({...}), 404

        # Read and parse CSV file
        historical_data = []
        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert numeric values from strings
                processed_row = {}
                for key, value in row.items():
                    if value == '' or value is None:
                        processed_row[key] = None
                    elif key in ['timestamp', 'timestamp_iso', 'room_name', 'sensor_number']:
                        processed_row[key] = value
                    else:
                        try:
                            processed_row[key] = float(value)
                        except (ValueError, TypeError):
                            processed_row[key] = value
                historical_data.append(processed_row)

        return jsonify({
            'status': 'success',
            'room_name': room_name,
            'sensor_number': sensor_number,
            'data_source': 'historical_csv',
            'record_count': len(historical_data),
            'historical_data': historical_data
        }), 200
```

Reads the per-sensor CSV, parses every numeric column to `float`, returns a JSON array. Empty cells become `None`.

## Combined particle + environment endpoint: `/sensor-data`

Newer Picos report both SPS30 particle data and DHT22 temperature/humidity data in a single payload. The `/sensor-data` route accepts that combined shape.

### POST `/sensor-data`

```python
@api_bp.route('/sensor-data', methods=['POST'])
def sensor_data_post():
    """Accept combined particle + environmental sensor data and append to CSV."""
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'No JSON body'}), 400

        room_name = data.get('room_name')
        sensor_number = data.get('sensor_number')
        if not room_name or not sensor_number:
            return jsonify({'error': 'room_name and sensor_number required'}), 400

        # Timestamp — accept from device or default to server time
        timestamp = data.get('timestamp')
        if timestamp:
            ts_str = datetime.fromtimestamp(float(timestamp)).strftime('%Y-%m-%d %H:%M:%S')
        else:
            ts_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Environmental values (may be absent if DHT22 read failed)
        temperature_c = data.get('temperature_c', '')
        humidity_pct = data.get('humidity_pct', '')

        # Particle values (nested dicts from the Pico)
        raw = data.get('raw_measurements', {})
        converted = data.get('converted_values', {})
        conc_ft3 = converted.get('number_concentrations_ft3', {})
        ...
```

The function does **three** writes:

1. **`log_historical_particle_data`** if `raw` is non-empty — writes to the same per-sensor `particle_sensors/` CSV that the legacy endpoint uses, so the GUI's "historical" lookup keeps working.
2. **A dedicated environmental CSV** under `env_sensors/<sensor_id>_historical.csv` if both temperature and humidity were present.
3. **An upsert into `ParticleSensorData`** if `raw` is non-empty, just like `/particle-data` does, including the new `temperature_c` and `humidity_pct` columns added to that table.

The decoupling here is intentional: a Pico that fails to read the DHT22 still gets its particle readings recorded; a Pico without an SPS30 (or with one that's broken) still gets its env data recorded.

### GET `/sensor-data`

```python
@api_bp.route('/sensor-data', methods=['GET'])
def sensor_data_get():
    """Return historical combined sensor data as JSON.
    Query params: room_name, sensor_number (both required)."""
    room_name = request.args.get('room_name')
    sensor_number = request.args.get('sensor_number')

    if not room_name or not sensor_number:
        return jsonify({'error': 'room_name and sensor_number query params required'}), 400

    csv_path = _sensor_csv_path(room_name, sensor_number)

    if not os.path.exists(csv_path):
        return jsonify({'error': 'No data found for this sensor'}), 404

    try:
        rows = []
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)

        return jsonify({...rows...})
```

Reads `sensors/<room>_<sensor>_combined.csv` (note: a different directory from `particle_sensors/`). Returns the full history as a JSON array, with values still as strings.

> **Heads-up — a latent bug.** The GET reads from `LogData/sensors/` (via the `_sensor_csv_path` helper), but the matching `POST /sensor-data` handler never writes to that folder — it writes particle data to `particle_sensors/` and environmental data to `env_sensors/`. Nothing in the codebase populates `sensors/`. As a result, `GET /sensor-data` will return a 404 ("No data found for this sensor") for every sensor, even ones that have posted data. The historical data does exist — it's just under `particle_sensors/` and `env_sensors/`, reachable via `GET /particle-data?...` and `GET /env-data?...`. If you want `GET /sensor-data` to work, either point `_sensor_csv_path` at `particle_sensors/`, or have the POST also write a combined CSV to `sensors/`. This is worth flagging in the presentation as a known rough edge.

## Standalone environmental endpoint: `/env-data`

For Picos that only have a DHT22 (no SPS30), there's a dedicated environmental endpoint.

### POST `/env-data`

```python
@api_bp.route('/env-data', methods=['POST'])
def receive_env_data():
    """Receive temperature/humidity data from DHT22 sensors on Pico W."""
    try:
        if not request.is_json:
            return jsonify({...}), 400

        data = request.get_json()

        for field in ('room_name', 'sensor_number', 'timestamp', 'temperature_c', 'humidity_pct'):
            if field not in data:
                return jsonify({...}), 400

        room_name     = data['room_name']
        sensor_number = data['sensor_number']
        temperature_c = float(data['temperature_c'])
        humidity_pct  = float(data['humidity_pct'])

        ts = data['timestamp']
        if isinstance(ts, (int, float)):
            sensor_timestamp = datetime.fromtimestamp(ts)
        else:
            try:
                sensor_timestamp = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
            except Exception:
                sensor_timestamp = datetime.utcnow()

        # Append to a per-sensor CSV for historical tracking
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
                                 f"{sensor_id}_historical.csv")
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        file_exists = os.path.exists(filepath)
        with open(filepath, 'a', newline='') as f:
            import csv as _csv
            writer = _csv.writer(f)
            if not file_exists:
                writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
                                 'sensor_number', 'temperature_c', 'humidity_pct'])
            writer.writerow([sensor_timestamp.timestamp(), sensor_timestamp.isoformat(),
                             room_name, sensor_number, temperature_c, humidity_pct])

        current_app.logger.info(
            f"env-data: {room_name}/{sensor_number} "
            f"temp={temperature_c:.1f}°C  humidity={humidity_pct:.1f}%"
        )

        return jsonify({...success payload...}), 200
```

Strict validation: all five required fields must be present. The temperature and humidity are coerced to floats (which will raise an exception if the values can't be parsed; the outer try/except catches that).

The historical CSV under `env_sensors/` is appended to, same one used by the combined `/sensor-data` endpoint when DHT22 values were present. Both paths converge on the same file — so a sensor that switches from sending env data via `/env-data` to sending combined data via `/sensor-data` ends up with one continuous CSV.

### GET `/env-data`

Mirror of the GET for `/particle-data` historical mode: reads `env_sensors/<sensor_id>_historical.csv`, converts numeric columns to float, returns as JSON.

## Two summary diagrams

### Where each kind of sensor data ends up

```
Particle POST  →  /particle-data
                ├─ LogData/particle_sensors/<id>_historical.csv  (append)
                └─ particle_sensor_data table                    (upsert latest)

Combined POST  →  /sensor-data
                ├─ LogData/particle_sensors/<id>_historical.csv  (append, if raw present)
                ├─ LogData/env_sensors/<id>_historical.csv       (append, if env present)
                └─ particle_sensor_data table                    (upsert latest)

Env POST       →  /env-data
                └─ LogData/env_sensors/<id>_historical.csv       (append)
```

### Where Parylene and Denton18 data ends up

```
Parylene batches POST  →  /sdsanalog
                          └─ LogData/Paralyne/temp/<session>/batch_NNNN.csv

Parylene done POST     →  /sdsanalogfinished  (or auto-trigger when last batch arrives)
                          └─ LogData/Paralyne/analog/<timestamp>_SDSLOG_combined_<session>.csv
                                                                                    (final combined file)

Denton 18 POST         →  /denton18pump
                          └─ LogData/denton18/pumpdata/<timestamp>_DENTON18PUMPLOG.csv
                                                       (one file per run; sentinel current_run.txt)

Denton 18 done POST    →  /denton18pumpfinished
                          └─ removes current_run.txt; next sample starts a new file
```

## A note on authentication

None of these endpoints are behind `@login_required`. The trust model is:

- The Picos and PCs sit on a private SSID (`ULink`, hard-coded into the firmware).
- The endpoints aren't publicly advertised (they're called only from internal scripts and firmware).
- The data isn't *sensitive* in the cryptographic sense — it's pressure readings and particle counts.

This is "perimeter security" rather than authenticated requests. It's fine for an internal lab tool; it would be unsuitable for anything internet-facing or holding personal data.

Next: `09-Chemical-Inventory.md`.
