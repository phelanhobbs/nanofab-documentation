

# Source Reconstruction: UNanofabTools/generate_test_particle_data.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `generate_test_particle_data.py`
- Lines read: `294`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `8b3c10e8b5375bb8`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import requests`, `import json`, `import time`, `import random`, `import math`, `from datetime import datetime, timedelta`, `import urllib3`
- Classes: `ParticleDataGenerator`
- Functions: `main`, `__init__`, `generate_realistic_data`, `send_data`, `generate_historical_batch`, `generate_realtime_stream`
- Routes: none detected

## Sanitized Source Excerpt

```python
#!/usr/bin/env python3
"""
Particle Data Generator
Generates realistic particle sensor data and sends it to the API for testing purposes.
Creates data with natural variation and trends that follow realistic air quality patterns.
"""

import requests
import json
import time
import random
import math
from datetime import datetime, timedelta
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ParticleDataGenerator:
    def __init__(self, api_url="http://localhost:5000/particle-data"):
        self.api_url = api_url

        # Define test sensors with their baseline characteristics
        self.sensors = {
            "CLEAN_ROOM_01": {
                "room": "CLEANROOM",
                "sensor": "SENSOR_01",
                "base_pm2_5": 2.0,  # μg/m³ - very clean
                "variation": 0.3
            },
            "CLEAN_ROOM_02": {
                "room": "CLEANROOM",
                "sensor": "SENSOR_02",
                "base_pm2_5": 2.5,  # μg/m³ - very clean
                "variation": 0.4
            },
            "LAB_MAIN": {
                "room": "MAIN_LAB",
                "sensor": "SENSOR_01",
                "base_pm2_5": 8.0,  # μg/m³ - typical lab
                "variation": 2.0
            },
            "LAB_HOOD": {
                "room": "FUME_HOOD_AREA",
                "sensor": "SENSOR_01",
                "base_pm2_5": 15.0,  # μg/m³ - higher activity area
                "variation": 5.0
            },
            "OFFICE": {
                "room": "OFFICE_SPACE",
                "sensor": "SENSOR_01",
                "base_pm2_5": 12.0,  # μg/m³ - office environment
                "variation": 3.0
            }
        }

        # Track state for each sensor (for trends)
        self.sensor_states = {}
        for sensor_id in self.sensors:
            self.sensor_states[sensor_id] = {
                "current_pm2_5": self.sensors[sensor_id]["base_pm2_5"],
                "trend_direction": 0,  # -1 decreasing, 0 stable, +1 increasing
                "trend_duration": 0,
                "last_activity_spike": 0
            }

    def generate_realistic_data(self, sensor_id, timestamp):
        """Generate realistic particle data for a sensor"""
        sensor_config = self.sensors[sensor_id]
        sensor_state = self.sensor_states[sensor_id]

        # Apply trends and natural variation
        base_pm2_5 = sensor_config["base_pm2_5"]
        variation = sensor_config["variation"]

        # Trend logic - sensors drift slowly over time
        if sensor_state["trend_duration"] <= 0:
            # Start a new trend
            sensor_state["trend_direction"] = random.choice([-1, 0, 0, 1])  # bias toward stable
            sensor_state["trend_duration"] = random.randint(5, 15)  # 5-15 readings

        # Apply trend
        trend_change = sensor_state["trend_direction"] * variation * 0.1
        sensor_state["current_pm2_5"] += trend_change
        sensor_state["trend_duration"] -= 1

        # Keep within reasonable bounds
        min_pm2_5 = max(0.1, base_pm2_5 * 0.2)
        max_pm2_5 = base_pm2_5 * 3.0
        sensor_state["current_pm2_5"] = max(min_pm2_5, min(max_pm2_5, sensor_state["current_pm2_5"]))

        # Add random variation
        pm2_5_variation = random.gauss(0, variation * 0.3)
        current_pm2_5 = max(0.01, sensor_state["current_pm2_5"] + pm2_5_variation)

        # Occasional activity spikes (5% chance)
        if random.random() < 0.05:
            spike_multiplier = random.uniform(1.5, 4.0)
            current_pm2_5 *= spike_multiplier
            sensor_state["last_activity_spike"] = 3  # effects last 3 readings
        elif sensor_state["last_activity_spike"] > 0:
            # Gradual return to normal after spike
            current_pm2_5 *= (1.0 + 0.3 * sensor_state["last_activity_spike"])
            sensor_state["last_activity_spike"] -= 1

        # Generate other PM values based on realistic relationships
        # Generally: PM1 < PM2.5 < PM4 < PM10
        pm1_ug_m3 = current_pm2_5 * random.uniform(0.6, 0.8)
        pm4_ug_m3 = current_pm2_5 * random.uniform(1.1, 1.4)
        pm10_ug_m3 = pm4_ug_m3 * random.uniform(1.1, 1.6)

        # Raw mass measurements (different units/scale)
        mass_pm1 = pm1_ug_m3 * random.uniform(0.08, 0.12)
        mass_pm2_5 = current_pm2_5 * random.uniform(0.08, 0.12)
        mass_pm4 = pm4_ug_m3 * random.uniform(0.08, 0.12)
        mass_pm10 = pm10_ug_m3 * random.uniform(0.08, 0.12)

        # Particle counts (higher for smaller particles)
        base_count = current_pm2_5 * random.uniform(15, 25)
        num_pm0_5 = base_count * random.uniform(4, 6)
        num_pm1 = base_count * random.uniform(3, 4)
        num_pm2_5 = base_count * random.uniform(2, 3)
        num_pm4 = base_count * random.uniform(1.5, 2)
        num_pm10 = base_count * random.uniform(0.8, 1.2)

        # Converted ft³ concentrations
        ft3_factor = random.uniform(25, 35)
        num_pm0_5_ft3 = num_pm0_5 * ft3_factor
        num_pm1_ft3 = num_pm1 * ft3_factor
        num_pm2_5_ft3 = num_pm2_5 * ft3_factor
        num_pm4_ft3 = num_pm4 * ft3_factor
        num_pm10_ft3 = num_pm10 * ft3_factor

        # Differential bins (most particles in smallest bin)
        total_large = num_pm1_ft3 + num_pm2_5_ft3 + num_pm4_ft3 + num_pm10_ft3
        bin_0_3_to_0_5 = num_pm0_5_ft3
        bin_0_5_to_1_0 = random.uniform(0, total_large * 0.1)
        bin_1_0_to_2_5 = random.uniform(0, total_large * 0.05)
        bin_2_5_to_4_0 = random.uniform(0, total_large * 0.03)
        bin_4_0_to_10 = random.uniform(0, total_large * 0.02)

        # Typical particle size
        typical_size = random.uniform(0.3, 0.8)

        # Build the data structure
        data = {
            "room_name": sensor_config["room"],
            "sensor_number": sensor_config["sensor"],
            "timestamp": timestamp,
            "raw_measurements": {
                "mass_pm1": round(mass_pm1, 4),
                "mass_pm2_5": round(mass_pm2_5, 4),
                "mass_pm4": round(mass_pm4, 4),
                "mass_pm10": round(mass_pm10, 4),
                "num_pm0_5": round(num_pm0_5, 1),
                "num_pm1": round(num_pm1, 1),
                "num_pm2_5": round(num_pm2_5, 1),
                "num_pm4": round(num_pm4, 1),
                "num_pm10": round(num_pm10, 1),
                "typical_particle_size_um": round(typical_size, 2)
            },
            "converted_values": {
                "number_concentrations_ft3": {
                    "pm0_5": round(num_pm0_5_ft3, 2),
                    "pm1": round(num_pm1_ft3, 2),
                    "pm2_5": round(num_pm2_5_ft3, 2),
                    "pm4": round(num_pm4_ft3, 2),
                    "pm10": round(num_pm10_ft3, 2)
                },
                "differential_bins_ft3": {
                    "bin_0_3_to_0_5": round(bin_0_3_to_0_5, 2),
                    "bin_0_5_to_1_0": round(bin_0_5_to_1_0, 2),
                    "bin_1_0_to_2_5": round(bin_1_0_to_2_5, 2),
                    "bin_2_5_to_4_0": round(bin_2_5_to_4_0, 2),
                    "bin_4_0_to_10": round(bin_4_0_to_10, 2)
                },
                "mass_concentrations_ug_m3": {
                    "pm1": round(pm1_ug_m3, 2),
                    "pm2_5": round(current_pm2_5, 2),
                    "pm4": round(pm4_ug_m3, 2),
                    "pm10": round(pm10_ug_m3, 2)
                }
            }
        }

        return data

    def send_data(self, data):
        """Send data to the API"""
        try:
            response = requests.post(
                self.api_url,
                headers={"Content-Type": "application/json"},
                json=data,
                verify=False,
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                print(f"✓ Sent data for {data['room_name']}/{data['sensor_number']} - PM2.5: {data['converted_values']['mass_concentrations_ug_m3']['pm2_5']} μg/m³")
                return True
            else:
                print(f"✗ Error {response.status_code}: {response.text}")
                return False

        except Exception as e:
            print(f"✗ Failed to send data: {e}")
            return False

    def generate_historical_batch(self, hours_back=24, interval_minutes=10):
        """Generate a batch of historical data"""
        print(f"Generating {hours_back} hours of historical data with {interval_minutes}-minute intervals...")

        # Calculate timestamps
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours_back)
        current_time = start_time

        total_points = 0
        successful_points = 0

        while current_time <= end_time:
            timestamp = int(current_time.timestamp())

            # Send data for each sensor
            for sensor_id in self.sensors:
                data = self.generate_realistic_data(sensor_id, timestamp)

                if self.send_data(data):
                    successful_points += 1
                total_points += 1

                # Small delay to avoid overwhelming the server
                time.sleep(0.1)

            current_time += timedelta(minutes=interval_minutes)

        print(f"\nCompleted: {successful_points}/{total_points} data points sent successfully")

    def generate_realtime_stream(self, interval_seconds=30):
        """Generate real-time data stream"""
        print(f"Starting real-time data generation (every {interval_seconds} seconds)")
        print("Press Ctrl+C to stop")

        try:
            while True:
                timestamp = int(datetime.now().timestamp())

                # Send data for each sensor
                for sensor_id in self.sensors:
                    data = self.generate_realistic_data(sensor_id, timestamp)
                    self.send_data(data)
                    time.sleep(0.2)  # Small delay between sensors

                print(f"Waiting {interval_seconds} seconds...")
                time.sleep(interval_seconds)

        except KeyboardInterrupt:
            print("\nStopped real-time generation")

def main():
    generator = ParticleDataGenerator()

    print("Particle Data Generator")
    print("=" * 50)
    print("1. Generate historical data (24 hours)")
    print("2. Generate real-time stream")
    print("3. Send single test batch")
    print("4. Custom historical range")

    choice = input("\nSelect option (1-4): ").strip()

    if choice == "1":
        generator.generate_historical_batch(hours_back=24, interval_minutes=10)
    elif choice == "2":
        generator.generate_realtime_stream(interval_seconds=30)
    elif choice == "3":
        timestamp = int(datetime.now().timestamp())
        for sensor_id in generator.sensors:
            data = generator.generate_realistic_data(sensor_id, timestamp)
            generator.send_data(data)
    elif choice == "4":
        try:
            hours = int(input("Hours of data to generate: "))
            interval = int(input("Interval in minutes: "))
            generator.generate_historical_batch(hours_back=hours, interval_minutes=interval)
        except ValueError:
            print("Invalid input")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main()
```

## Line-By-Line Reconstruction Notes

### Line 2

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 3

```text
Particle Data Generator
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 4

```text
Generates realistic particle sensor data and sends it to the API for testing purposes.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 5

```text
Creates data with natural variation and trends that follow realistic air quality patterns.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 6

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 8

```text
import requests
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 9

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
import time
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 11

```text
import random
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
import math
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 13

```text
from datetime import datetime, timedelta
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 14

```text
import urllib3
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 17

```text
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 19

```text
class ParticleDataGenerator:
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 20

```text
    def __init__(self, api_url="http://localhost:5000/particle-data"):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 21

```text
        self.api_url = api_url
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 24

```text
        self.sensors = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 25

```text
            "CLEAN_ROOM_01": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 26

```text
                "room": "CLEANROOM",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 27

```text
                "sensor": "SENSOR_01",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 28

```text
                "base_pm2_5": 2.0,  # μg/m³ - very clean
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 29

```text
                "variation": 0.3
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 30

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 31

```text
            "CLEAN_ROOM_02": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 32

```text
                "room": "CLEANROOM",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 33

```text
                "sensor": "SENSOR_02",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 34

```text
                "base_pm2_5": 2.5,  # μg/m³ - very clean
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 35

```text
                "variation": 0.4
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 36

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 37

```text
            "LAB_MAIN": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 38

```text
                "room": "MAIN_LAB",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 39

```text
                "sensor": "SENSOR_01",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 40

```text
                "base_pm2_5": 8.0,  # μg/m³ - typical lab
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 41

```text
                "variation": 2.0
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 42

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 43

```text
            "LAB_HOOD": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 44

```text
                "room": "FUME_HOOD_AREA",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 45

```text
                "sensor": "SENSOR_01",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 46

```text
                "base_pm2_5": 15.0,  # μg/m³ - higher activity area
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 47

```text
                "variation": 5.0
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 48

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 49

```text
            "OFFICE": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 50

```text
                "room": "OFFICE_SPACE",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 51

```text
                "sensor": "SENSOR_01",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 52

```text
                "base_pm2_5": 12.0,  # μg/m³ - office environment
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 53

```text
                "variation": 3.0
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 54

```text
            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 55

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 58

```text
        self.sensor_states = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 59

```text
        for sensor_id in self.sensors:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 60

```text
            self.sensor_states[sensor_id] = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 61

```text
                "current_pm2_5": self.sensors[sensor_id]["base_pm2_5"],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 62

```text
                "trend_direction": 0,  # -1 decreasing, 0 stable, +1 increasing
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 63

```text
                "trend_duration": 0,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 64

```text
                "last_activity_spike": 0
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 65

```text
            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 67

```text
    def generate_realistic_data(self, sensor_id, timestamp):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 68

```text
        """Generate realistic particle data for a sensor"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
        sensor_config = self.sensors[sensor_id]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 70

```text
        sensor_state = self.sensor_states[sensor_id]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 73

```text
        base_pm2_5 = sensor_config["base_pm2_5"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 74

```text
        variation = sensor_config["variation"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 77

```text
        if sensor_state["trend_duration"] <= 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 79

```text
            sensor_state["trend_direction"] = random.choice([-1, 0, 0, 1])  # bias toward stable
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 80

```text
            sensor_state["trend_duration"] = random.randint(5, 15)  # 5-15 readings
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 83

```text
        trend_change = sensor_state["trend_direction"] * variation * 0.1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 84

```text
        sensor_state["current_pm2_5"] += trend_change
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        sensor_state["trend_duration"] -= 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 88

```text
        min_pm2_5 = max(0.1, base_pm2_5 * 0.2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 89

```text
        max_pm2_5 = base_pm2_5 * 3.0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 90

```text
        sensor_state["current_pm2_5"] = max(min_pm2_5, min(max_pm2_5, sensor_state["current_pm2_5"]))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 93

```text
        pm2_5_variation = random.gauss(0, variation * 0.3)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 94

```text
        current_pm2_5 = max(0.01, sensor_state["current_pm2_5"] + pm2_5_variation)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 97

```text
        if random.random() < 0.05:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 98

```text
            spike_multiplier = random.uniform(1.5, 4.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 99

```text
            current_pm2_5 *= spike_multiplier
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 100

```text
            sensor_state["last_activity_spike"] = 3  # effects last 3 readings
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 101

```text
        elif sensor_state["last_activity_spike"] > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 103

```text
            current_pm2_5 *= (1.0 + 0.3 * sensor_state["last_activity_spike"])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 104

```text
            sensor_state["last_activity_spike"] -= 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 108

```text
        pm1_ug_m3 = current_pm2_5 * random.uniform(0.6, 0.8)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 109

```text
        pm4_ug_m3 = current_pm2_5 * random.uniform(1.1, 1.4)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 110

```text
        pm10_ug_m3 = pm4_ug_m3 * random.uniform(1.1, 1.6)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 113

```text
        mass_pm1 = pm1_ug_m3 * random.uniform(0.08, 0.12)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 114

```text
        mass_pm2_5 = current_pm2_5 * random.uniform(0.08, 0.12)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 115

```text
        mass_pm4 = pm4_ug_m3 * random.uniform(0.08, 0.12)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 116

```text
        mass_pm10 = pm10_ug_m3 * random.uniform(0.08, 0.12)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 119

```text
        base_count = current_pm2_5 * random.uniform(15, 25)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 120

```text
        num_pm0_5 = base_count * random.uniform(4, 6)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 121

```text
        num_pm1 = base_count * random.uniform(3, 4)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 122

```text
        num_pm2_5 = base_count * random.uniform(2, 3)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 123

```text
        num_pm4 = base_count * random.uniform(1.5, 2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 124

```text
        num_pm10 = base_count * random.uniform(0.8, 1.2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 127

```text
        ft3_factor = random.uniform(25, 35)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 128

```text
        num_pm0_5_ft3 = num_pm0_5 * ft3_factor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 129

```text
        num_pm1_ft3 = num_pm1 * ft3_factor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 130

```text
        num_pm2_5_ft3 = num_pm2_5 * ft3_factor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 131

```text
        num_pm4_ft3 = num_pm4 * ft3_factor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 132

```text
        num_pm10_ft3 = num_pm10 * ft3_factor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 135

```text
        total_large = num_pm1_ft3 + num_pm2_5_ft3 + num_pm4_ft3 + num_pm10_ft3
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 136

```text
        bin_0_3_to_0_5 = num_pm0_5_ft3
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 137

```text
        bin_0_5_to_1_0 = random.uniform(0, total_large * 0.1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 138

```text
        bin_1_0_to_2_5 = random.uniform(0, total_large * 0.05)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 139

```text
        bin_2_5_to_4_0 = random.uniform(0, total_large * 0.03)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 140

```text
        bin_4_0_to_10 = random.uniform(0, total_large * 0.02)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 143

```text
        typical_size = random.uniform(0.3, 0.8)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 146

```text
        data = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 147

```text
            "room_name": sensor_config["room"],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 148

```text
            "sensor_number": sensor_config["sensor"],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 149

```text
            "timestamp": timestamp,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 150

```text
            "raw_measurements": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 151

```text
                "mass_pm1": round(mass_pm1, 4),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 152

```text
                "mass_pm2_5": round(mass_pm2_5, 4),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 153

```text
                "mass_pm4": round(mass_pm4, 4),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 154

```text
                "mass_pm10": round(mass_pm10, 4),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 155

```text
                "num_pm0_5": round(num_pm0_5, 1),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 156

```text
                "num_pm1": round(num_pm1, 1),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 157

```text
                "num_pm2_5": round(num_pm2_5, 1),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 158

```text
                "num_pm4": round(num_pm4, 1),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 159

```text
                "num_pm10": round(num_pm10, 1),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 160

```text
                "typical_particle_size_um": round(typical_size, 2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 161

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 162

```text
            "converted_values": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 163

```text
                "number_concentrations_ft3": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 164

```text
                    "pm0_5": round(num_pm0_5_ft3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 165

```text
                    "pm1": round(num_pm1_ft3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 166

```text
                    "pm2_5": round(num_pm2_5_ft3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 167

```text
                    "pm4": round(num_pm4_ft3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 168

```text
                    "pm10": round(num_pm10_ft3, 2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 169

```text
                },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 170

```text
                "differential_bins_ft3": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 171

```text
                    "bin_0_3_to_0_5": round(bin_0_3_to_0_5, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 172

```text
                    "bin_0_5_to_1_0": round(bin_0_5_to_1_0, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 173

```text
                    "bin_1_0_to_2_5": round(bin_1_0_to_2_5, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 174

```text
                    "bin_2_5_to_4_0": round(bin_2_5_to_4_0, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 175

```text
                    "bin_4_0_to_10": round(bin_4_0_to_10, 2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 176

```text
                },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 177

```text
                "mass_concentrations_ug_m3": {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 178

```text
                    "pm1": round(pm1_ug_m3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 179

```text
                    "pm2_5": round(current_pm2_5, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 180

```text
                    "pm4": round(pm4_ug_m3, 2),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 181

```text
                    "pm10": round(pm10_ug_m3, 2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 182

```text
                }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 183

```text
            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 184

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 186

```text
        return data
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 188

```text
    def send_data(self, data):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 189

```text
        """Send data to the API"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 190

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 191

```text
            response = requests.post(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 192

```text
                self.api_url,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 193

```text
                headers={"Content-Type": "application/json"},
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 194

```text
                json=data,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 195

```text
                verify=False,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 196

```text
                timeout=10
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 197

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 199

```text
            if response.status_code == 200:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 200

```text
                result = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 201

```text
                print(f"✓ Sent data for {data['room_name']}/{data['sensor_number']} - PM2.5: {data['converted_values']['mass_concentrations_ug_m3']['pm2_5']} μg/m³")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 202

```text
                return True
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 203

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 204

```text
                print(f"✗ Error {response.status_code}: {response.text}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 205

```text
                return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 207

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 208

```text
            print(f"✗ Failed to send data: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 209

```text
            return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 211

```text
    def generate_historical_batch(self, hours_back=24, interval_minutes=10):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 212

```text
        """Generate a batch of historical data"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 213

```text
        print(f"Generating {hours_back} hours of historical data with {interval_minutes}-minute intervals...")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 216

```text
        end_time = datetime.now()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 217

```text
        start_time = end_time - timedelta(hours=hours_back)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 218

```text
        current_time = start_time
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 220

```text
        total_points = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 221

```text
        successful_points = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 223

```text
        while current_time <= end_time:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 224

```text
            timestamp = int(current_time.timestamp())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 227

```text
            for sensor_id in self.sensors:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 228

```text
                data = self.generate_realistic_data(sensor_id, timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 230

```text
                if self.send_data(data):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 231

```text
                    successful_points += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 232

```text
                total_points += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 235

```text
                time.sleep(0.1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 237

```text
            current_time += timedelta(minutes=interval_minutes)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 239

```text
        print(f"\nCompleted: {successful_points}/{total_points} data points sent successfully")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 241

```text
    def generate_realtime_stream(self, interval_seconds=30):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 242

```text
        """Generate real-time data stream"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 243

```text
        print(f"Starting real-time data generation (every {interval_seconds} seconds)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 244

```text
        print("Press Ctrl+C to stop")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 246

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 247

```text
            while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 248

```text
                timestamp = int(datetime.now().timestamp())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 251

```text
                for sensor_id in self.sensors:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 252

```text
                    data = self.generate_realistic_data(sensor_id, timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 253

```text
                    self.send_data(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 254

```text
                    time.sleep(0.2)  # Small delay between sensors
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 256

```text
                print(f"Waiting {interval_seconds} seconds...")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 257

```text
                time.sleep(interval_seconds)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 259

```text
        except KeyboardInterrupt:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 260

```text
            print("\nStopped real-time generation")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 262

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 263

```text
    generator = ParticleDataGenerator()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 265

```text
    print("Particle Data Generator")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 266

```text
    print("=" * 50)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 267

```text
    print("1. Generate historical data (24 hours)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 268

```text
    print("2. Generate real-time stream")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 269

```text
    print("3. Send single test batch")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 270

```text
    print("4. Custom historical range")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 272

```text
    choice = input("\nSelect option (1-4): ").strip()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 274

```text
    if choice == "1":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 275

```text
        generator.generate_historical_batch(hours_back=24, interval_minutes=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 276

```text
    elif choice == "2":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 277

```text
        generator.generate_realtime_stream(interval_seconds=30)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 278

```text
    elif choice == "3":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 279

```text
        timestamp = int(datetime.now().timestamp())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 280

```text
        for sensor_id in generator.sensors:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 281

```text
            data = generator.generate_realistic_data(sensor_id, timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 282

```text
            generator.send_data(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 283

```text
    elif choice == "4":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 284

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 285

```text
            hours = int(input("Hours of data to generate: "))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 286

```text
            interval = int(input("Interval in minutes: "))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 287

```text
            generator.generate_historical_batch(hours_back=hours, interval_minutes=interval)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 288

```text
        except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 289

```text
            print("Invalid input")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 290

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 291

```text
        print("Invalid choice")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 293

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 294

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/generate_test_particle_data.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
