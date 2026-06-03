

# Source Reconstruction: UNanofabTools/app/blueprints/api.py

- Repository: `UNanofabTools`
- Relative path: `app/blueprints/api.py`
- Lines read: `921`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `bde102ba33786ded`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import os`, `import csv`, `import json`, `import shutil`, `from datetime import datetime, timedelta`, `from flask import Blueprint, request, jsonify, current_app, send_from_directory`, `from app.models import db, ParticleSensorData`
- Classes: none detected
- Functions: `sds_analog`, `sds_analog_finished`, `denton18_pump`, `denton18_pump_finished`, `list_paralyne_files`, `download_paralyne_file`, `log_historical_particle_data`, `handle_csv_batch`, `combine_csv_batches_final`, `receive_particle_data`, `get_particle_data`, `get_historical_csv_data`, `_sensor_csv_path`, `sensor_data_post`, `sensor_data_get`, `receive_env_data`, `get_env_data`
- Routes: `@api_bp.route('/sdsanalog', methods=['POST'])`, `@api_bp.route('/sdsanalogfinished', methods=['POST'])`, `@api_bp.route('/denton18pump', methods=['POST'])`, `@api_bp.route('/denton18pumpfinished', methods=['POST'])`, `@api_bp.route('/api/paralyne/analog/list', methods=['GET'])`, `@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])`, `@api_bp.route('/particle-data', methods=['POST'])`, `@api_bp.route('/particle-data', methods=['GET'])`, `@api_bp.route('/sensor-data', methods=['POST'])`, `@api_bp.route('/sensor-data', methods=['GET'])`, `@api_bp.route('/env-data', methods=['POST'])`, `@api_bp.route('/env-data', methods=['GET'])`

## Sanitized Source Excerpt

```python
"""
API blueprint for Raspberry Pi data collection endpoints
"""
import os
import csv
import json
import shutil
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from app.models import db, ParticleSensorData

api_bp = Blueprint('api', __name__)

@api_bp.route('/sdsanalog', methods=['POST'])
def sds_analog():
    """Handle SDS analog data from Raspberry Pi (Parylene machine)"""
    content_type = request.headers.get('Content-Type', '')

    if content_type == 'text/csv':
        return handle_csv_batch()
    else:
        return jsonify({'status': 'error', 'message': 'Unsupported content type'}), 400


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

    except Exception as e:
        current_app.logger.error(f"Error finalizing session: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


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


@api_bp.route('/denton18pumpfinished', methods=['POST'])
def denton18_pump_finished():
    """Handle Denton 18 pump data completion"""
    state_file = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata', 'current_run.txt')
    if os.path.exists(state_file):
        os.remove(state_file)
        return jsonify({'status': 'file closed'}), 200
    else:
        return jsonify({'status': 'no file to close'}), 400


@api_bp.route('/api/paralyne/analog/list', methods=['GET'])
def list_paralyne_files():
    """List Parylene analog files (unauthenticated endpoint)"""
    try:
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')

        if not os.path.exists(directory_path):
            return jsonify({'error': 'Directory not found'}), 404

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

        return jsonify({
            'status': 'success',
            'files': file_info,
            'count': len(file_info)
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error listing Parylene files: {e}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])
def download_paralyne_file(filename):
    """Download a Parylene analog file (unauthenticated endpoint)"""
    if '..' in filename or '/' in filename or '\\' in filename:
        return jsonify({'error': 'Invalid filename'}), 400
    if not filename.endswith('.csv'):
        return jsonify({'error': 'File not found'}), 404

    try:
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')
        if not os.path.isfile(os.path.join(directory_path, filename)):
            return jsonify({'error': 'File not found'}), 404
        return send_from_directory(directory_path, filename, as_attachment=True)

    except Exception as e:
        current_app.logger.error(f"Error downloading Parylene file: {e}")
        return jsonify({'error': str(e)}), 500


# Helper functions

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
                    'timestamp',
                    'timestamp_iso',
                    'room_name',
                    'sensor_number',
                    # Raw measurements
                    'mass_pm1',
                    'mass_pm2_5',
                    'mass_pm4',
                    'mass_pm10',
                    'num_pm0_5_ft3',
                    'num_pm1_ft3',
                    'num_pm2_5_ft3',
                    'num_pm4_ft3',
                    'num_pm10_ft3',
                    'typical_particle_size_um',
                    # Number concentrations (ft³) - same data as above for compatibility
                    'num_pm0_5_ft3_dup',
                    'num_pm1_ft3_dup',
                    'num_pm2_5_ft3_dup',
                    'num_pm4_ft3_dup',
                    'num_pm10_ft3_dup',
                    # Differential bins (ft³)
                    'bin_0_3_to_0_5',
                    'bin_0_5_to_1_0',
                    'bin_1_0_to_2_5',
                    'bin_2_5_to_4_0',
                    'bin_4_0_to_10',
                    # Mass concentrations (μg/m³)
                    'mass_pm1_ug_m3',
                    'mass_pm2_5_ug_m3',
                    'mass_pm4_ug_m3',
                    'mass_pm10_ug_m3'
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
                room_name,
                sensor_number,
                # Raw measurements (mass concentrations are kept as they're realistic)
                raw_measurements.get('mass_pm1'),
                raw_measurements.get('mass_pm2_5'),
                raw_measurements.get('mass_pm4'),
                raw_measurements.get('mass_pm10'),
                # Use converted ft³ values instead of unrealistic raw #/cm³ values
                number_concentrations.get('pm0_5'),
                number_concentrations.get('pm1'),
                number_concentrations.get('pm2_5'),
                number_concentrations.get('pm4'),
                number_concentrations.get('pm10'),
                raw_measurements.get('typical_particle_size_um'),
                # Number concentrations (ft³) - same as above for consistency
                number_concentrations.get('pm0_5'),
                number_concentrations.get('pm1'),
                number_concentrations.get('pm2_5'),
                number_concentrations.get('pm4'),
                number_concentrations.get('pm10'),
                # Differential bins (ft³)
                differential_bins.get('bin_0_3_to_0_5'),
                differential_bins.get('bin_0_5_to_1_0'),
                differential_bins.get('bin_1_0_to_2_5'),
                differential_bins.get('bin_2_5_to_4_0'),
                differential_bins.get('bin_4_0_to_10'),
                # Mass concentrations (μg/m³)
                mass_concentrations.get('pm1'),
                mass_concentrations.get('pm2_5'),
                mass_concentrations.get('pm4'),
                mass_concentrations.get('pm10')
            ]
            writer.writerow(row_data)

        current_app.logger.info(f"Logged historical particle data to {filepath}")

    except Exception as e:
        current_app.logger.error(f"Error logging historical particle data: {e}")
        # Don't raise exception - CSV logging failure shouldn't break the main functionality


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


@api_bp.route('/particle-data', methods=['POST'])
def receive_particle_data():
    """Receive particle sensor data from Pico sensors and store the most recent values"""
    try:
        # Get JSON data from request
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Content-Type must be application/json'
            }), 400

        data = request.get_json()

        # Validate required fields
        required_fields = ['room_name', 'sensor_number', 'timestamp']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required field: {field}'
                }), 400

        # Extract room name and sensor number
        room_name = data['room_name']
        sensor_number = data['sensor_number']

        # Parse timestamp (could be Unix timestamp or ISO string)
        timestamp_value = data['timestamp']
        if isinstance(timestamp_value, (int, float)):
            # Unix timestamp
            sensor_timestamp = datetime.fromtimestamp(timestamp_value)
        else:
            # Try to parse ISO string
            try:
                sensor_timestamp = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
            except:
                sensor_timestamp = datetime.utcnow()

        # Extract measurement data with defaults
        raw_measurements = data.get('raw_measurements', {})
        converted_values = data.get('converted_values', {})
        number_concentrations = converted_values.get('number_concentrations_ft3', {})
        differential_bins = converted_values.get('differential_bins_ft3', {})
        mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})

        # CSV Historical Data Logging
        log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
                                   raw_measurements, converted_values)

        # Check if we already have data for this sensor
        existing_record = ParticleSensorData.query.filter_by(
            room_name=room_name,
            sensor_number=sensor_number
        ).first()

        if existing_record:
            # Update existing record
            existing_record.timestamp = sensor_timestamp
            existing_record.last_updated = datetime.utcnow()

            # Update raw measurements
            existing_record.mass_pm1 = raw_measurements.get('mass_pm1')
            existing_record.mass_pm2_5 = raw_measurements.get('mass_pm2_5')
            existing_record.mass_pm4 = raw_measurements.get('mass_pm4')
            existing_record.mass_pm10 = raw_measurements.get('mass_pm10')
            existing_record.num_pm0_5 = raw_measurements.get('num_pm0_5')
            existing_record.num_pm1 = raw_measurements.get('num_pm1')
            existing_record.num_pm2_5 = raw_measurements.get('num_pm2_5')
            existing_record.num_pm4 = raw_measurements.get('num_pm4')
            existing_record.num_pm10 = raw_measurements.get('num_pm10')
            existing_record.typical_particle_size_um = raw_measurements.get('typical_particle_size_um')

            # Update converted values
            existing_record.num_pm0_5_ft3 = number_concentrations.get('pm0_5')
            existing_record.num_pm1_ft3 = number_concentrations.get('pm1')
            existing_record.num_pm2_5_ft3 = number_concentrations.get('pm2_5')
            existing_record.num_pm4_ft3 = number_concentrations.get('pm4')
            existing_record.num_pm10_ft3 = number_concentrations.get('pm10')

            # Update differential bins
            existing_record.bin_0_3_to_0_5 = differential_bins.get('bin_0_3_to_0_5')
            existing_record.bin_0_5_to_1_0 = differential_bins.get('bin_0_5_to_1_0')
            existing_record.bin_1_0_to_2_5 = differential_bins.get('bin_1_0_to_2_5')
            existing_record.bin_2_5_to_4_0 = differential_bins.get('bin_2_5_to_4_0')
            existing_record.bin_4_0_to_10 = differential_bins.get('bin_4_0_to_10')

            # Update mass concentrations
            existing_record.mass_pm1_ug_m3 = mass_concentrations.get('pm1')
            existing_record.mass_pm2_5_ug_m3 = mass_concentrations.get('pm2_5')
            existing_record.mass_pm4_ug_m3 = mass_concentrations.get('pm4')
            existing_record.mass_pm10_ug_m3 = mass_concentrations.get('pm10')

            current_app.logger.info(f"Updated particle data for {room_name}/{sensor_number}")

        else:
            # Create new record
            new_record = ParticleSensorData(
                room_name=room_name,
                sensor_number=sensor_number,
                timestamp=sensor_timestamp,
                last_updated=datetime.utcnow(),

                # Raw measurements
                mass_pm1=raw_measurements.get('mass_pm1'),
                mass_pm2_5=raw_measurements.get('mass_pm2_5'),
                mass_pm4=raw_measurements.get('mass_pm4'),
                mass_pm10=raw_measurements.get('mass_pm10'),
                num_pm0_5=raw_measurements.get('num_pm0_5'),
                num_pm1=raw_measurements.get('num_pm1'),
                num_pm2_5=raw_measurements.get('num_pm2_5'),
                num_pm4=raw_measurements.get('num_pm4'),
                num_pm10=raw_measurements.get('num_pm10'),
                typical_particle_size_um=raw_measurements.get('typical_particle_size_um'),

                # Converted values
                num_pm0_5_ft3=number_concentrations.get('pm0_5'),
                num_pm1_ft3=number_concentrations.get('pm1'),
                num_pm2_5_ft3=number_concentrations.get('pm2_5'),
                num_pm4_ft3=number_concentrations.get('pm4'),
                num_pm10_ft3=number_concentrations.get('pm10'),

                # Differential bins
                bin_0_3_to_0_5=differential_bins.get('bin_0_3_to_0_5'),
                bin_0_5_to_1_0=differential_bins.get('bin_0_5_to_1_0'),
                bin_1_0_to_2_5=differential_bins.get('bin_1_0_to_2_5'),
                bin_2_5_to_4_0=differential_bins.get('bin_2_5_to_4_0'),
                bin_4_0_to_10=differential_bins.get('bin_4_0_to_10'),

                # Mass concentrations
                mass_pm1_ug_m3=mass_concentrations.get('pm1'),
                mass_pm2_5_ug_m3=mass_concentrations.get('pm2_5'),
                mass_pm4_ug_m3=mass_concentrations.get('pm4'),
                mass_pm10_ug_m3=mass_concentrations.get('pm10')
            )

            db.session.add(new_record)
            current_app.logger.info(f"Created new particle data record for {room_name}/{sensor_number}")

        # Commit the changes
        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': f'Particle data received for sensor {sensor_number} in {room_name}',
            'sensor_id': f"{room_name}/{sensor_number}",
            'timestamp': sensor_timestamp.isoformat()
        }), 200

    except Exception as e:
        # Rollback on error
        db.session.rollback()
        current_app.logger.error(f"Error processing particle sensor data: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Error processing data: {str(e)}'
        }), 500


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

    except Exception as e:
        current_app.logger.error(f"Error retrieving particle sensor data: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Error retrieving data: {str(e)}'
        }), 500


def get_historical_csv_data(room_name, sensor_number):
    """Return historical CSV data for a specific sensor"""
    try:
        # Construct the CSV filename
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filename = f"{sensor_id}_historical.csv"
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)

        # Check if file exists
        if not os.path.exists(filepath):
            return jsonify({
                'status': 'error',
                'message': f'No historical data found for sensor {sensor_number} in {room_name}'
            }), 404

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

    except Exception as e:
        current_app.logger.error(f"Error retrieving historical CSV data: {e}")
        return jsonify({
            'status': 'error',
            'message': f'Error reading historical data: {str(e)}'
        }), 500


# ============================================================
# Combined sensor endpoint (SPS30 particle + DHT22 environment)
# ============================================================

SENSOR_CSV_HEADER = (
    "timestamp,temperature_c,humidity_pct,"
    "mass_pm1,mass_pm2_5,mass_pm4,mass_pm10,"
    "num_pm0_5_ft3,num_pm1_ft3,num_pm2_5_ft3,num_pm4_ft3,num_pm10_ft3,"
    "typical_particle_size_um\n"
)


def _sensor_csv_path(room_name, sensor_number):
    """Return the path to the per-sensor combined CSV, creating dirs as needed."""
    sensor_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'sensors')
    os.makedirs(sensor_dir, exist_ok=True)
    safe_name = "{}_{}_combined.csv".format(
        room_name.replace("/", "_"),
        sensor_number.replace("/", "_"),
    )
    return os.path.join(sensor_dir, safe_name)


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

        mass_pm1 = raw.get('mass_pm1', '')
        mass_pm2_5 = raw.get('mass_pm2_5', '')
        mass_pm4 = raw.get('mass_pm4', '')
        mass_pm10 = raw.get('mass_pm10', '')
        num_pm0_5_ft3 = conc_ft3.get('pm0_5', '')
        num_pm1_ft3 = conc_ft3.get('pm1', '')
        num_pm2_5_ft3 = conc_ft3.get('pm2_5', '')
        num_pm4_ft3 = conc_ft3.get('pm4', '')
        num_pm10_ft3 = conc_ft3.get('pm10', '')
        tps_um = raw.get('typical_particle_size_um', '')

        sensor_dt = datetime.fromtimestamp(float(timestamp)) if timestamp else datetime.now()

        # Write to particle_sensors/ so the GUI's historical data lookup works
        if raw:
            log_historical_particle_data(room_name, sensor_number, sensor_dt, raw, converted)

        # Also write to dedicated env CSV when DHT22 data is present
        if temperature_c != '' and humidity_pct != '':
            sensor_id = '{}_{}'.format(
                room_name.replace('/', '_'),
                sensor_number.replace('/', '_'),
            )
            env_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors')
            os.makedirs(env_dir, exist_ok=True)
            env_path = os.path.join(env_dir, '{}_historical.csv'.format(sensor_id))
            env_file_exists = os.path.exists(env_path)
            with open(env_path, 'a', newline='') as ef:
                env_writer = csv.writer(ef)
                if not env_file_exists:
                    env_writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
                                         'sensor_number', 'temperature_c', 'humidity_pct'])
                env_writer.writerow([sensor_dt.timestamp(), sensor_dt.isoformat(),
                                     room_name, sensor_number, temperature_c, humidity_pct])

        # Upsert into ParticleSensorData DB so the GUI can display this sensor
        if raw:
            diff = converted.get('differential_bins_ft3', {})
            mass_conc = converted.get('mass_concentrations_ug_m3', {})

            record = ParticleSensorData.query.filter_by(
                room_name=room_name, sensor_number=sensor_number
            ).first()

            if record:
                record.timestamp = sensor_dt
                record.last_updated = datetime.utcnow()
            else:
                record = ParticleSensorData(
                    room_name=room_name,
                    sensor_number=sensor_number,
                    timestamp=sensor_dt,
                    last_updated=datetime.utcnow(),
                )
                db.session.add(record)

            record.mass_pm1 = raw.get('mass_pm1')
            record.mass_pm2_5 = raw.get('mass_pm2_5')
            record.mass_pm4 = raw.get('mass_pm4')
            record.mass_pm10 = raw.get('mass_pm10')
            record.num_pm0_5 = raw.get('num_pm0_5')
            record.num_pm1 = raw.get('num_pm1')
            record.num_pm2_5 = raw.get('num_pm2_5')
            record.num_pm4 = raw.get('num_pm4')
            record.num_pm10 = raw.get('num_pm10')
            record.typical_particle_size_um = raw.get('typical_particle_size_um')
            record.num_pm0_5_ft3 = conc_ft3.get('pm0_5')
            record.num_pm1_ft3 = conc_ft3.get('pm1')
            record.num_pm2_5_ft3 = conc_ft3.get('pm2_5')
            record.num_pm4_ft3 = conc_ft3.get('pm4')
            record.num_pm10_ft3 = conc_ft3.get('pm10')
            record.bin_0_3_to_0_5 = diff.get('bin_0_3_to_0_5')
            record.bin_0_5_to_1_0 = diff.get('bin_0_5_to_1_0')
            record.bin_1_0_to_2_5 = diff.get('bin_1_0_to_2_5')
            record.bin_2_5_to_4_0 = diff.get('bin_2_5_to_4_0')
            record.bin_4_0_to_10 = diff.get('bin_4_0_to_10')
            record.mass_pm1_ug_m3 = mass_conc.get('pm1')
            record.mass_pm2_5_ug_m3 = mass_conc.get('pm2_5')
            record.mass_pm4_ug_m3 = mass_conc.get('pm4')
            record.mass_pm10_ug_m3 = mass_conc.get('pm10')

            if temperature_c != '':
                try:
                    record.temperature_c = float(temperature_c)
                except (ValueError, TypeError):
                    pass
            if humidity_pct != '':
                try:
                    record.humidity_pct = float(humidity_pct)
                except (ValueError, TypeError):
                    pass

            db.session.commit()

        current_app.logger.info(
            f"Sensor data: {room_name}/{sensor_number} — "
            f"temp={temperature_c} hum={humidity_pct} pm2.5={mass_pm2_5}"
        )

        return jsonify({'status': 'success'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error processing sensor data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


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

        return jsonify({
            'status': 'success',
            'room_name': room_name,
            'sensor_number': sensor_number,
            'count': len(rows),
            'data': rows,
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error reading sensor data: {e}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/env-data', methods=['POST'])
def receive_env_data():
    """Receive temperature/humidity data from DHT22 sensors on Pico W."""
    try:
        if not request.is_json:
            return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 400

        data = request.get_json()

        for field in ('room_name', 'sensor_number', 'timestamp', 'temperature_c', 'humidity_pct'):
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing field: {field}'}), 400

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

        return jsonify({
            'status':        'success',
            'room_name':     room_name,
            'sensor_number': sensor_number,
            'temperature_c': temperature_c,
            'humidity_pct':  humidity_pct,
            'timestamp':     sensor_timestamp.isoformat(),
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error processing env data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@api_bp.route('/env-data', methods=['GET'])
def get_env_data():
    """Return historical CSV data for a temperature/humidity sensor."""
    try:
        room_name     = request.args.get('room_name', '')
        sensor_number = request.args.get('sensor_number', '')

        if not room_name or not sensor_number:
            return jsonify({'status': 'error', 'message': 'room_name and sensor_number required'}), 400

        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
                                 f"{sensor_id}_historical.csv")

        if not os.path.exists(filepath):
            return jsonify({'status': 'error', 'message': 'No data found for this sensor'}), 404

        import csv as _csv
        rows = []
        with open(filepath, 'r') as f:
            for row in _csv.DictReader(f):
                for key in ('temperature_c', 'humidity_pct', 'timestamp'):
                    try:
                        row[key] = float(row[key])
                    except (ValueError, KeyError):
                        pass
                rows.append(row)

        return jsonify({
            'status':        'success',
            'room_name':     room_name,
            'sensor_number': sensor_number,
            'record_count':  len(rows),
            'data':          rows,
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error retrieving env data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 1 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `none` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
API blueprint for Raspberry Pi data collection endpoints
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 2 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 3 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
import os
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 4 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
import csv
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
import json
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 6 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
import shutil
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 7 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
from datetime import datetime, timedelta
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 8 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
from flask import Blueprint, request, jsonify, current_app, send_from_directory
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 9 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
from app.models import db, ParticleSensorData
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 10 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
api_bp = Blueprint('api', __name__)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 12 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
@api_bp.route('/sdsanalog', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 14 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
def sds_analog():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 15 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    """Handle SDS analog data from Raspberry Pi (Parylene machine)"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 16 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    content_type = request.headers.get('Content-Type', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 17 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 18 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    if content_type == 'text/csv':
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 19 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
        return handle_csv_batch()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 20 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
    else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 21 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `return` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
        return jsonify({'status': 'error', 'message': 'Unsupported content type'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 22 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 24 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
@api_bp.route('/sdsanalogfinished', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 25 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
def sds_analog_finished():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 26 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    """Handle session finalization and combine all batches"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 27 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 28 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        # Get session ID from request
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 29 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
        if request.content_length and request.content_length > 0:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 30 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
            data = request.get_json()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 31 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
            session_id = data.get('session_id') if data else None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 32 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 33 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
            session_id = None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 34 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 35 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        if not session_id:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 36 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
            session_id = request.headers.get('X-Session-ID')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 37 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        current_app.logger.info(f"Finalizing session: {session_id}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 39 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        if session_id:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 41 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
            current_app.logger.info(f"Finalizing session: {session_id}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 42 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
            combine_csv_batches_final(session_id)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 43 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            message = f"Session {session_id} finalized"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 44 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 45 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            message = "No session ID provided"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 46 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 47 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        return jsonify({'status': 'session_finalized', 'message': message}), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 48 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 50 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
        current_app.logger.error(f"Error finalizing session: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 51 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 52 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 53 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 54 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
@api_bp.route('/denton18pump', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 55 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
def denton18_pump():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 56 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    """Handle Denton 18 pump data from Raspberry Pi"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 57 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 58 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
        data = request.get_json()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 59 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
        pressure_val = data.get('pressure')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 60 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 61 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        state_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 62 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
        os.makedirs(state_dir, exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 63 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        state_file = os.path.join(state_dir, 'current_run.txt')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 64 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 65 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        if os.path.exists(state_file):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 66 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
            with open(state_file, 'r') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 67 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
                denton18_log_file_location = f.read().strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 68 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 69 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 70 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
            filename = f"{timestamp}_DENTON18PUMPLOG.csv"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 71 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
            denton18_log_file_location = os.path.join(state_dir, filename)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 72 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 73 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
            with open(state_file, 'w') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 74 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
                f.write(denton18_log_file_location)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 75 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 76 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
            with open(denton18_log_file_location, 'w', newline='') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 77 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
                writer = csv.writer(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 78 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
                writer.writerow(['Timestamp', 'Vacuum pressure'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 79 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 80 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
        # Write data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 81 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
        running_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 82 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
        pressure_val = pressure_val / 65535.0 * 3.3 * 3.0 / 0.009
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 83 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 84 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
        with open(denton18_log_file_location, 'a', newline='') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 85 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
            writer = csv.writer(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 86 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
            writer.writerow([running_timestamp, pressure_val])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 87 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 88 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
        return jsonify({'status': 'success'}), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 89 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 90 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 91 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
        current_app.logger.error(f"Error processing Denton18 pump data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 92 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 93 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 94 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 95 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
@api_bp.route('/denton18pumpfinished', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 96 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
def denton18_pump_finished():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 97 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
    """Handle Denton 18 pump data completion"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 98 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
    state_file = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata', 'current_run.txt')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 99 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
    if os.path.exists(state_file):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 100 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
        os.remove(state_file)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 101 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
        return jsonify({'status': 'file closed'}), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 102 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
    else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 103 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
        return jsonify({'status': 'no file to close'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 104 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 105 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 106 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
@api_bp.route('/api/paralyne/analog/list', methods=['GET'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 107 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
def list_paralyne_files():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 108 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    """List Parylene analog files (unauthenticated endpoint)"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 109 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 110 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 111 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 112 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
        if not os.path.exists(directory_path):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 113 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
            return jsonify({'error': 'Directory not found'}), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 114 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 115 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
        files = [f for f in os.listdir(directory_path) if f.endswith('.csv')]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 116 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 117 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
        file_info = []
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 118 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
        for file in files:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 119 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
            file_path = os.path.join(directory_path, file)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 120 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `loop` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
            stat = os.stat(file_path)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 121 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
            file_info.append({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 122 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
                'filename': file,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 123 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
                'size': stat.st_size,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 124 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 125 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
                'download_url': f'/api/paralyne/analog/download/{file}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 126 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
            })
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 127 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 128 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
        file_info.sort(key=lambda x: x['modified'], reverse=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 129 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 130 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 131 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 132 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
            'files': file_info,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 133 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
            'count': len(file_info)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 134 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 135 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 136 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 137 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
        current_app.logger.error(f"Error listing Parylene files: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 138 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
        return jsonify({'error': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 139 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 140 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 141 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 142 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
def download_paralyne_file(filename):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 143 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
    """Download a Parylene analog file (unauthenticated endpoint)"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 144 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
    if '..' in filename or '/' in filename or '\\' in filename:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 145 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
        return jsonify({'error': 'Invalid filename'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 146 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
    if not filename.endswith('.csv'):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 147 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
        return jsonify({'error': 'File not found'}), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 148 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 149 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 150 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 151 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
        if not os.path.isfile(os.path.join(directory_path, filename)):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 152 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
            return jsonify({'error': 'File not found'}), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 153 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
        return send_from_directory(directory_path, filename, as_attachment=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 154 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 155 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 156 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
        current_app.logger.error(f"Error downloading Parylene file: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 157 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
        return jsonify({'error': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 158 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 159 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 160 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
# Helper functions
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 161 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 162 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
def log_historical_particle_data(room_name, sensor_number, timestamp, raw_measurements, converted_values):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 163 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
    """Log particle sensor data to CSV file for historical tracking"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 164 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 165 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
        # Create sensor-specific filename
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 166 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 167 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
        filename = f"{sensor_id}_historical.csv"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 168 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 169 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 170 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
        # Ensure directory exists
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 171 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 172 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 173 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
        # Check if file exists to determine if we need to write headers
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 174 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
        file_exists = os.path.exists(filepath)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 175 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 176 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
        with open(filepath, 'a', newline='') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 177 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
            writer = csv.writer(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 178 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 179 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
            # Write headers if file is new
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 180 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
            if not file_exists:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 181 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
                headers = [
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 182 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
                    'timestamp',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 183 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
                    'timestamp_iso',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 184 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
                    'room_name',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 185 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
                    'sensor_number',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 186 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
                    # Raw measurements
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 187 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
                    'mass_pm1',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 188 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
                    'mass_pm2_5',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 189 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
                    'mass_pm4',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 190 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
                    'mass_pm10',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 191 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
                    'num_pm0_5_ft3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 192 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
                    'num_pm1_ft3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 193 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
                    'num_pm2_5_ft3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 194 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
                    'num_pm4_ft3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 195 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
                    'num_pm10_ft3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 196 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
                    'typical_particle_size_um',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 197 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
                    # Number concentrations (ft³) - same data as above for compatibility
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 198 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
                    'num_pm0_5_ft3_dup',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 199 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
                    'num_pm1_ft3_dup',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 200 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
                    'num_pm2_5_ft3_dup',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 201 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
                    'num_pm4_ft3_dup',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 202 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
                    'num_pm10_ft3_dup',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 203 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
                    # Differential bins (ft³)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 204 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
                    'bin_0_3_to_0_5',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 205 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
                    'bin_0_5_to_1_0',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 206 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
                    'bin_1_0_to_2_5',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 207 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
                    'bin_2_5_to_4_0',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 208 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
                    'bin_4_0_to_10',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 209 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
                    # Mass concentrations (μg/m³)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 210 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
                    'mass_pm1_ug_m3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 211 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
                    'mass_pm2_5_ug_m3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 212 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
                    'mass_pm4_ug_m3',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 213 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
                    'mass_pm10_ug_m3'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 214 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
                ]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 215 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
                writer.writerow(headers)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 216 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 217 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
            # Extract data with defaults
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 218 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
            number_concentrations = converted_values.get('number_concentrations_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 219 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 220

```text
            differential_bins = converted_values.get('differential_bins_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 220 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 221

```text
            mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 221 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 222

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 222 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 223

```text
            # Write data row
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 223 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 224

```text
            row_data = [
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 224 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 225

```text
                timestamp.timestamp(),  # Unix timestamp
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 225 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 226

```text
                timestamp.isoformat(),  # ISO format timestamp
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 226 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 227

```text
                room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 227 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 228

```text
                sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 228 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 229

```text
                # Raw measurements (mass concentrations are kept as they're realistic)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 229 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 230

```text
                raw_measurements.get('mass_pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 230 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 231

```text
                raw_measurements.get('mass_pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 231 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 232

```text
                raw_measurements.get('mass_pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 232 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 233

```text
                raw_measurements.get('mass_pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 233 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 234

```text
                # Use converted ft³ values instead of unrealistic raw #/cm³ values
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 234 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 235

```text
                number_concentrations.get('pm0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 235 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 236

```text
                number_concentrations.get('pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 236 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 237

```text
                number_concentrations.get('pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 237 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 238

```text
                number_concentrations.get('pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 238 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 239

```text
                number_concentrations.get('pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 239 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 240

```text
                raw_measurements.get('typical_particle_size_um'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 240 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 241

```text
                # Number concentrations (ft³) - same as above for consistency
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 241 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 242

```text
                number_concentrations.get('pm0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 242 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 243

```text
                number_concentrations.get('pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 243 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 244

```text
                number_concentrations.get('pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 244 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 245

```text
                number_concentrations.get('pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 245 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 246

```text
                number_concentrations.get('pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 246 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 247

```text
                # Differential bins (ft³)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 247 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 248

```text
                differential_bins.get('bin_0_3_to_0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 248 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 249

```text
                differential_bins.get('bin_0_5_to_1_0'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 249 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 250

```text
                differential_bins.get('bin_1_0_to_2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 250 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 251

```text
                differential_bins.get('bin_2_5_to_4_0'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 251 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 252

```text
                differential_bins.get('bin_4_0_to_10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 252 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 253

```text
                # Mass concentrations (μg/m³)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 253 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 254

```text
                mass_concentrations.get('pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 254 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 255

```text
                mass_concentrations.get('pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 255 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 256

```text
                mass_concentrations.get('pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 256 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 257

```text
                mass_concentrations.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 257 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 258

```text
            ]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 258 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 259

```text
            writer.writerow(row_data)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 259 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 260

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 260 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 261

```text
        current_app.logger.info(f"Logged historical particle data to {filepath}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 261 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 262

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 262 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 263

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 263 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 264

```text
        current_app.logger.error(f"Error logging historical particle data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 264 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 265

```text
        # Don't raise exception - CSV logging failure shouldn't break the main functionality
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 265 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 266

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 266 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 267

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 267 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 268

```text
def handle_csv_batch():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 268 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 269

```text
    """Handle CSV batch data from Raspberry Pi"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 269 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 270

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 270 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 271

```text
        csv_content = request.data.decode('utf-8')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 271 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 272

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 272 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 273

```text
        # Get batch information from headers
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 273 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 274

```text
        session_id = request.headers.get('X-Session-ID')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 274 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 275

```text
        batch_number = request.headers.get('X-Batch-Number')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 275 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 276

```text
        total_batches = request.headers.get('X-Total-Batches')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 276 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 277

```text
        is_final_batch = request.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 277 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 278

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 278 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 279

```text
        if not session_id or not batch_number or not total_batches:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 279 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 280

```text
            return jsonify({'status': 'error', 'message': 'Missing headers'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 280 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 281

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 281 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 282

```text
        batch_number = int(batch_number)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 282 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 283

```text
        total_batches = int(total_batches)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 283 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 284

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 284 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 285

```text
        # Write directly to disk
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 285 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 286

```text
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 286 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 287

```text
        os.makedirs(temp_dir, exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 287 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 288

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 288 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 289

```text
        batch_file = os.path.join(temp_dir, f'batch_{batch_number:04d}.csv')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 289 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 290

```text
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 290 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 291

```text
        if not os.path.exists(start_time_file):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 291 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 292

```text
            with open(start_time_file, 'w') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 292 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 293

```text
                f.write(datetime.now().strftime('%Y%m%d%H%M%S'))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 293 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 294

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 294 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 295

```text
        with open(batch_file, 'w', encoding='utf-8') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 295 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 296

```text
            f.write(csv_content)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 296 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 297

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 297 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 298

```text
        # Check if all batches received
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 298 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 299

```text
        received_batches = len([f for f in os.listdir(temp_dir) if f.startswith('batch_')])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 299 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 300

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 300 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 301

```text
        if received_batches == total_batches or is_final_batch:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 301 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 302

```text
            current_app.logger.info(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 302 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 303

```text
            combine_csv_batches_final(session_id, cleanup=False)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 303 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 304

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 304 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 305

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 305 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 306

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 306 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 307

```text
            'message': f'Batch {batch_number}/{total_batches} received',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 307 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 308

```text
            'session_id': session_id
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 308 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 309

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 309 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 310

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 310 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 311

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 311 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 312

```text
        current_app.logger.error(f"Error processing CSV batch: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 312 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 313

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 313 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 314

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 314 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 315

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 315 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 316

```text
def combine_csv_batches_final(session_id, cleanup=True):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 316 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 317

```text
    """Combine all CSV batches for a session from disk"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 317 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 318

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 318 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 319

```text
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 319 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 320

```text
        if not os.path.exists(temp_dir):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 320 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 321

```text
            return
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 321 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 322

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 322 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 323

```text
        batches = sorted([f for f in os.listdir(temp_dir) if f.startswith('batch_')])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 323 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 324

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 324 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 325

```text
        if not batches:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 325 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 326

```text
            return
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 326 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 327

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 327 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 328

```text
        # Determine timestamp
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 328 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 329

```text
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 329 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 330

```text
        if os.path.exists(start_time_file):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 330 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 331

```text
            with open(start_time_file, 'r') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 331 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 332

```text
                timestamp = f.read().strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 332 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 333

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 333 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 334

```text
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 334 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 335

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 335 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 336

```text
        # Create combined filename
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 336 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 337

```text
        combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 337 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 338

```text
        combined_filepath = os.path.join(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 338 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 339

```text
            current_app.config['LOG_DATA_DIR'],
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 339 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 340

```text
            'Paralyne',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 340 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 341

```text
            'analog',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 341 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 342

```text
            combined_filename
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 342 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 343

```text
        )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 343 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 344

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 344 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 345

```text
        os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 345 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 346

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 346 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 347

```text
        # Write combined file
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 347 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 348

```text
        with open(combined_filepath, 'w', newline='', encoding='utf-8') as combined_file:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 348 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 349

```text
            combined_file.write("timestamp,pressure,vapor,temp\n")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 349 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 350

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 350 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 351

```text
            for batch_filename in batches:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 351 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 352

```text
                batch_filepath = os.path.join(temp_dir, batch_filename)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 352 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `loop` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 353

```text
                with open(batch_filepath, 'r', encoding='utf-8') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 353 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 354

```text
                    batch_content = f.read()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 354 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 355

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 355 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 356

```text
                lines = batch_content.strip().split('\n')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 356 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 357

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 357 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 358

```text
                # Skip header if present
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 358 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 359

```text
                if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 359 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 360

```text
                    lines = lines[1:]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 360 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 361

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 361 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 362

```text
                for line in lines:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 362 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 363

```text
                    if line.strip():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 363 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 364

```text
                        combined_file.write(line.strip() + '\n')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 364 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 365

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 365 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 366

```text
        current_app.logger.info(f"Combined CSV created: {combined_filepath}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 366 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 367

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 367 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 368

```text
        # Clean up if requested
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 368 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 369

```text
        if cleanup and os.path.exists(temp_dir):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 369 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 370

```text
            shutil.rmtree(temp_dir)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 370 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 371

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 371 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 372

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 372 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 373

```text
        current_app.logger.error(f"Error combining CSV batches: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 373 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 374

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 374 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 375

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 375 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 376

```text
@api_bp.route('/particle-data', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 376 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 377

```text
def receive_particle_data():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 377 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 378

```text
    """Receive particle sensor data from Pico sensors and store the most recent values"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 378 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 379

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 379 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 380

```text
        # Get JSON data from request
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 380 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 381

```text
        if not request.is_json:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 381 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 382

```text
            return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 382 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 383

```text
                'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 383 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 384

```text
                'message': 'Content-Type must be application/json'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 384 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 385

```text
            }), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 385 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 386

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 386 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 387

```text
        data = request.get_json()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 387 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 388

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 388 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 389

```text
        # Validate required fields
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 389 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 390

```text
        required_fields = ['room_name', 'sensor_number', 'timestamp']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 390 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 391

```text
        for field in required_fields:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 391 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 392

```text
            if field not in data:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 392 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 393

```text
                return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 393 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 394

```text
                    'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 394 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 395

```text
                    'message': f'Missing required field: {field}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 395 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 396

```text
                }), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 396 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 397

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 397 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 398

```text
        # Extract room name and sensor number
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 398 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 399

```text
        room_name = data['room_name']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 399 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 400

```text
        sensor_number = data['sensor_number']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 400 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 401

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 401 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 402

```text
        # Parse timestamp (could be Unix timestamp or ISO string)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 402 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 403

```text
        timestamp_value = data['timestamp']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 403 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 404

```text
        if isinstance(timestamp_value, (int, float)):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 404 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 405

```text
            # Unix timestamp
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 405 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 406

```text
            sensor_timestamp = datetime.fromtimestamp(timestamp_value)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 406 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 407

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 407 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 408

```text
            # Try to parse ISO string
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 408 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 409

```text
            try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 409 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 410

```text
                sensor_timestamp = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 410 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 411

```text
            except:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 411 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 412

```text
                sensor_timestamp = datetime.utcnow()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 412 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 413

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 413 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 414

```text
        # Extract measurement data with defaults
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 414 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 415

```text
        raw_measurements = data.get('raw_measurements', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 415 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 416

```text
        converted_values = data.get('converted_values', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 416 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 417

```text
        number_concentrations = converted_values.get('number_concentrations_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 417 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 418

```text
        differential_bins = converted_values.get('differential_bins_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 418 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 419

```text
        mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 419 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 420

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 420 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 421

```text
        # CSV Historical Data Logging
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 421 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 422

```text
        log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 422 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 423

```text
                                   raw_measurements, converted_values)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 423 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 424

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 424 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 425

```text
        # Check if we already have data for this sensor
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 425 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 426

```text
        existing_record = ParticleSensorData.query.filter_by(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 426 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 427

```text
            room_name=room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 427 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 428

```text
            sensor_number=sensor_number
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 428 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 429

```text
        ).first()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 429 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 430

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 430 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 431

```text
        if existing_record:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 431 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 432

```text
            # Update existing record
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 432 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 433

```text
            existing_record.timestamp = sensor_timestamp
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 433 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 434

```text
            existing_record.last_updated = datetime.utcnow()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 434 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 435

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 435 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 436

```text
            # Update raw measurements
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 436 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 437

```text
            existing_record.mass_pm1 = raw_measurements.get('mass_pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 437 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 438

```text
            existing_record.mass_pm2_5 = raw_measurements.get('mass_pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 438 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 439

```text
            existing_record.mass_pm4 = raw_measurements.get('mass_pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 439 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 440

```text
            existing_record.mass_pm10 = raw_measurements.get('mass_pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 440 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 441

```text
            existing_record.num_pm0_5 = raw_measurements.get('num_pm0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 441 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 442

```text
            existing_record.num_pm1 = raw_measurements.get('num_pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 442 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 443

```text
            existing_record.num_pm2_5 = raw_measurements.get('num_pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 443 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 444

```text
            existing_record.num_pm4 = raw_measurements.get('num_pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 444 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 445

```text
            existing_record.num_pm10 = raw_measurements.get('num_pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 445 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 446

```text
            existing_record.typical_particle_size_um = raw_measurements.get('typical_particle_size_um')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 446 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 447

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 447 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 448

```text
            # Update converted values
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 448 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 449

```text
            existing_record.num_pm0_5_ft3 = number_concentrations.get('pm0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 449 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 450

```text
            existing_record.num_pm1_ft3 = number_concentrations.get('pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 450 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 451

```text
            existing_record.num_pm2_5_ft3 = number_concentrations.get('pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 451 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 452

```text
            existing_record.num_pm4_ft3 = number_concentrations.get('pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 452 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 453

```text
            existing_record.num_pm10_ft3 = number_concentrations.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 453 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 454

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 454 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 455

```text
            # Update differential bins
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 455 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 456

```text
            existing_record.bin_0_3_to_0_5 = differential_bins.get('bin_0_3_to_0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 456 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 457

```text
            existing_record.bin_0_5_to_1_0 = differential_bins.get('bin_0_5_to_1_0')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 457 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 458

```text
            existing_record.bin_1_0_to_2_5 = differential_bins.get('bin_1_0_to_2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 458 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 459

```text
            existing_record.bin_2_5_to_4_0 = differential_bins.get('bin_2_5_to_4_0')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 459 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 460

```text
            existing_record.bin_4_0_to_10 = differential_bins.get('bin_4_0_to_10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 460 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 461

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 461 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 462

```text
            # Update mass concentrations
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 462 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 463

```text
            existing_record.mass_pm1_ug_m3 = mass_concentrations.get('pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 463 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 464

```text
            existing_record.mass_pm2_5_ug_m3 = mass_concentrations.get('pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 464 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 465

```text
            existing_record.mass_pm4_ug_m3 = mass_concentrations.get('pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 465 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 466

```text
            existing_record.mass_pm10_ug_m3 = mass_concentrations.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 466 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 467

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 467 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 468

```text
            current_app.logger.info(f"Updated particle data for {room_name}/{sensor_number}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 468 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 469

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 469 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 470

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 470 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 471

```text
            # Create new record
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 471 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 472

```text
            new_record = ParticleSensorData(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 472 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 473

```text
                room_name=room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 473 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 474

```text
                sensor_number=sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 474 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 475

```text
                timestamp=sensor_timestamp,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 475 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 476

```text
                last_updated=datetime.utcnow(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 476 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 477

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 477 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 478

```text
                # Raw measurements
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 478 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 479

```text
                mass_pm1=raw_measurements.get('mass_pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 479 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 480

```text
                mass_pm2_5=raw_measurements.get('mass_pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 480 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 481

```text
                mass_pm4=raw_measurements.get('mass_pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 481 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 482

```text
                mass_pm10=raw_measurements.get('mass_pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 482 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 483

```text
                num_pm0_5=raw_measurements.get('num_pm0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 483 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 484

```text
                num_pm1=raw_measurements.get('num_pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 484 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 485

```text
                num_pm2_5=raw_measurements.get('num_pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 485 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 486

```text
                num_pm4=raw_measurements.get('num_pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 486 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 487

```text
                num_pm10=raw_measurements.get('num_pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 487 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 488

```text
                typical_particle_size_um=raw_measurements.get('typical_particle_size_um'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 488 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 489

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 489 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 490

```text
                # Converted values
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 490 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 491

```text
                num_pm0_5_ft3=number_concentrations.get('pm0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 491 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 492

```text
                num_pm1_ft3=number_concentrations.get('pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 492 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 493

```text
                num_pm2_5_ft3=number_concentrations.get('pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 493 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 494

```text
                num_pm4_ft3=number_concentrations.get('pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 494 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 495

```text
                num_pm10_ft3=number_concentrations.get('pm10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 495 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 496

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 496 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 497

```text
                # Differential bins
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 497 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 498

```text
                bin_0_3_to_0_5=differential_bins.get('bin_0_3_to_0_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 498 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 499

```text
                bin_0_5_to_1_0=differential_bins.get('bin_0_5_to_1_0'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 499 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 500

```text
                bin_1_0_to_2_5=differential_bins.get('bin_1_0_to_2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 500 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 501

```text
                bin_2_5_to_4_0=differential_bins.get('bin_2_5_to_4_0'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 501 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 502

```text
                bin_4_0_to_10=differential_bins.get('bin_4_0_to_10'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 502 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 503

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 503 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 504

```text
                # Mass concentrations
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 504 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 505

```text
                mass_pm1_ug_m3=mass_concentrations.get('pm1'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 505 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 506

```text
                mass_pm2_5_ug_m3=mass_concentrations.get('pm2_5'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 506 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 507

```text
                mass_pm4_ug_m3=mass_concentrations.get('pm4'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 507 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 508

```text
                mass_pm10_ug_m3=mass_concentrations.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 508 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 509

```text
            )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 509 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 510

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 510 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 511

```text
            db.session.add(new_record)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 511 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 512

```text
            current_app.logger.info(f"Created new particle data record for {room_name}/{sensor_number}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 512 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 513

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 513 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 514

```text
        # Commit the changes
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 514 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 515

```text
        db.session.commit()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 515 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 516

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 516 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `database` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 517

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 517 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 518

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 518 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 519

```text
            'message': f'Particle data received for sensor {sensor_number} in {room_name}',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 519 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 520

```text
            'sensor_id': f"{room_name}/{sensor_number}",
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 520 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 521

```text
            'timestamp': sensor_timestamp.isoformat()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 521 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 522

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 522 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 523

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 523 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 524

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 524 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 525

```text
        # Rollback on error
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 525 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 526

```text
        db.session.rollback()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 526 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 527

```text
        current_app.logger.error(f"Error processing particle sensor data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 527 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `database` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 528

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 528 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 529

```text
            'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 529 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 530

```text
            'message': f'Error processing data: {str(e)}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 530 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 531

```text
        }), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 531 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 532

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 532 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 533

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 533 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 534

```text
@api_bp.route('/particle-data', methods=['GET'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 534 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 535

```text
def get_particle_data():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 535 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 536

```text
    """Get current particle sensor data for all sensors or a specific sensor.
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 536 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 537

```text
    If both room_name and sensor_number are provided, returns historical CSV data."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 537 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 538

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 538 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 539

```text
        # Optional query parameters
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 539 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 540

```text
        room_name = request.args.get('room_name')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 540 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 541

```text
        sensor_number = request.args.get('sensor_number')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 541 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 542

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 542 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 543

```text
        # If both room_name and sensor_number are provided, return historical CSV data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 543 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 544

```text
        if room_name and sensor_number:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 544 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 545

```text
            return get_historical_csv_data(room_name, sensor_number)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 545 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 546

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 546 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 547

```text
        # Build query for current data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 547 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 548

```text
        query = ParticleSensorData.query
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 548 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 549

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 549 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 550

```text
        if room_name:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 550 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 551

```text
            query = query.filter_by(room_name=room_name)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 551 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 552

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 552 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 553

```text
        if sensor_number:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 553 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 554

```text
            query = query.filter_by(sensor_number=sensor_number)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 554 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 555

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 555 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 556

```text
        # Get results
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 556 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 557

```text
        sensors = query.all()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 557 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 558

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 558 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 559

```text
        # Convert to JSON-serializable format
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 559 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 560

```text
        sensor_data = [sensor.to_dict() for sensor in sensors]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 560 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 561

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 561 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 562

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 562 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 563

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 563 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 564

```text
            'count': len(sensor_data),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 564 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 565

```text
            'sensors': sensor_data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 565 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 566

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 566 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 567

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 567 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 568

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 568 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 569

```text
        current_app.logger.error(f"Error retrieving particle sensor data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 569 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 570

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 570 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 571

```text
            'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 571 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 572

```text
            'message': f'Error retrieving data: {str(e)}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 572 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 573

```text
        }), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 573 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 574

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 574 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 575

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 575 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 576

```text
def get_historical_csv_data(room_name, sensor_number):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 576 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 577

```text
    """Return historical CSV data for a specific sensor"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 577 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 578

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 578 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 579

```text
        # Construct the CSV filename
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 579 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 580

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 580 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 581

```text
        filename = f"{sensor_id}_historical.csv"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 581 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 582

```text
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 582 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 583

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 583 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 584

```text
        # Check if file exists
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 584 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 585

```text
        if not os.path.exists(filepath):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 585 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 586

```text
            return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 586 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 587

```text
                'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 587 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 588

```text
                'message': f'No historical data found for sensor {sensor_number} in {room_name}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 588 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 589

```text
            }), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 589 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 590

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 590 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 591

```text
        # Read and parse CSV file
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 591 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 592

```text
        historical_data = []
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 592 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 593

```text
        with open(filepath, 'r') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 593 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 594

```text
            reader = csv.DictReader(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 594 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 595

```text
            for row in reader:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 595 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 596

```text
                # Convert numeric values from strings
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 596 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 597

```text
                processed_row = {}
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 597 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 598

```text
                for key, value in row.items():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 598 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 599

```text
                    if value == '' or value is None:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 599 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 600

```text
                        processed_row[key] = None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 600 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 601

```text
                    elif key in ['timestamp', 'timestamp_iso', 'room_name', 'sensor_number']:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 601 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 602

```text
                        processed_row[key] = value
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 602 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 603

```text
                    else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 603 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 604

```text
                        try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 604 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 605

```text
                            processed_row[key] = float(value)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 605 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 606

```text
                        except (ValueError, TypeError):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 606 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 607

```text
                            processed_row[key] = value
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 607 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 608

```text
                historical_data.append(processed_row)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 608 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 609

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 609 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 610

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 610 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 611

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 611 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 612

```text
            'room_name': room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 612 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 613

```text
            'sensor_number': sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 613 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 614

```text
            'data_source': 'historical_csv',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 614 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 615

```text
            'record_count': len(historical_data),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 615 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 616

```text
            'historical_data': historical_data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 616 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 617

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 617 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 618

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 618 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 619

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 619 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 620

```text
        current_app.logger.error(f"Error retrieving historical CSV data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 620 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 621

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 621 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 622

```text
            'status': 'error',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 622 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 623

```text
            'message': f'Error reading historical data: {str(e)}'
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 623 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 624

```text
        }), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 624 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 625

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 625 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 626

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 626 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 627

```text
# ============================================================
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 627 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 628

```text
# Combined sensor endpoint (SPS30 particle + DHT22 environment)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 628 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 629

```text
# ============================================================
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 629 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 630

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 630 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 631

```text
SENSOR_CSV_HEADER = (
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 631 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 632

```text
    "timestamp,temperature_c,humidity_pct,"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 632 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 633

```text
    "mass_pm1,mass_pm2_5,mass_pm4,mass_pm10,"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 633 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 634

```text
    "num_pm0_5_ft3,num_pm1_ft3,num_pm2_5_ft3,num_pm4_ft3,num_pm10_ft3,"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 634 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 635

```text
    "typical_particle_size_um\n"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 635 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 636

```text
)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 636 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 637

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 637 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 638

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 638 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 639

```text
def _sensor_csv_path(room_name, sensor_number):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 639 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 640

```text
    """Return the path to the per-sensor combined CSV, creating dirs as needed."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 640 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `function` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 641

```text
    sensor_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'sensors')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 641 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 642

```text
    os.makedirs(sensor_dir, exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 642 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 643

```text
    safe_name = "{}_{}_combined.csv".format(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 643 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 644

```text
        room_name.replace("/", "_"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 644 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 645

```text
        sensor_number.replace("/", "_"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 645 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 646

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 646 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 647

```text
    return os.path.join(sensor_dir, safe_name)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 647 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 648

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 648 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 649

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 649 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 650

```text
@api_bp.route('/sensor-data', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 650 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 651

```text
def sensor_data_post():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 651 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 652

```text
    """Accept combined particle + environmental sensor data and append to CSV."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 652 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 653

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 653 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 654

```text
        data = request.get_json(force=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 654 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 655

```text
        if not data:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 655 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 656

```text
            return jsonify({'error': 'No JSON body'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 656 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 657

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 657 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 658

```text
        room_name = data.get('room_name')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 658 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 659

```text
        sensor_number = data.get('sensor_number')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 659 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 660

```text
        if not room_name or not sensor_number:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 660 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 661

```text
            return jsonify({'error': 'room_name and sensor_number required'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 661 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 662

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 662 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 663

```text
        # Timestamp — accept from device or default to server time
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 663 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 664

```text
        timestamp = data.get('timestamp')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 664 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 665

```text
        if timestamp:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 665 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 666

```text
            ts_str = datetime.fromtimestamp(float(timestamp)).strftime('%Y-%m-%d %H:%M:%S')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 666 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 667

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 667 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 668

```text
            ts_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 668 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 669

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 669 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 670

```text
        # Environmental values (may be absent if DHT22 read failed)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 670 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 671

```text
        temperature_c = data.get('temperature_c', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 671 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 672

```text
        humidity_pct = data.get('humidity_pct', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 672 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 673

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 673 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 674

```text
        # Particle values (nested dicts from the Pico)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 674 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 675

```text
        raw = data.get('raw_measurements', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 675 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 676

```text
        converted = data.get('converted_values', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 676 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 677

```text
        conc_ft3 = converted.get('number_concentrations_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 677 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 678

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 678 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 679

```text
        mass_pm1 = raw.get('mass_pm1', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 679 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 680

```text
        mass_pm2_5 = raw.get('mass_pm2_5', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 680 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 681

```text
        mass_pm4 = raw.get('mass_pm4', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 681 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 682

```text
        mass_pm10 = raw.get('mass_pm10', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 682 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 683

```text
        num_pm0_5_ft3 = conc_ft3.get('pm0_5', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 683 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 684

```text
        num_pm1_ft3 = conc_ft3.get('pm1', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 684 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 685

```text
        num_pm2_5_ft3 = conc_ft3.get('pm2_5', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 685 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 686

```text
        num_pm4_ft3 = conc_ft3.get('pm4', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 686 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 687

```text
        num_pm10_ft3 = conc_ft3.get('pm10', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 687 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 688

```text
        tps_um = raw.get('typical_particle_size_um', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 688 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 689

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 689 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 690

```text
        sensor_dt = datetime.fromtimestamp(float(timestamp)) if timestamp else datetime.now()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 690 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 691

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 691 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 692

```text
        # Write to particle_sensors/ so the GUI's historical data lookup works
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 692 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 693

```text
        if raw:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 693 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 694

```text
            log_historical_particle_data(room_name, sensor_number, sensor_dt, raw, converted)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 694 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 695

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 695 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 696

```text
        # Also write to dedicated env CSV when DHT22 data is present
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 696 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 697

```text
        if temperature_c != '' and humidity_pct != '':
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 697 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 698

```text
            sensor_id = '{}_{}'.format(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 698 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 699

```text
                room_name.replace('/', '_'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 699 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 700

```text
                sensor_number.replace('/', '_'),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 700 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 701

```text
            )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 701 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 702

```text
            env_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 702 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 703

```text
            os.makedirs(env_dir, exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 703 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 704

```text
            env_path = os.path.join(env_dir, '{}_historical.csv'.format(sensor_id))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 704 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 705

```text
            env_file_exists = os.path.exists(env_path)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 705 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 706

```text
            with open(env_path, 'a', newline='') as ef:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 706 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 707

```text
                env_writer = csv.writer(ef)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 707 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 708

```text
                if not env_file_exists:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 708 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 709

```text
                    env_writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 709 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 710

```text
                                         'sensor_number', 'temperature_c', 'humidity_pct'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 710 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 711

```text
                env_writer.writerow([sensor_dt.timestamp(), sensor_dt.isoformat(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 711 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 712

```text
                                     room_name, sensor_number, temperature_c, humidity_pct])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 712 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 713

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 713 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 714

```text
        # Upsert into ParticleSensorData DB so the GUI can display this sensor
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 714 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 715

```text
        if raw:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 715 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 716

```text
            diff = converted.get('differential_bins_ft3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 716 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 717

```text
            mass_conc = converted.get('mass_concentrations_ug_m3', {})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 717 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 718

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 718 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 719

```text
            record = ParticleSensorData.query.filter_by(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 719 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 720

```text
                room_name=room_name, sensor_number=sensor_number
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 720 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 721

```text
            ).first()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 721 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 722

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 722 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 723

```text
            if record:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 723 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 724

```text
                record.timestamp = sensor_dt
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 724 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 725

```text
                record.last_updated = datetime.utcnow()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 725 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 726

```text
            else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 726 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 727

```text
                record = ParticleSensorData(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 727 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 728

```text
                    room_name=room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 728 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 729

```text
                    sensor_number=sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 729 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 730

```text
                    timestamp=sensor_dt,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 730 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 731

```text
                    last_updated=datetime.utcnow(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 731 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 732

```text
                )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 732 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 733

```text
                db.session.add(record)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 733 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 734

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 734 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 735

```text
            record.mass_pm1 = raw.get('mass_pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 735 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 736

```text
            record.mass_pm2_5 = raw.get('mass_pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 736 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 737

```text
            record.mass_pm4 = raw.get('mass_pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 737 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 738

```text
            record.mass_pm10 = raw.get('mass_pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 738 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 739

```text
            record.num_pm0_5 = raw.get('num_pm0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 739 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 740

```text
            record.num_pm1 = raw.get('num_pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 740 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 741

```text
            record.num_pm2_5 = raw.get('num_pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 741 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 742

```text
            record.num_pm4 = raw.get('num_pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 742 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 743

```text
            record.num_pm10 = raw.get('num_pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 743 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 744

```text
            record.typical_particle_size_um = raw.get('typical_particle_size_um')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 744 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 745

```text
            record.num_pm0_5_ft3 = conc_ft3.get('pm0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 745 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 746

```text
            record.num_pm1_ft3 = conc_ft3.get('pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 746 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 747

```text
            record.num_pm2_5_ft3 = conc_ft3.get('pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 747 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 748

```text
            record.num_pm4_ft3 = conc_ft3.get('pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 748 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 749

```text
            record.num_pm10_ft3 = conc_ft3.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 749 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 750

```text
            record.bin_0_3_to_0_5 = diff.get('bin_0_3_to_0_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 750 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 751

```text
            record.bin_0_5_to_1_0 = diff.get('bin_0_5_to_1_0')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 751 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 752

```text
            record.bin_1_0_to_2_5 = diff.get('bin_1_0_to_2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 752 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 753

```text
            record.bin_2_5_to_4_0 = diff.get('bin_2_5_to_4_0')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 753 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 754

```text
            record.bin_4_0_to_10 = diff.get('bin_4_0_to_10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 754 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 755

```text
            record.mass_pm1_ug_m3 = mass_conc.get('pm1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 755 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 756

```text
            record.mass_pm2_5_ug_m3 = mass_conc.get('pm2_5')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 756 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 757

```text
            record.mass_pm4_ug_m3 = mass_conc.get('pm4')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 757 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 758

```text
            record.mass_pm10_ug_m3 = mass_conc.get('pm10')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 758 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 759

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 759 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 760

```text
            if temperature_c != '':
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 760 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 761

```text
                try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 761 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 762

```text
                    record.temperature_c = float(temperature_c)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 762 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 763

```text
                except (ValueError, TypeError):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 763 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 764

```text
                    pass
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 764 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 765

```text
            if humidity_pct != '':
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 765 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 766

```text
                try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 766 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 767

```text
                    record.humidity_pct = float(humidity_pct)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 767 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 768

```text
                except (ValueError, TypeError):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 768 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 769

```text
                    pass
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 769 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 770

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 770 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 771

```text
            db.session.commit()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 771 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 772

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 772 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `database` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 773

```text
        current_app.logger.info(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 773 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 774

```text
            f"Sensor data: {room_name}/{sensor_number} — "
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 774 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 775

```text
            f"temp={temperature_c} hum={humidity_pct} pm2.5={mass_pm2_5}"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 775 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 776

```text
        )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 776 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 777

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 777 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 778

```text
        return jsonify({'status': 'success'}), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 778 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 779

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 779 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 780

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 780 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 781

```text
        db.session.rollback()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 781 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 782

```text
        current_app.logger.error(f"Error processing sensor data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 782 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `database` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 783

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 783 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 784

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 784 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 785

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 785 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 786

```text
@api_bp.route('/sensor-data', methods=['GET'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 786 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 787

```text
def sensor_data_get():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 787 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 788

```text
    """Return historical combined sensor data as JSON.
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 788 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 789

```text
    Query params: room_name, sensor_number (both required)."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 789 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 790

```text
    room_name = request.args.get('room_name')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 790 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 791

```text
    sensor_number = request.args.get('sensor_number')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 791 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 792

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 792 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 793

```text
    if not room_name or not sensor_number:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 793 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 794

```text
        return jsonify({'error': 'room_name and sensor_number query params required'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 794 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 795

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 795 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 796

```text
    csv_path = _sensor_csv_path(room_name, sensor_number)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 796 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 797

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 797 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 798

```text
    if not os.path.exists(csv_path):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 798 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 799

```text
        return jsonify({'error': 'No data found for this sensor'}), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 799 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 800

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 800 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 801

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 801 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 802

```text
        rows = []
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 802 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 803

```text
        with open(csv_path, 'r') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 803 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 804

```text
            reader = csv.DictReader(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 804 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 805

```text
            for row in reader:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 805 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 806

```text
                rows.append(row)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 806 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `loop` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 807

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 807 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 808

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 808 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 809

```text
            'status': 'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 809 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 810

```text
            'room_name': room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 810 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 811

```text
            'sensor_number': sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 811 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 812

```text
            'count': len(rows),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 812 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 813

```text
            'data': rows,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 813 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 814

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 814 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 815

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 815 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 816

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 816 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 817

```text
        current_app.logger.error(f"Error reading sensor data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 817 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 818

```text
        return jsonify({'error': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 818 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 819

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 819 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 820

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 820 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 821

```text
@api_bp.route('/env-data', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 821 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 822

```text
def receive_env_data():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 822 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 823

```text
    """Receive temperature/humidity data from DHT22 sensors on Pico W."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 823 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 824

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 824 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 825

```text
        if not request.is_json:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 825 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 826

```text
            return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 826 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 827

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 827 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 828

```text
        data = request.get_json()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 828 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 829

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 829 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 830

```text
        for field in ('room_name', 'sensor_number', 'timestamp', 'temperature_c', 'humidity_pct'):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 830 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 831

```text
            if field not in data:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 831 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 832

```text
                return jsonify({'status': 'error', 'message': f'Missing field: {field}'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 832 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 833

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 833 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 834

```text
        room_name     = data['room_name']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 834 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 835

```text
        sensor_number = data['sensor_number']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 835 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 836

```text
        temperature_c = float(data['temperature_c'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 836 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 837

```text
        humidity_pct  = float(data['humidity_pct'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 837 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 838

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 838 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 839

```text
        ts = data['timestamp']
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 839 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 840

```text
        if isinstance(ts, (int, float)):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 840 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 841

```text
            sensor_timestamp = datetime.fromtimestamp(ts)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 841 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 842

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 842 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 843

```text
            try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 843 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 844

```text
                sensor_timestamp = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 844 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 845

```text
            except Exception:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 845 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 846

```text
                sensor_timestamp = datetime.utcnow()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 846 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 847

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 847 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 848

```text
        # Append to a per-sensor CSV for historical tracking
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 848 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 849

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 849 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 850

```text
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 850 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 851

```text
                                 f"{sensor_id}_historical.csv")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 851 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 852

```text
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 852 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 853

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 853 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 854

```text
        file_exists = os.path.exists(filepath)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 854 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 855

```text
        with open(filepath, 'a', newline='') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 855 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 856

```text
            import csv as _csv
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 856 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 857

```text
            writer = _csv.writer(f)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 857 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `import` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 858

```text
            if not file_exists:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 858 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 859

```text
                writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 859 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 860

```text
                                 'sensor_number', 'temperature_c', 'humidity_pct'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 860 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 861

```text
            writer.writerow([sensor_timestamp.timestamp(), sensor_timestamp.isoformat(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 861 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 862

```text
                             room_name, sensor_number, temperature_c, humidity_pct])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 862 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 863

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 863 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 864

```text
        current_app.logger.info(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 864 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 865

```text
            f"env-data: {room_name}/{sensor_number} "
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 865 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 866

```text
            f"temp={temperature_c:.1f}°C  humidity={humidity_pct:.1f}%"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 866 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 867

```text
        )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 867 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 868

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 868 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 869

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 869 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 870

```text
            'status':        'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 870 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 871

```text
            'room_name':     room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 871 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 872

```text
            'sensor_number': sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 872 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 873

```text
            'temperature_c': temperature_c,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 873 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 874

```text
            'humidity_pct':  humidity_pct,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 874 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 875

```text
            'timestamp':     sensor_timestamp.isoformat(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 875 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 876

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 876 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 877

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 877 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 878

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 878 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 879

```text
        current_app.logger.error(f"Error processing env data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 879 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 880

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 880 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 881

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 881 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 882

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 882 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 883

```text
@api_bp.route('/env-data', methods=['GET'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 883 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 884

```text
def get_env_data():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 884 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 885

```text
    """Return historical CSV data for a temperature/humidity sensor."""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 885 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 886

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 886 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 887

```text
        room_name     = request.args.get('room_name', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 887 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 888

```text
        sensor_number = request.args.get('sensor_number', '')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 888 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 889

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 889 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 890

```text
        if not room_name or not sensor_number:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 890 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 891

```text
            return jsonify({'status': 'error', 'message': 'room_name and sensor_number required'}), 400
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 891 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 892

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 892 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 893

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 893 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 894

```text
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 894 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 895

```text
                                 f"{sensor_id}_historical.csv")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 895 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 896

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 896 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 897

```text
        if not os.path.exists(filepath):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 897 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 898

```text
            return jsonify({'status': 'error', 'message': 'No data found for this sensor'}), 404
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 898 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 899

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 899 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 900

```text
        import csv as _csv
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 900 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 901

```text
        rows = []
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 901 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `import` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 902

```text
        with open(filepath, 'r') as f:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 902 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 903

```text
            for row in _csv.DictReader(f):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 903 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `filesystem` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 904

```text
                for key in ('temperature_c', 'humidity_pct', 'timestamp'):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 904 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `loop` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 905

```text
                    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 905 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 906

```text
                        row[key] = float(row[key])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 906 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 907

```text
                    except (ValueError, KeyError):
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 907 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 908

```text
                        pass
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 908 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 909

```text
                rows.append(row)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 909 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 910

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 910 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 911

```text
        return jsonify({
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 911 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 912

```text
            'status':        'success',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 912 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 913

```text
            'room_name':     room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 913 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 914

```text
            'sensor_number': sensor_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 914 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 915

```text
            'record_count':  len(rows),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 915 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 916

```text
            'data':          rows,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 916 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 917

```text
        }), 200
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 917 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 918

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 918 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 919

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 919 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 920

```text
        current_app.logger.error(f"Error retrieving env data: {e}")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 920 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 921

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/api.py`, line 921 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/blueprints/api.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
