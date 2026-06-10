

# Source Reconstruction: UNanofabTools/app/blueprints/api.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2

```text
API blueprint for Raspberry Pi data collection endpoints
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 3

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 4

```text
import os
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 5

```text
import csv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 6

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 7

```text
import shutil
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 8

```text
from datetime import datetime, timedelta
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 9

```text
from flask import Blueprint, request, jsonify, current_app, send_from_directory
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
from app.models import db, ParticleSensorData
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
api_bp = Blueprint('api', __name__)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 14

```text
@api_bp.route('/sdsanalog', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 15

```text
def sds_analog():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 16

```text
    """Handle SDS analog data from Raspberry Pi (Parylene machine)"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 17

```text
    content_type = request.headers.get('Content-Type', '')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 19

```text
    if content_type == 'text/csv':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 20

```text
        return handle_csv_batch()
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 21

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 22

```text
        return jsonify({'status': 'error', 'message': 'Unsupported content type'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 25

```text
@api_bp.route('/sdsanalogfinished', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 26

```text
def sds_analog_finished():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 27

```text
    """Handle session finalization and combine all batches"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 28

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 30

```text
        if request.content_length and request.content_length > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 31

```text
            data = request.get_json()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 32

```text
            session_id = data.get('session_id') if data else None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 33

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 34

```text
            session_id = None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 36

```text
        if not session_id:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 37

```text
            session_id = request.headers.get('X-Session-ID')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 39

```text
        current_app.logger.info(f"Finalizing session: {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 41

```text
        if session_id:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 42

```text
            current_app.logger.info(f"Finalizing session: {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 43

```text
            combine_csv_batches_final(session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 44

```text
            message = f"Session {session_id} finalized"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 45

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 46

```text
            message = "No session ID provided"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 48

```text
        return jsonify({'status': 'session_finalized', 'message': message}), 200
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 50

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 51

```text
        current_app.logger.error(f"Error finalizing session: {e}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 52

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 55

```text
@api_bp.route('/denton18pump', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 56

```text
def denton18_pump():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 57

```text
    """Handle Denton 18 pump data from Raspberry Pi"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 58

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 59

```text
        data = request.get_json()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 60

```text
        pressure_val = data.get('pressure')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 62

```text
        state_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 63

```text
        os.makedirs(state_dir, exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 64

```text
        state_file = os.path.join(state_dir, 'current_run.txt')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 66

```text
        if os.path.exists(state_file):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 67

```text
            with open(state_file, 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 68

```text
                denton18_log_file_location = f.read().strip()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 69

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 70

```text
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 71

```text
            filename = f"{timestamp}_DENTON18PUMPLOG.csv"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 72

```text
            denton18_log_file_location = os.path.join(state_dir, filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 74

```text
            with open(state_file, 'w') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 75

```text
                f.write(denton18_log_file_location)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 77

```text
            with open(denton18_log_file_location, 'w', newline='') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 78

```text
                writer = csv.writer(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 79

```text
                writer.writerow(['Timestamp', 'Vacuum pressure'])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 82

```text
        running_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 83

```text
        pressure_val = pressure_val / 65535.0 * 3.3 * 3.0 / 0.009
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        with open(denton18_log_file_location, 'a', newline='') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 86

```text
            writer = csv.writer(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 87

```text
            writer.writerow([running_timestamp, pressure_val])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 89

```text
        return jsonify({'status': 'success'}), 200
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 91

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 92

```text
        current_app.logger.error(f"Error processing Denton18 pump data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 93

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 96

```text
@api_bp.route('/denton18pumpfinished', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 97

```text
def denton18_pump_finished():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 98

```text
    """Handle Denton 18 pump data completion"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 99

```text
    state_file = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata', 'current_run.txt')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 100

```text
    if os.path.exists(state_file):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 101

```text
        os.remove(state_file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 102

```text
        return jsonify({'status': 'file closed'}), 200
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 103

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 104

```text
        return jsonify({'status': 'no file to close'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 107

```text
@api_bp.route('/api/paralyne/analog/list', methods=['GET'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 108

```text
def list_paralyne_files():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 109

```text
    """List Parylene analog files (unauthenticated endpoint)"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 110

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 111

```text
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 113

```text
        if not os.path.exists(directory_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 114

```text
            return jsonify({'error': 'Directory not found'}), 404
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 116

```text
        files = [f for f in os.listdir(directory_path) if f.endswith('.csv')]
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 118

```text
        file_info = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 119

```text
        for file in files:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 120

```text
            file_path = os.path.join(directory_path, file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 121

```text
            stat = os.stat(file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 122

```text
            file_info.append({
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 123

```text
                'filename': file,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 124

```text
                'size': stat.st_size,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 125

```text
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 126

```text
                'download_url': f'/api/paralyne/analog/download/{file}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 127

```text
            })
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 129

```text
        file_info.sort(key=lambda x: x['modified'], reverse=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 131

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 132

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 133

```text
            'files': file_info,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 134

```text
            'count': len(file_info)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 135

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 137

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 138

```text
        current_app.logger.error(f"Error listing Parylene files: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 139

```text
        return jsonify({'error': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 142

```text
@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 143

```text
def download_paralyne_file(filename):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 144

```text
    """Download a Parylene analog file (unauthenticated endpoint)"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 145

```text
    if '..' in filename or '/' in filename or '\\' in filename:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 146

```text
        return jsonify({'error': 'Invalid filename'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 147

```text
    if not filename.endswith('.csv'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 148

```text
        return jsonify({'error': 'File not found'}), 404
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 150

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 151

```text
        directory_path = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'analog')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 152

```text
        if not os.path.isfile(os.path.join(directory_path, filename)):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 153

```text
            return jsonify({'error': 'File not found'}), 404
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 154

```text
        return send_from_directory(directory_path, filename, as_attachment=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 156

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 157

```text
        current_app.logger.error(f"Error downloading Parylene file: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 158

```text
        return jsonify({'error': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 163

```text
def log_historical_particle_data(room_name, sensor_number, timestamp, raw_measurements, converted_values):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 164

```text
    """Log particle sensor data to CSV file for historical tracking"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 165

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 167

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 168

```text
        filename = f"{sensor_id}_historical.csv"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 169

```text
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 172

```text
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 175

```text
        file_exists = os.path.exists(filepath)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 177

```text
        with open(filepath, 'a', newline='') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 178

```text
            writer = csv.writer(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 181

```text
            if not file_exists:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 182

```text
                headers = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 183

```text
                    'timestamp',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 184

```text
                    'timestamp_iso',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 185

```text
                    'room_name',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 186

```text
                    'sensor_number',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 188

```text
                    'mass_pm1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 189

```text
                    'mass_pm2_5',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 190

```text
                    'mass_pm4',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 191

```text
                    'mass_pm10',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 192

```text
                    'num_pm0_5_ft3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 193

```text
                    'num_pm1_ft3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 194

```text
                    'num_pm2_5_ft3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 195

```text
                    'num_pm4_ft3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 196

```text
                    'num_pm10_ft3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 197

```text
                    'typical_particle_size_um',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 199

```text
                    'num_pm0_5_ft3_dup',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
                    'num_pm1_ft3_dup',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 201

```text
                    'num_pm2_5_ft3_dup',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 202

```text
                    'num_pm4_ft3_dup',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 203

```text
                    'num_pm10_ft3_dup',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 205

```text
                    'bin_0_3_to_0_5',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
                    'bin_0_5_to_1_0',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 207

```text
                    'bin_1_0_to_2_5',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 208

```text
                    'bin_2_5_to_4_0',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 209

```text
                    'bin_4_0_to_10',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 211

```text
                    'mass_pm1_ug_m3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 212

```text
                    'mass_pm2_5_ug_m3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 213

```text
                    'mass_pm4_ug_m3',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 214

```text
                    'mass_pm10_ug_m3'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 215

```text
                ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 216

```text
                writer.writerow(headers)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 219

```text
            number_concentrations = converted_values.get('number_concentrations_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 220

```text
            differential_bins = converted_values.get('differential_bins_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 221

```text
            mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 224

```text
            row_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 225

```text
                timestamp.timestamp(),  # Unix timestamp
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 226

```text
                timestamp.isoformat(),  # ISO format timestamp
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 227

```text
                room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 228

```text
                sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 230

```text
                raw_measurements.get('mass_pm1'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 231

```text
                raw_measurements.get('mass_pm2_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 232

```text
                raw_measurements.get('mass_pm4'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 233

```text
                raw_measurements.get('mass_pm10'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 235

```text
                number_concentrations.get('pm0_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 236

```text
                number_concentrations.get('pm1'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 237

```text
                number_concentrations.get('pm2_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 238

```text
                number_concentrations.get('pm4'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 239

```text
                number_concentrations.get('pm10'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 240

```text
                raw_measurements.get('typical_particle_size_um'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 242

```text
                number_concentrations.get('pm0_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 243

```text
                number_concentrations.get('pm1'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 244

```text
                number_concentrations.get('pm2_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 245

```text
                number_concentrations.get('pm4'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 246

```text
                number_concentrations.get('pm10'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 248

```text
                differential_bins.get('bin_0_3_to_0_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 249

```text
                differential_bins.get('bin_0_5_to_1_0'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 250

```text
                differential_bins.get('bin_1_0_to_2_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 251

```text
                differential_bins.get('bin_2_5_to_4_0'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 252

```text
                differential_bins.get('bin_4_0_to_10'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 254

```text
                mass_concentrations.get('pm1'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 255

```text
                mass_concentrations.get('pm2_5'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 256

```text
                mass_concentrations.get('pm4'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 257

```text
                mass_concentrations.get('pm10')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 258

```text
            ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 259

```text
            writer.writerow(row_data)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 261

```text
        current_app.logger.info(f"Logged historical particle data to {filepath}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 263

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 264

```text
        current_app.logger.error(f"Error logging historical particle data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 268

```text
def handle_csv_batch():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 269

```text
    """Handle CSV batch data from Raspberry Pi"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 270

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 271

```text
        csv_content = request.data.decode('utf-8')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 274

```text
        session_id = request.headers.get('X-Session-ID')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 275

```text
        batch_number = request.headers.get('X-Batch-Number')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 276

```text
        total_batches = request.headers.get('X-Total-Batches')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 277

```text
        is_final_batch = request.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 279

```text
        if not session_id or not batch_number or not total_batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 280

```text
            return jsonify({'status': 'error', 'message': 'Missing headers'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 282

```text
        batch_number = int(batch_number)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 283

```text
        total_batches = int(total_batches)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 286

```text
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 287

```text
        os.makedirs(temp_dir, exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 289

```text
        batch_file = os.path.join(temp_dir, f'batch_{batch_number:04d}.csv')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 290

```text
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 291

```text
        if not os.path.exists(start_time_file):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 292

```text
            with open(start_time_file, 'w') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 293

```text
                f.write(datetime.now().strftime('%Y%m%d%H%M%S'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 295

```text
        with open(batch_file, 'w', encoding='utf-8') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 296

```text
            f.write(csv_content)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 299

```text
        received_batches = len([f for f in os.listdir(temp_dir) if f.startswith('batch_')])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 301

```text
        if received_batches == total_batches or is_final_batch:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 302

```text
            current_app.logger.info(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 303

```text
            combine_csv_batches_final(session_id, cleanup=False)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 305

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 306

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 307

```text
            'message': f'Batch {batch_number}/{total_batches} received',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 308

```text
            'session_id': session_id
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 309

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 311

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 312

```text
        current_app.logger.error(f"Error processing CSV batch: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 313

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 316

```text
def combine_csv_batches_final(session_id, cleanup=True):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 317

```text
    """Combine all CSV batches for a session from disk"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 318

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 319

```text
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 320

```text
        if not os.path.exists(temp_dir):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 321

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 323

```text
        batches = sorted([f for f in os.listdir(temp_dir) if f.startswith('batch_')])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 325

```text
        if not batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 326

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 329

```text
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 330

```text
        if os.path.exists(start_time_file):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 331

```text
            with open(start_time_file, 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 332

```text
                timestamp = f.read().strip()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 333

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 334

```text
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 337

```text
        combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 338

```text
        combined_filepath = os.path.join(
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 339

```text
            current_app.config['LOG_DATA_DIR'],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 340

```text
            'Paralyne',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 341

```text
            'analog',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 342

```text
            combined_filename
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 343

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 345

```text
        os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 348

```text
        with open(combined_filepath, 'w', newline='', encoding='utf-8') as combined_file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 349

```text
            combined_file.write("timestamp,pressure,vapor,temp\n")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 351

```text
            for batch_filename in batches:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 352

```text
                batch_filepath = os.path.join(temp_dir, batch_filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 353

```text
                with open(batch_filepath, 'r', encoding='utf-8') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 354

```text
                    batch_content = f.read()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 356

```text
                lines = batch_content.strip().split('\n')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 359

```text
                if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 360

```text
                    lines = lines[1:]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 362

```text
                for line in lines:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 363

```text
                    if line.strip():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 364

```text
                        combined_file.write(line.strip() + '\n')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 366

```text
        current_app.logger.info(f"Combined CSV created: {combined_filepath}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 369

```text
        if cleanup and os.path.exists(temp_dir):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 370

```text
            shutil.rmtree(temp_dir)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 372

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 373

```text
        current_app.logger.error(f"Error combining CSV batches: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 376

```text
@api_bp.route('/particle-data', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 377

```text
def receive_particle_data():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 378

```text
    """Receive particle sensor data from Pico sensors and store the most recent values"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 379

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 381

```text
        if not request.is_json:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 382

```text
            return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 383

```text
                'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 384

```text
                'message': 'Content-Type must be application/json'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 385

```text
            }), 400
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 387

```text
        data = request.get_json()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 390

```text
        required_fields = ['room_name', 'sensor_number', 'timestamp']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 391

```text
        for field in required_fields:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 392

```text
            if field not in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 393

```text
                return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 394

```text
                    'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 395

```text
                    'message': f'Missing required field: {field}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 396

```text
                }), 400
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 399

```text
        room_name = data['room_name']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 400

```text
        sensor_number = data['sensor_number']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 403

```text
        timestamp_value = data['timestamp']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 404

```text
        if isinstance(timestamp_value, (int, float)):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 406

```text
            sensor_timestamp = datetime.fromtimestamp(timestamp_value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 407

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 409

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 410

```text
                sensor_timestamp = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 411

```text
            except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 412

```text
                sensor_timestamp = datetime.utcnow()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 415

```text
        raw_measurements = data.get('raw_measurements', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 416

```text
        converted_values = data.get('converted_values', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 417

```text
        number_concentrations = converted_values.get('number_concentrations_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 418

```text
        differential_bins = converted_values.get('differential_bins_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 419

```text
        mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 422

```text
        log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 423

```text
                                   raw_measurements, converted_values)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 426

```text
        existing_record = ParticleSensorData.query.filter_by(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 427

```text
            room_name=room_name,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 428

```text
            sensor_number=sensor_number
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 429

```text
        ).first()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 431

```text
        if existing_record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 433

```text
            existing_record.timestamp = sensor_timestamp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 434

```text
            existing_record.last_updated = datetime.utcnow()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 437

```text
            existing_record.mass_pm1 = raw_measurements.get('mass_pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 438

```text
            existing_record.mass_pm2_5 = raw_measurements.get('mass_pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 439

```text
            existing_record.mass_pm4 = raw_measurements.get('mass_pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 440

```text
            existing_record.mass_pm10 = raw_measurements.get('mass_pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 441

```text
            existing_record.num_pm0_5 = raw_measurements.get('num_pm0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 442

```text
            existing_record.num_pm1 = raw_measurements.get('num_pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 443

```text
            existing_record.num_pm2_5 = raw_measurements.get('num_pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 444

```text
            existing_record.num_pm4 = raw_measurements.get('num_pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 445

```text
            existing_record.num_pm10 = raw_measurements.get('num_pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 446

```text
            existing_record.typical_particle_size_um = raw_measurements.get('typical_particle_size_um')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 449

```text
            existing_record.num_pm0_5_ft3 = number_concentrations.get('pm0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 450

```text
            existing_record.num_pm1_ft3 = number_concentrations.get('pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 451

```text
            existing_record.num_pm2_5_ft3 = number_concentrations.get('pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 452

```text
            existing_record.num_pm4_ft3 = number_concentrations.get('pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 453

```text
            existing_record.num_pm10_ft3 = number_concentrations.get('pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 456

```text
            existing_record.bin_0_3_to_0_5 = differential_bins.get('bin_0_3_to_0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 457

```text
            existing_record.bin_0_5_to_1_0 = differential_bins.get('bin_0_5_to_1_0')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 458

```text
            existing_record.bin_1_0_to_2_5 = differential_bins.get('bin_1_0_to_2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 459

```text
            existing_record.bin_2_5_to_4_0 = differential_bins.get('bin_2_5_to_4_0')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 460

```text
            existing_record.bin_4_0_to_10 = differential_bins.get('bin_4_0_to_10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 463

```text
            existing_record.mass_pm1_ug_m3 = mass_concentrations.get('pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 464

```text
            existing_record.mass_pm2_5_ug_m3 = mass_concentrations.get('pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 465

```text
            existing_record.mass_pm4_ug_m3 = mass_concentrations.get('pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 466

```text
            existing_record.mass_pm10_ug_m3 = mass_concentrations.get('pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 468

```text
            current_app.logger.info(f"Updated particle data for {room_name}/{sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 470

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 472

```text
            new_record = ParticleSensorData(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 473

```text
                room_name=room_name,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 474

```text
                sensor_number=sensor_number,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 475

```text
                timestamp=sensor_timestamp,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 476

```text
                last_updated=datetime.utcnow(),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 479

```text
                mass_pm1=raw_measurements.get('mass_pm1'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 480

```text
                mass_pm2_5=raw_measurements.get('mass_pm2_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 481

```text
                mass_pm4=raw_measurements.get('mass_pm4'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 482

```text
                mass_pm10=raw_measurements.get('mass_pm10'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 483

```text
                num_pm0_5=raw_measurements.get('num_pm0_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 484

```text
                num_pm1=raw_measurements.get('num_pm1'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 485

```text
                num_pm2_5=raw_measurements.get('num_pm2_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 486

```text
                num_pm4=raw_measurements.get('num_pm4'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 487

```text
                num_pm10=raw_measurements.get('num_pm10'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 488

```text
                typical_particle_size_um=raw_measurements.get('typical_particle_size_um'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 491

```text
                num_pm0_5_ft3=number_concentrations.get('pm0_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 492

```text
                num_pm1_ft3=number_concentrations.get('pm1'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 493

```text
                num_pm2_5_ft3=number_concentrations.get('pm2_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 494

```text
                num_pm4_ft3=number_concentrations.get('pm4'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 495

```text
                num_pm10_ft3=number_concentrations.get('pm10'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 498

```text
                bin_0_3_to_0_5=differential_bins.get('bin_0_3_to_0_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 499

```text
                bin_0_5_to_1_0=differential_bins.get('bin_0_5_to_1_0'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 500

```text
                bin_1_0_to_2_5=differential_bins.get('bin_1_0_to_2_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 501

```text
                bin_2_5_to_4_0=differential_bins.get('bin_2_5_to_4_0'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 502

```text
                bin_4_0_to_10=differential_bins.get('bin_4_0_to_10'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 505

```text
                mass_pm1_ug_m3=mass_concentrations.get('pm1'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 506

```text
                mass_pm2_5_ug_m3=mass_concentrations.get('pm2_5'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 507

```text
                mass_pm4_ug_m3=mass_concentrations.get('pm4'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 508

```text
                mass_pm10_ug_m3=mass_concentrations.get('pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 509

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 511

```text
            db.session.add(new_record)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 512

```text
            current_app.logger.info(f"Created new particle data record for {room_name}/{sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 515

```text
        db.session.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 517

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 518

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
            'message': f'Particle data received for sensor {sensor_number} in {room_name}',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 520

```text
            'sensor_id': f"{room_name}/{sensor_number}",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 521

```text
            'timestamp': sensor_timestamp.isoformat()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 522

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 524

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 526

```text
        db.session.rollback()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 527

```text
        current_app.logger.error(f"Error processing particle sensor data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 528

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 529

```text
            'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 530

```text
            'message': f'Error processing data: {str(e)}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 531

```text
        }), 500
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 534

```text
@api_bp.route('/particle-data', methods=['GET'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 535

```text
def get_particle_data():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 536

```text
    """Get current particle sensor data for all sensors or a specific sensor.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 537

```text
    If both room_name and sensor_number are provided, returns historical CSV data."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 538

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 540

```text
        room_name = request.args.get('room_name')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 541

```text
        sensor_number = request.args.get('sensor_number')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 544

```text
        if room_name and sensor_number:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 545

```text
            return get_historical_csv_data(room_name, sensor_number)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 548

```text
        query = ParticleSensorData.query
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 550

```text
        if room_name:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 551

```text
            query = query.filter_by(room_name=room_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 553

```text
        if sensor_number:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 554

```text
            query = query.filter_by(sensor_number=sensor_number)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 557

```text
        sensors = query.all()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 560

```text
        sensor_data = [sensor.to_dict() for sensor in sensors]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 562

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 563

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 564

```text
            'count': len(sensor_data),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 565

```text
            'sensors': sensor_data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 566

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 568

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 569

```text
        current_app.logger.error(f"Error retrieving particle sensor data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 570

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 571

```text
            'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 572

```text
            'message': f'Error retrieving data: {str(e)}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 573

```text
        }), 500
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 576

```text
def get_historical_csv_data(room_name, sensor_number):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 577

```text
    """Return historical CSV data for a specific sensor"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 578

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 580

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 581

```text
        filename = f"{sensor_id}_historical.csv"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 582

```text
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 585

```text
        if not os.path.exists(filepath):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 586

```text
            return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 587

```text
                'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 588

```text
                'message': f'No historical data found for sensor {sensor_number} in {room_name}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 589

```text
            }), 404
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 592

```text
        historical_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 593

```text
        with open(filepath, 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 594

```text
            reader = csv.DictReader(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 595

```text
            for row in reader:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 597

```text
                processed_row = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 598

```text
                for key, value in row.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 599

```text
                    if value == '' or value is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 600

```text
                        processed_row[key] = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 601

```text
                    elif key in ['timestamp', 'timestamp_iso', 'room_name', 'sensor_number']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 602

```text
                        processed_row[key] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 603

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 604

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 605

```text
                            processed_row[key] = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 606

```text
                        except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 607

```text
                            processed_row[key] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 608

```text
                historical_data.append(processed_row)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 610

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 611

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 612

```text
            'room_name': room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 613

```text
            'sensor_number': sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 614

```text
            'data_source': 'historical_csv',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 615

```text
            'record_count': len(historical_data),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 616

```text
            'historical_data': historical_data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 617

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 619

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 620

```text
        current_app.logger.error(f"Error retrieving historical CSV data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 621

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 622

```text
            'status': 'error',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 623

```text
            'message': f'Error reading historical data: {str(e)}'
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 624

```text
        }), 500
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 631

```text
SENSOR_CSV_HEADER = (
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 632

```text
    "timestamp,temperature_c,humidity_pct,"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 633

```text
    "mass_pm1,mass_pm2_5,mass_pm4,mass_pm10,"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 634

```text
    "num_pm0_5_ft3,num_pm1_ft3,num_pm2_5_ft3,num_pm4_ft3,num_pm10_ft3,"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 635

```text
    "typical_particle_size_um\n"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 636

```text
)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 639

```text
def _sensor_csv_path(room_name, sensor_number):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 640

```text
    """Return the path to the per-sensor combined CSV, creating dirs as needed."""
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 641

```text
    sensor_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'sensors')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 642

```text
    os.makedirs(sensor_dir, exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 643

```text
    safe_name = "{}_{}_combined.csv".format(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 644

```text
        room_name.replace("/", "_"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 645

```text
        sensor_number.replace("/", "_"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 646

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 647

```text
    return os.path.join(sensor_dir, safe_name)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 650

```text
@api_bp.route('/sensor-data', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 651

```text
def sensor_data_post():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 652

```text
    """Accept combined particle + environmental sensor data and append to CSV."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 653

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 654

```text
        data = request.get_json(force=True)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 655

```text
        if not data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 656

```text
            return jsonify({'error': 'No JSON body'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 658

```text
        room_name = data.get('room_name')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 659

```text
        sensor_number = data.get('sensor_number')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 660

```text
        if not room_name or not sensor_number:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 661

```text
            return jsonify({'error': 'room_name and sensor_number required'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 664

```text
        timestamp = data.get('timestamp')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 665

```text
        if timestamp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 666

```text
            ts_str = datetime.fromtimestamp(float(timestamp)).strftime('%Y-%m-%d %H:%M:%S')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 667

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 668

```text
            ts_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 671

```text
        temperature_c = data.get('temperature_c', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 672

```text
        humidity_pct = data.get('humidity_pct', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 675

```text
        raw = data.get('raw_measurements', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 676

```text
        converted = data.get('converted_values', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 677

```text
        conc_ft3 = converted.get('number_concentrations_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 679

```text
        mass_pm1 = raw.get('mass_pm1', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 680

```text
        mass_pm2_5 = raw.get('mass_pm2_5', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 681

```text
        mass_pm4 = raw.get('mass_pm4', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 682

```text
        mass_pm10 = raw.get('mass_pm10', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 683

```text
        num_pm0_5_ft3 = conc_ft3.get('pm0_5', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 684

```text
        num_pm1_ft3 = conc_ft3.get('pm1', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 685

```text
        num_pm2_5_ft3 = conc_ft3.get('pm2_5', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 686

```text
        num_pm4_ft3 = conc_ft3.get('pm4', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 687

```text
        num_pm10_ft3 = conc_ft3.get('pm10', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 688

```text
        tps_um = raw.get('typical_particle_size_um', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 690

```text
        sensor_dt = datetime.fromtimestamp(float(timestamp)) if timestamp else datetime.now()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 693

```text
        if raw:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 694

```text
            log_historical_particle_data(room_name, sensor_number, sensor_dt, raw, converted)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 697

```text
        if temperature_c != '' and humidity_pct != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 698

```text
            sensor_id = '{}_{}'.format(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 699

```text
                room_name.replace('/', '_'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 700

```text
                sensor_number.replace('/', '_'),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 701

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 702

```text
            env_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 703

```text
            os.makedirs(env_dir, exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 704

```text
            env_path = os.path.join(env_dir, '{}_historical.csv'.format(sensor_id))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 705

```text
            env_file_exists = os.path.exists(env_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 706

```text
            with open(env_path, 'a', newline='') as ef:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 707

```text
                env_writer = csv.writer(ef)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 708

```text
                if not env_file_exists:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 709

```text
                    env_writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 710

```text
                                         'sensor_number', 'temperature_c', 'humidity_pct'])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 711

```text
                env_writer.writerow([sensor_dt.timestamp(), sensor_dt.isoformat(),
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 712

```text
                                     room_name, sensor_number, temperature_c, humidity_pct])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 715

```text
        if raw:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 716

```text
            diff = converted.get('differential_bins_ft3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 717

```text
            mass_conc = converted.get('mass_concentrations_ug_m3', {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 719

```text
            record = ParticleSensorData.query.filter_by(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 720

```text
                room_name=room_name, sensor_number=sensor_number
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 721

```text
            ).first()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 723

```text
            if record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 724

```text
                record.timestamp = sensor_dt
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 725

```text
                record.last_updated = datetime.utcnow()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 726

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 727

```text
                record = ParticleSensorData(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 728

```text
                    room_name=room_name,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 729

```text
                    sensor_number=sensor_number,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 730

```text
                    timestamp=sensor_dt,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 731

```text
                    last_updated=datetime.utcnow(),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 732

```text
                )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 733

```text
                db.session.add(record)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 735

```text
            record.mass_pm1 = raw.get('mass_pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 736

```text
            record.mass_pm2_5 = raw.get('mass_pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 737

```text
            record.mass_pm4 = raw.get('mass_pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 738

```text
            record.mass_pm10 = raw.get('mass_pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 739

```text
            record.num_pm0_5 = raw.get('num_pm0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 740

```text
            record.num_pm1 = raw.get('num_pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 741

```text
            record.num_pm2_5 = raw.get('num_pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 742

```text
            record.num_pm4 = raw.get('num_pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 743

```text
            record.num_pm10 = raw.get('num_pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 744

```text
            record.typical_particle_size_um = raw.get('typical_particle_size_um')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 745

```text
            record.num_pm0_5_ft3 = conc_ft3.get('pm0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 746

```text
            record.num_pm1_ft3 = conc_ft3.get('pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 747

```text
            record.num_pm2_5_ft3 = conc_ft3.get('pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 748

```text
            record.num_pm4_ft3 = conc_ft3.get('pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 749

```text
            record.num_pm10_ft3 = conc_ft3.get('pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 750

```text
            record.bin_0_3_to_0_5 = diff.get('bin_0_3_to_0_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 751

```text
            record.bin_0_5_to_1_0 = diff.get('bin_0_5_to_1_0')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 752

```text
            record.bin_1_0_to_2_5 = diff.get('bin_1_0_to_2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 753

```text
            record.bin_2_5_to_4_0 = diff.get('bin_2_5_to_4_0')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 754

```text
            record.bin_4_0_to_10 = diff.get('bin_4_0_to_10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 755

```text
            record.mass_pm1_ug_m3 = mass_conc.get('pm1')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 756

```text
            record.mass_pm2_5_ug_m3 = mass_conc.get('pm2_5')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 757

```text
            record.mass_pm4_ug_m3 = mass_conc.get('pm4')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 758

```text
            record.mass_pm10_ug_m3 = mass_conc.get('pm10')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 760

```text
            if temperature_c != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 761

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 762

```text
                    record.temperature_c = float(temperature_c)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 763

```text
                except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 764

```text
                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 765

```text
            if humidity_pct != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 766

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 767

```text
                    record.humidity_pct = float(humidity_pct)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 768

```text
                except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 769

```text
                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 771

```text
            db.session.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 773

```text
        current_app.logger.info(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 774

```text
            f"Sensor data: {room_name}/{sensor_number} — "
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 775

```text
            f"temp={temperature_c} hum={humidity_pct} pm2.5={mass_pm2_5}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 776

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 778

```text
        return jsonify({'status': 'success'}), 200
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 780

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 781

```text
        db.session.rollback()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 782

```text
        current_app.logger.error(f"Error processing sensor data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 783

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 786

```text
@api_bp.route('/sensor-data', methods=['GET'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 787

```text
def sensor_data_get():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 788

```text
    """Return historical combined sensor data as JSON.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 789

```text
    Query params: room_name, sensor_number (both required)."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 790

```text
    room_name = request.args.get('room_name')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 791

```text
    sensor_number = request.args.get('sensor_number')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 793

```text
    if not room_name or not sensor_number:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 794

```text
        return jsonify({'error': 'room_name and sensor_number query params required'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 796

```text
    csv_path = _sensor_csv_path(room_name, sensor_number)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 798

```text
    if not os.path.exists(csv_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 799

```text
        return jsonify({'error': 'No data found for this sensor'}), 404
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 801

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 802

```text
        rows = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 803

```text
        with open(csv_path, 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 804

```text
            reader = csv.DictReader(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 805

```text
            for row in reader:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 806

```text
                rows.append(row)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 808

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 809

```text
            'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 810

```text
            'room_name': room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 811

```text
            'sensor_number': sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 812

```text
            'count': len(rows),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 813

```text
            'data': rows,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 814

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 816

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 817

```text
        current_app.logger.error(f"Error reading sensor data: {e}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 818

```text
        return jsonify({'error': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 821

```text
@api_bp.route('/env-data', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 822

```text
def receive_env_data():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 823

```text
    """Receive temperature/humidity data from DHT22 sensors on Pico W."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 824

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 825

```text
        if not request.is_json:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 826

```text
            return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 828

```text
        data = request.get_json()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 830

```text
        for field in ('room_name', 'sensor_number', 'timestamp', 'temperature_c', 'humidity_pct'):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 831

```text
            if field not in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 832

```text
                return jsonify({'status': 'error', 'message': f'Missing field: {field}'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 834

```text
        room_name     = data['room_name']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 835

```text
        sensor_number = data['sensor_number']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 836

```text
        temperature_c = float(data['temperature_c'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 837

```text
        humidity_pct  = float(data['humidity_pct'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 839

```text
        ts = data['timestamp']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 840

```text
        if isinstance(ts, (int, float)):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 841

```text
            sensor_timestamp = datetime.fromtimestamp(ts)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 842

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 843

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 844

```text
                sensor_timestamp = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 845

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 846

```text
                sensor_timestamp = datetime.utcnow()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 849

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 850

```text
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 851

```text
                                 f"{sensor_id}_historical.csv")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 852

```text
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 854

```text
        file_exists = os.path.exists(filepath)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 855

```text
        with open(filepath, 'a', newline='') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 856

```text
            import csv as _csv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 857

```text
            writer = _csv.writer(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 858

```text
            if not file_exists:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 859

```text
                writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 860

```text
                                 'sensor_number', 'temperature_c', 'humidity_pct'])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 861

```text
            writer.writerow([sensor_timestamp.timestamp(), sensor_timestamp.isoformat(),
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 862

```text
                             room_name, sensor_number, temperature_c, humidity_pct])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 864

```text
        current_app.logger.info(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 865

```text
            f"env-data: {room_name}/{sensor_number} "
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 866

```text
            f"temp={temperature_c:.1f}°C  humidity={humidity_pct:.1f}%"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 867

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 869

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 870

```text
            'status':        'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 871

```text
            'room_name':     room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 872

```text
            'sensor_number': sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 873

```text
            'temperature_c': temperature_c,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 874

```text
            'humidity_pct':  humidity_pct,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 875

```text
            'timestamp':     sensor_timestamp.isoformat(),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 876

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 878

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 879

```text
        current_app.logger.error(f"Error processing env data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 880

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 883

```text
@api_bp.route('/env-data', methods=['GET'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 884

```text
def get_env_data():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 885

```text
    """Return historical CSV data for a temperature/humidity sensor."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 886

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 887

```text
        room_name     = request.args.get('room_name', '')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 888

```text
        sensor_number = request.args.get('sensor_number', '')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 890

```text
        if not room_name or not sensor_number:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 891

```text
            return jsonify({'status': 'error', 'message': 'room_name and sensor_number required'}), 400
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 893

```text
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 894

```text
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 895

```text
                                 f"{sensor_id}_historical.csv")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 897

```text
        if not os.path.exists(filepath):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 898

```text
            return jsonify({'status': 'error', 'message': 'No data found for this sensor'}), 404
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 900

```text
        import csv as _csv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 901

```text
        rows = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 902

```text
        with open(filepath, 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 903

```text
            for row in _csv.DictReader(f):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 904

```text
                for key in ('temperature_c', 'humidity_pct', 'timestamp'):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 905

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 906

```text
                        row[key] = float(row[key])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 907

```text
                    except (ValueError, KeyError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 908

```text
                        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 909

```text
                rows.append(row)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 911

```text
        return jsonify({
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 912

```text
            'status':        'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 913

```text
            'room_name':     room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 914

```text
            'sensor_number': sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 915

```text
            'record_count':  len(rows),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 916

```text
            'data':          rows,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 917

```text
        }), 200
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 919

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 920

```text
        current_app.logger.error(f"Error retrieving env data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 921

```text
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.



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
