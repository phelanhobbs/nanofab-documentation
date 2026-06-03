

# Source Reconstruction: UNanofabTools/curl_for_particle.md

- Repository: `UNanofabTools`
- Relative path: `curl_for_particle.md`
- Lines read: `200`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `31f5e6ae52ec9736`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# Particle Data API Documentation

The particle data API endpoint provides comprehensive functionality for storing and retrieving particle sensor data.

## Overview

The API supports both real-time data storage/retrieval and historical data access:
- **Current Data**: Database stores the most recent reading per sensor (for real-time monitoring)
- **Historical Data**: CSV files store complete historical records per sensor (for analysis)

## Server Information

- **Domain**: `nfhistory.nanofab.utah.edu`
- **IP Address**: `155.98.11.8`
- **Port**: `443` (HTTPS)

## POST Endpoint - Submit Particle Data

**Endpoint:** `POST /particle-data`

Submits particle sensor data which gets:
1. **Logged to CSV** - Appended to sensor-specific CSV file for historical tracking
2. **Stored in Database** - Updates/creates current data record for the sensor

### Example Request:
```bash
curl -X POST "https://nfhistory.nanofab.utah.edu/particle-data" \
-H "Content-Type: application/json" \
-d '{
  "room_name": "ROOM_NAME",
  "sensor_number": "SENSOR_NUMBER",
  "timestamp": 1702339200,
  "raw_measurements": {
    "mass_pm1": 0.123,
    "mass_pm2_5": 0.456,
    "mass_pm4": 0.789,
    "mass_pm10": 1.234,
    "num_pm0_5": 100.0,
    "num_pm1": 80.0,
    "num_pm2_5": 60.0,
    "num_pm4": 40.0,
    "num_pm10": 20.0,
    "typical_particle_size_um": 0.5
  },
  "converted_values": {
    "number_concentrations_ft3": {
      "pm0_5": 2831.68,
      "pm1": 2265.34,
      "pm2_5": 1699.01,
      "pm4": 1132.67,
      "pm10": 566.34
    },
    "differential_bins_ft3": {
      "bin_0_3_to_0_5": 2831.68,
      "bin_0_5_to_1_0": 0.0,
      "bin_1_0_to_2_5": 0.0,
      "bin_2_5_to_4_0": 0.0,
      "bin_4_0_to_10": 0.0
    },
    "mass_concentrations_ug_m3": {
      "pm1": 0.12,
      "pm2_5": 0.46,
      "pm4": 0.79,
      "pm10": 1.23
    }
  }
}'
```

### Testing with IP Address (for DNS issues):
```bash
# Test with direct IP (useful for MicroPython devices with DNS issues)
curl -k -X POST "https://155.98.11.8/particle-data" \
-H "Content-Type: application/json" \
-d '{
  "room_name": "TEST_ROOM",
  "sensor_number": "001",
  "timestamp": 1702339200,
  "raw_measurements": {
    "mass_pm1": 0.123,
    "mass_pm2_5": 0.456,
    "mass_pm4": 0.789,
    "mass_pm10": 1.234,
    "num_pm0_5": 100.0,
    "num_pm1": 80.0,
    "num_pm2_5": 60.0,
    "num_pm4": 40.0,
    "num_pm10": 20.0,
    "typical_particle_size_um": 0.5
  },
  "converted_values": {
    "number_concentrations_ft3": {
      "pm0_5": 2831.68,
      "pm1": 2265.34,
      "pm2_5": 1699.01,
      "pm4": 1132.67,
      "pm10": 566.34
    },
    "differential_bins_ft3": {
      "bin_0_3_to_0_5": 2831.68,
      "bin_0_5_to_1_0": 0.0,
      "bin_1_0_to_2_5": 0.0,
      "bin_2_5_to_4_0": 0.0,
      "bin_4_0_to_10": 0.0
    },
    "mass_concentrations_ug_m3": {
      "pm1": 0.12,
      "pm2_5": 0.46,
      "pm4": 0.79,
      "pm10": 1.23
    }
  }
}'
```

## GET Endpoints - Retrieve Data

**Endpoint:** `GET /particle-data`

### 1. Get All Current Sensors (Real-time)
Returns the most recent data for all sensors from the database.

```bash
curl http://localhost:443/particle-data
```

### 2. Get Current Data for Specific Room/Sensor (Real-time)
Returns current data filtered by room or sensor.

```bash
# By room only
curl http://localhost:443/particle-data?room_name=ROOM_NAME

# By sensor only
curl http://localhost:443/particle-data?sensor_number=SENSOR_NUMBER
```

### 3. Get Complete Historical Data (CSV Records)
When **both** `room_name` and `sensor_number` are provided, returns complete historical CSV data for that sensor.

```bash
curl http://localhost:443/particle-data?room_name=ROOM_NAME&sensor_number=SENSOR_NUMBER
```

## Data Storage Details

### Database Storage
- **Purpose**: Real-time monitoring and current status
- **Behavior**: Stores only the most recent record per sensor (overwrites previous data)
- **Location**: SQLite database via SQLAlchemy models

### CSV Storage
- **Purpose**: Historical analysis and long-term tracking
- **Behavior**: Appends new records (preserves all historical data)
- **Location**: `LogData/particle_sensors/ROOM_SENSOR_historical.csv`
- **Format**: One CSV file per unique room/sensor combination

## Response Examples

### Current Data Response:
```json
{
  "status": "success",
  "count": 2,
  "sensors": [
    {
      "id": 1,
      "room_name": "ROOM_NAME",
      "sensor_number": "SENSOR_NUMBER",
      "timestamp": "2023-12-11T17:00:00",
      "last_updated": "2025-12-16T23:11:44.172988",
      "raw_measurements": { ... },
      "converted_values": { ... }
    }
  ]
}
```

### Historical Data Response:
```json
{
  "status": "success",
  "room_name": "ROOM_NAME",
  "sensor_number": "SENSOR_NUMBER",
  "data_source": "historical_csv",
  "record_count": 15,
  "historical_data": [
    {
      "timestamp": 1702339200.0,
      "timestamp_iso": "2023-12-11T17:00:00",
      "room_name": "ROOM_NAME",
      "sensor_number": "SENSOR_NUMBER",
      "mass_pm1": 0.123,
      "mass_pm2_5": 0.456,
      ...
    },
    ...
  ]
}
```
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Particle Data API Documentation
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
The particle data API endpoint provides comprehensive functionality for storing and retrieving particle sensor data.
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 3 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
## Overview
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
The API supports both real-time data storage/retrieval and historical data access:
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 7 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
- **Current Data**: Database stores the most recent reading per sensor (for real-time monitoring)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 8 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
- **Historical Data**: CSV files store complete historical records per sensor (for analysis)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 9 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 10 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
## Server Information
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 11 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 12 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
- **Domain**: `nfhistory.nanofab.utah.edu`
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 13 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
- **IP Address**: `155.98.11.8`
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 14 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
- **Port**: `443` (HTTPS)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 15 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 16 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
## POST Endpoint - Submit Particle Data
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 17 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 18 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
**Endpoint:** `POST /particle-data`
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 19 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
Submits particle sensor data which gets:
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 21 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
1. **Logged to CSV** - Appended to sensor-specific CSV file for historical tracking
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 22 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
2. **Stored in Database** - Updates/creates current data record for the sensor
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 23 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 24 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
### Example Request:
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 25 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
```bash
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 26 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
curl -X POST "https://nfhistory.nanofab.utah.edu/particle-data" \
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 27 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
-H "Content-Type: application/json" \
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 28 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
-d '{
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 29 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
  "room_name": "ROOM_NAME",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 30 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
  "sensor_number": "SENSOR_NUMBER",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 31 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
  "timestamp": 1702339200,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 32 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
  "raw_measurements": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 33 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    "mass_pm1": 0.123,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 34 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    "mass_pm2_5": 0.456,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 35 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    "mass_pm4": 0.789,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 36 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
    "mass_pm10": 1.234,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 37 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    "num_pm0_5": 100.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 38 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    "num_pm1": 80.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 39 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
    "num_pm2_5": 60.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 40 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
    "num_pm4": 40.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 41 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
    "num_pm10": 20.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 42 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
    "typical_particle_size_um": 0.5
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 43 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
  },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 44 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
  "converted_values": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 45 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    "number_concentrations_ft3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 46 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
      "pm0_5": 2831.68,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 47 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
      "pm1": 2265.34,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 48 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
      "pm2_5": 1699.01,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 49 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
      "pm4": 1132.67,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 50 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
      "pm10": 566.34
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 51 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
    },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 52 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
    "differential_bins_ft3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 53 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
      "bin_0_3_to_0_5": 2831.68,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 54 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
      "bin_0_5_to_1_0": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 55 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
      "bin_1_0_to_2_5": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 56 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
      "bin_2_5_to_4_0": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 57 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
      "bin_4_0_to_10": 0.0
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 58 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 59 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    "mass_concentrations_ug_m3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 60 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
      "pm1": 0.12,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 61 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
      "pm2_5": 0.46,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 62 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
      "pm4": 0.79,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 63 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
      "pm10": 1.23
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 64 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
    }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 65 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
  }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 66 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
}'
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 67 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 68 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 69 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
### Testing with IP Address (for DNS issues):
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 70 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
```bash
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 71 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
# Test with direct IP (useful for MicroPython devices with DNS issues)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 72 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
curl -k -X POST "https://155.98.11.8/particle-data" \
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 73 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
-H "Content-Type: application/json" \
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 74 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
-d '{
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 75 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
  "room_name": "TEST_ROOM",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 76 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
  "sensor_number": "001",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 77 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
  "timestamp": 1702339200,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 78 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
  "raw_measurements": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 79 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    "mass_pm1": 0.123,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 80 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    "mass_pm2_5": 0.456,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 81 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    "mass_pm4": 0.789,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 82 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
    "mass_pm10": 1.234,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 83 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
    "num_pm0_5": 100.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 84 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
    "num_pm1": 80.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 85 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
    "num_pm2_5": 60.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 86 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
    "num_pm4": 40.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 87 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
    "num_pm10": 20.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 88 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
    "typical_particle_size_um": 0.5
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 89 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
  },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 90 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
  "converted_values": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 91 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
    "number_concentrations_ft3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 92 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
      "pm0_5": 2831.68,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 93 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
      "pm1": 2265.34,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 94 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
      "pm2_5": 1699.01,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 95 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
      "pm4": 1132.67,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 96 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
      "pm10": 566.34
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 97 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
    },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 98 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
    "differential_bins_ft3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 99 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
      "bin_0_3_to_0_5": 2831.68,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 100 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
      "bin_0_5_to_1_0": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 101 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
      "bin_1_0_to_2_5": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 102 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
      "bin_2_5_to_4_0": 0.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 103 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
      "bin_4_0_to_10": 0.0
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 104 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
    },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 105 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
    "mass_concentrations_ug_m3": {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 106 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
      "pm1": 0.12,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 107 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
      "pm2_5": 0.46,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 108 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
      "pm4": 0.79,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 109 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
      "pm10": 1.23
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 110 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
    }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 111 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
  }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 112 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
}'
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 113 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 114 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 115 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
## GET Endpoints - Retrieve Data
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 116 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 117 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
**Endpoint:** `GET /particle-data`
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 118 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 119 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
### 1. Get All Current Sensors (Real-time)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 120 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
Returns the most recent data for all sensors from the database.
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 121 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 122 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
```bash
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 123 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
curl http://localhost:443/particle-data
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 124 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 125 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
### 2. Get Current Data for Specific Room/Sensor (Real-time)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 127 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
Returns current data filtered by room or sensor.
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 128 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 129 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
```bash
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 130 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
# By room only
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 131 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
curl http://localhost:443/particle-data?room_name=ROOM_NAME
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 132 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 133 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
# By sensor only
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 134 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
curl http://localhost:443/particle-data?sensor_number=SENSOR_NUMBER
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 135 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 136 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 137 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
### 3. Get Complete Historical Data (CSV Records)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 138 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
When **both** `room_name` and `sensor_number` are provided, returns complete historical CSV data for that sensor.
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 139 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 140 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
```bash
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 141 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
curl http://localhost:443/particle-data?room_name=ROOM_NAME&sensor_number=SENSOR_NUMBER
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 142 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 143 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 144 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
## Data Storage Details
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 145 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 146 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
### Database Storage
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 147 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
- **Purpose**: Real-time monitoring and current status
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 148 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
- **Behavior**: Stores only the most recent record per sensor (overwrites previous data)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 149 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
- **Location**: SQLite database via SQLAlchemy models
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 150 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 151 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
### CSV Storage
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 152 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
- **Purpose**: Historical analysis and long-term tracking
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 153 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
- **Behavior**: Appends new records (preserves all historical data)
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 154 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
- **Location**: `LogData/particle_sensors/ROOM_SENSOR_historical.csv`
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 155 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
- **Format**: One CSV file per unique room/sensor combination
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 156 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 157 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
## Response Examples
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 158 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 159 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
### Current Data Response:
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 160 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
```json
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 161 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
{
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 162 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
  "status": "success",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 163 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
  "count": 2,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 164 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
  "sensors": [
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 165 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
    {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 166 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
      "id": 1,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 167 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
      "room_name": "ROOM_NAME",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 168 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
      "sensor_number": "SENSOR_NUMBER",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 169 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
      "timestamp": "2023-12-11T17:00:00",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 170 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
      "last_updated": "2025-12-16T23:11:44.172988",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 171 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
      "raw_measurements": { ... },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 172 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
      "converted_values": { ... }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 173 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
    }
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 174 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
  ]
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 175 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
}
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 176 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 177 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 178 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
### Historical Data Response:
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 179 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
```json
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 180 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
{
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 181 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
  "status": "success",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 182 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
  "room_name": "ROOM_NAME",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 183 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
  "sensor_number": "SENSOR_NUMBER",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 184 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
  "data_source": "historical_csv",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 185 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
  "record_count": 15,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 186 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
  "historical_data": [
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 187 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
    {
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 188 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
      "timestamp": 1702339200.0,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 189 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
      "timestamp_iso": "2023-12-11T17:00:00",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 190 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
      "room_name": "ROOM_NAME",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 191 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
      "sensor_number": "SENSOR_NUMBER",
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 192 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
      "mass_pm1": 0.123,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 193 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
      "mass_pm2_5": 0.456,
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 194 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
      ...
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 195 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
    },
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 196 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
    ...
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 197 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
  ]
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 198 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
}
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 199 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
```
```

Reconstruction rule: in `UNanofabTools/curl_for_particle.md`, line 200 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/curl_for_particle.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/curl_for_particle.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/curl_for_particle.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/curl_for_particle.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/curl_for_particle.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/curl_for_particle.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/curl_for_particle.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/curl_for_particle.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/curl_for_particle.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/curl_for_particle.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/curl_for_particle.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/curl_for_particle.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/curl_for_particle.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/curl_for_particle.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/curl_for_particle.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/curl_for_particle.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/curl_for_particle.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/curl_for_particle.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/curl_for_particle.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/curl_for_particle.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/curl_for_particle.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/curl_for_particle.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/curl_for_particle.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/curl_for_particle.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
