

# Source Reconstruction: UNanofabTools/app/models/particle_sensor.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/models/particle_sensor.py`
- Lines read: `108`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `b66a50d5473dd5f9`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `from datetime import datetime`, `from . import db`
- Classes: `ParticleSensorData`
- Functions: `__repr__`, `to_dict`
- Routes: none detected

## Sanitized Source Excerpt

```python
"""
Particle Sensor Data Model
"""
from datetime import datetime
from . import db


class ParticleSensorData(db.Model):
    """Model for storing the most recent particle sensor data from each sensor"""
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'

    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    # Raw measurement data
    mass_pm1 = db.Column(db.Float)
    mass_pm2_5 = db.Column(db.Float)
    mass_pm4 = db.Column(db.Float)
    mass_pm10 = db.Column(db.Float)
    num_pm0_5 = db.Column(db.Float)
    num_pm1 = db.Column(db.Float)
    num_pm2_5 = db.Column(db.Float)
    num_pm4 = db.Column(db.Float)
    num_pm10 = db.Column(db.Float)
    typical_particle_size_um = db.Column(db.Float)

    # Converted values (ft³ measurements)
    num_pm0_5_ft3 = db.Column(db.Float)
    num_pm1_ft3 = db.Column(db.Float)
    num_pm2_5_ft3 = db.Column(db.Float)
    num_pm4_ft3 = db.Column(db.Float)
    num_pm10_ft3 = db.Column(db.Float)

    # Differential bins (ft³)
    bin_0_3_to_0_5 = db.Column(db.Float)
    bin_0_5_to_1_0 = db.Column(db.Float)
    bin_1_0_to_2_5 = db.Column(db.Float)
    bin_2_5_to_4_0 = db.Column(db.Float)
    bin_4_0_to_10 = db.Column(db.Float)

    # Mass concentrations (μg/m³)
    mass_pm1_ug_m3 = db.Column(db.Float)
    mass_pm2_5_ug_m3 = db.Column(db.Float)
    mass_pm4_ug_m3 = db.Column(db.Float)
    mass_pm10_ug_m3 = db.Column(db.Float)

    # Environmental data (from DHT22 sensor, optional)
    temperature_c = db.Column(db.Float, nullable=True)
    humidity_pct = db.Column(db.Float, nullable=True)

    # Create a unique constraint on room_name and sensor_number
    # This ensures only one record per sensor location
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )

    def __repr__(self):
        return f'<ParticleSensorData {self.room_name}/{self.sensor_number} @ {self.timestamp}>'

    def to_dict(self):
        """Convert the model to a dictionary for JSON serialization"""
        return {
            'id': self.id,
            'room_name': self.room_name,
            'sensor_number': self.sensor_number,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'temperature_c': self.temperature_c,
            'humidity_pct': self.humidity_pct,
            'raw_measurements': {
                'mass_pm1': self.mass_pm1,
                'mass_pm2_5': self.mass_pm2_5,
                'mass_pm4': self.mass_pm4,
                'mass_pm10': self.mass_pm10,
                'num_pm0_5': self.num_pm0_5,
                'num_pm1': self.num_pm1,
                'num_pm2_5': self.num_pm2_5,
                'num_pm4': self.num_pm4,
                'num_pm10': self.num_pm10,
                'typical_particle_size_um': self.typical_particle_size_um
            },
            'converted_values': {
                'number_concentrations_ft3': {
                    'pm0_5': self.num_pm0_5_ft3,
                    'pm1': self.num_pm1_ft3,
                    'pm2_5': self.num_pm2_5_ft3,
                    'pm4': self.num_pm4_ft3,
                    'pm10': self.num_pm10_ft3
                },
                'differential_bins_ft3': {
                    'bin_0_3_to_0_5': self.bin_0_3_to_0_5,
                    'bin_0_5_to_1_0': self.bin_0_5_to_1_0,
                    'bin_1_0_to_2_5': self.bin_1_0_to_2_5,
                    'bin_2_5_to_4_0': self.bin_2_5_to_4_0,
                    'bin_4_0_to_10': self.bin_4_0_to_10
                },
                'mass_concentrations_ug_m3': {
                    'pm1': self.mass_pm1_ug_m3,
                    'pm2_5': self.mass_pm2_5_ug_m3,
                    'pm4': self.mass_pm4_ug_m3,
                    'pm10': self.mass_pm10_ug_m3
                }
            }
        }
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2

```text
Particle Sensor Data Model
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 3

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 4

```text
from datetime import datetime
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 5

```text
from . import db
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 8

```text
class ParticleSensorData(db.Model):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 9

```text
    """Model for storing the most recent particle sensor data from each sensor"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 10

```text
    __tablename__ = 'particle_sensor_data'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 11

```text
    __bind_key__ = 'particle_sensors'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 13

```text
    id = db.Column(db.Integer, primary_key=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 14

```text
    room_name = db.Column(db.String(255), nullable=False)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 15

```text
    sensor_number = db.Column(db.String(50), nullable=False)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 16

```text
    timestamp = db.Column(db.DateTime, nullable=False)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 17

```text
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 20

```text
    mass_pm1 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 21

```text
    mass_pm2_5 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 22

```text
    mass_pm4 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 23

```text
    mass_pm10 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 24

```text
    num_pm0_5 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 25

```text
    num_pm1 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 26

```text
    num_pm2_5 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 27

```text
    num_pm4 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 28

```text
    num_pm10 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 29

```text
    typical_particle_size_um = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 32

```text
    num_pm0_5_ft3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 33

```text
    num_pm1_ft3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 34

```text
    num_pm2_5_ft3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 35

```text
    num_pm4_ft3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 36

```text
    num_pm10_ft3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 39

```text
    bin_0_3_to_0_5 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 40

```text
    bin_0_5_to_1_0 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 41

```text
    bin_1_0_to_2_5 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 42

```text
    bin_2_5_to_4_0 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 43

```text
    bin_4_0_to_10 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 46

```text
    mass_pm1_ug_m3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 47

```text
    mass_pm2_5_ug_m3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 48

```text
    mass_pm4_ug_m3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 49

```text
    mass_pm10_ug_m3 = db.Column(db.Float)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 52

```text
    temperature_c = db.Column(db.Float, nullable=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 53

```text
    humidity_pct = db.Column(db.Float, nullable=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 57

```text
    __table_args__ = (
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 58

```text
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 59

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 61

```text
    def __repr__(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 62

```text
        return f'<ParticleSensorData {self.room_name}/{self.sensor_number} @ {self.timestamp}>'
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 64

```text
    def to_dict(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 65

```text
        """Convert the model to a dictionary for JSON serialization"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 66

```text
        return {
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 67

```text
            'id': self.id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 68

```text
            'room_name': self.room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
            'sensor_number': self.sensor_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 70

```text
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 71

```text
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 72

```text
            'temperature_c': self.temperature_c,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 73

```text
            'humidity_pct': self.humidity_pct,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 74

```text
            'raw_measurements': {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 75

```text
                'mass_pm1': self.mass_pm1,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 76

```text
                'mass_pm2_5': self.mass_pm2_5,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 77

```text
                'mass_pm4': self.mass_pm4,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 78

```text
                'mass_pm10': self.mass_pm10,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 79

```text
                'num_pm0_5': self.num_pm0_5,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 80

```text
                'num_pm1': self.num_pm1,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 81

```text
                'num_pm2_5': self.num_pm2_5,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 82

```text
                'num_pm4': self.num_pm4,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 83

```text
                'num_pm10': self.num_pm10,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 84

```text
                'typical_particle_size_um': self.typical_particle_size_um
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 85

```text
            },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 86

```text
            'converted_values': {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 87

```text
                'number_concentrations_ft3': {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 88

```text
                    'pm0_5': self.num_pm0_5_ft3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 89

```text
                    'pm1': self.num_pm1_ft3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 90

```text
                    'pm2_5': self.num_pm2_5_ft3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 91

```text
                    'pm4': self.num_pm4_ft3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 92

```text
                    'pm10': self.num_pm10_ft3
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 93

```text
                },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 94

```text
                'differential_bins_ft3': {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 95

```text
                    'bin_0_3_to_0_5': self.bin_0_3_to_0_5,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 96

```text
                    'bin_0_5_to_1_0': self.bin_0_5_to_1_0,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 97

```text
                    'bin_1_0_to_2_5': self.bin_1_0_to_2_5,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 98

```text
                    'bin_2_5_to_4_0': self.bin_2_5_to_4_0,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 99

```text
                    'bin_4_0_to_10': self.bin_4_0_to_10
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 100

```text
                },
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 101

```text
                'mass_concentrations_ug_m3': {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 102

```text
                    'pm1': self.mass_pm1_ug_m3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 103

```text
                    'pm2_5': self.mass_pm2_5_ug_m3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 104

```text
                    'pm4': self.mass_pm4_ug_m3,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 105

```text
                    'pm10': self.mass_pm10_ug_m3
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 106

```text
                }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 107

```text
            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 108

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/models/particle_sensor.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
