

# Source Reconstruction: UNanofabTools/PicoParylene.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `PicoParylene.py`
- Lines read: `541`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `0b11bc773b6fa8a7`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import network`, `import urequests`, `import time`, `import json`, `from machine import ADC, Pin`, `import ubinascii`, `import machine`, `import gc`
- Classes: none detected
- Functions: `_flash_signal`, `_morse_element`, `_flash_morse_code_for_char`, `flash_morse_for_number`, `flash_morse_for_message`, `connect_wifi`, `check_auto_send`, `add_data_to_csv`, `send_csv_in_batches`, `send_complete_csv`, `send_data`, `sendEndRequest`, `main_loop`
- Routes: none detected

## Sanitized Source Excerpt

```python
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.0.17
# Date: 2025-13-06
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This code is inteaded to send data from a pico device to the server
import network
import urequests
import time
import json
from machine import ADC, Pin
import ubinascii
import machine
import gc

# Wi-Fi credentials
SSID = 'ULink'
PASSWORD = '<redacted-secret-value>'

# Server URL
SERVER_URL = 'https://nfhistory.nanofab.utah.edu/sdsanalog'

# ADC Pin Assignments
ADC_PIN_PRESSURE = 26
ADC_PIN_VAPOR = 27
ADC_PIN_TEMP = 28

# Sensor Thresholds
# Value below which pressure sensor reading is considered invalid (disconnected/off).
# !!! IMPORTANT: You MUST adjust MIN_VALID_PRESSURE_READING based on the
# actual readings you observe when a wire is disconnected or the machine is off.
# For example, if disconnected readings are typically 0-500, set this to something like 1000.
MIN_VALID_PRESSURE_READING = 1000  # Placeholder: Adjust this value!

# Value of pressure sensor reading at or above which data collection stops,
# and an "END" signal might be sent if data was being gathered.
STOP_COLLECTING_PRESSURE_READING = 65535

# Initialize ADC (assuming analog input is on pin 26)
adc0 = ADC(Pin(ADC_PIN_PRESSURE)) # Pressure
adc1 = ADC(Pin(ADC_PIN_VAPOR))    # Vapor
adc2 = ADC(Pin(ADC_PIN_TEMP))     # Temperature
led = Pin('LED', Pin.OUT)

# Morse Code Configuration
DOT_DURATION = 0.02  # seconds for a dot - Adjusted for potentially faster flashing
DASH_DURATION = 3 * DOT_DURATION
INTRA_CHAR_SPACE = DOT_DURATION  # Space between dots/dashes of a single character
INTER_CHAR_SPACE = 3 * DOT_DURATION # Space between characters (digits or letters)
WORD_SPACE = 7 * DOT_DURATION       # Space between numbers or words

MORSE_CODE_DICT = {
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    'E': '.', 'N': '-.', 'D': '-..', # For "END"
}

def _flash_signal(duration):
    led.on()
    time.sleep(duration)
    led.off()

def _morse_element(element_type):
    if element_type == '.':
        _flash_signal(DOT_DURATION)
    elif element_type == '-':
        _flash_signal(DASH_DURATION)
    time.sleep(INTRA_CHAR_SPACE)

def _flash_morse_code_for_char(code_string):
    for element in code_string:
        _morse_element(element)

def flash_morse_for_number(number):
    s_number = str(number)
    for i, digit in enumerate(s_number):
        if digit in MORSE_CODE_DICT:
            _flash_morse_code_for_char(MORSE_CODE_DICT[digit])
            if i < len(s_number) - 1:
                time.sleep(INTER_CHAR_SPACE)

def flash_morse_for_message(message):
    for i, char_val in enumerate(message.upper()):
        if (char_val in MORSE_CODE_DICT):
            _flash_morse_code_for_char(MORSE_CODE_DICT[char_val])
            if i < len(message) - 1:
                time.sleep(INTER_CHAR_SPACE)

# Connect to Wi-Fi
WIFI_CONNECT_TIMEOUT_S = 30   # Per-attempt timeout
WIFI_RETRY_DELAY_S = 5        # Delay between retry attempts

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    attempt = 0
    while True:
        attempt += 1
        print(f'Wi-Fi connect attempt {attempt}...')
        try:
            if not wlan.isconnected():
                wlan.connect(SSID, PASSWORD)
            # Wait up to WIFI_CONNECT_TIMEOUT_S seconds, blinking LED to show activity
            waited = 0
            while not wlan.isconnected() and waited < WIFI_CONNECT_TIMEOUT_S:
                led.on()
                time.sleep(0.1)
                led.off()
                time.sleep(0.9)
                waited += 1
            if wlan.isconnected():
                print('Connected to Wi-Fi:', wlan.ifconfig())
                return wlan
            print(f'Wi-Fi not connected after {WIFI_CONNECT_TIMEOUT_S}s, retrying...')
        except Exception as e:
            print('Wi-Fi error:', e)
        # Brief recovery before retrying
        try:
            wlan.disconnect()
        except Exception:
            pass
        time.sleep(WIFI_RETRY_DELAY_S)

wlan = connect_wifi()
gathering = False

# CSV Data Storage
csv_data = []  # Store all readings as CSV rows
csv_header = "timestamp,pressure,vapor,temp\n"
first_timestamp = None  # Track the first timestamp

# Number of data points to send per batch
BATCH_SIZE = 20  # Reduced for memory efficiency

# Minimum number of data points required before sending csv
MIN_CSV_LINES = 3  # Won't send if CSV has fewer than 3 data lines

# Maximum number of CSV points before auto-send
MAX_CSV_POINTS = 50  # Auto-send when reaching this many points

# Auto-send interval in milliseconds
AUTO_SEND_INTERVAL_MS = 300000  # Auto-send every 5 minutes (300,000ms)
last_auto_send_time = time.ticks_ms()  # Track last auto-send time

# Generate unique session ID at startup
SESSION_ID = ubinascii.hexlify(machine.unique_id()).decode('utf-8')[:8]

# Function to check if auto-send conditions are met
def check_auto_send():
    global csv_data, last_auto_send_time

    current_time = time.ticks_ms()
    time_since_last_send = time.ticks_diff(current_time, last_auto_send_time)

    # Check if we need to auto-send based on data volume
    if len(csv_data) >= MAX_CSV_POINTS:
        print(f'Auto-send triggered: {len(csv_data)} data points reached maximum ({MAX_CSV_POINTS})')
        send_csv_in_batches()
        last_auto_send_time = current_time
        return

    # Check if we need to auto-send based on time interval
    if time_since_last_send >= AUTO_SEND_INTERVAL_MS:
        if len(csv_data) >= MIN_CSV_LINES:  # Only send if we have enough data
            print(f'Auto-send triggered: {time_since_last_send}ms elapsed (interval: {AUTO_SEND_INTERVAL_MS}ms)')
            send_complete_csv()
            last_auto_send_time = current_time
        else:
            print(f'Auto-send timer elapsed but only {len(csv_data)} data points (minimum: {MIN_CSV_LINES})')
            last_auto_send_time = current_time  # Reset timer even if not sending

# Modified function to build CSV data
def add_data_to_csv(pressureVal, vaporVal, tempVal):
    global csv_data, first_timestamp

    # No longer tracking overall session average here
    # Average will be calculated per batch when sending

    # Calculate pressure percentage and flash morse code
    pressure_percentage = int((pressureVal / 65535) * 100)
    flash_morse_for_number(pressure_percentage)

    # Get current timestamp
    current_timestamp = time.ticks_ms()

    # If this is the first data point, record the starting timestamp
    if first_timestamp is None:
        first_timestamp = current_timestamp
        relative_timestamp = 0
    else:
        # Calculate time elapsed since first data point
        relative_timestamp = time.ticks_diff(current_timestamp, first_timestamp)

    # Add data as CSV row
    csv_row = f"{relative_timestamp},{pressureVal},{vaporVal},{tempVal}\n"
    csv_data.append(csv_row)

    print(f'Added data point {len(csv_data)}: Pressure={pressureVal}, Time={relative_timestamp}ms')

    # Check if we need to auto-send data
    check_auto_send()

# Function to send CSV in batches
def send_csv_in_batches():
    global csv_data

    if not csv_data:
        print('No data to send')
        return

    # Check if we have enough data points to warrant sending
    if len(csv_data) < MIN_CSV_LINES:
        print(f'CSV has only {len(csv_data)} data points, minimum required is {MIN_CSV_LINES}. Discarding data (likely noise/static).')
        csv_data = []
        return

    total_points = len(csv_data)
    total_batches = (total_points + BATCH_SIZE - 1) // BATCH_SIZE
    print(f'Sending {total_points} data points in batches of {BATCH_SIZE}')

    # Flash total number of data points
    flash_morse_for_number(total_points)
    time.sleep(WORD_SPACE)

    # Send data in batches
    batch_num = 0
    for i in range(0, total_points, BATCH_SIZE):
        batch_num += 1
        batch_data = csv_data[i:i + BATCH_SIZE]

        # Calculate average pressure for this batch only
        batch_pressure_sum = 0
        batch_pressure_count = 0
        for row in batch_data:
            # Parse pressure value from CSV row (format: timestamp,pressure,vapor,temp)
            parts = row.strip().split(',')
            if len(parts) >= 2:
                batch_pressure_sum += int(parts[1])
                batch_pressure_count += 1

        batch_pressure_average = batch_pressure_sum / batch_pressure_count if batch_pressure_count > 0 else 0
        print(f'Batch {batch_num} Average Pressure: {batch_pressure_average:.2f}')

        # Force garbage collection before each batch
        gc.collect()
        print(f'Free memory: {gc.mem_free()} bytes')

        led.on()

        # Build CSV content for this batch
        csv_content = csv_header + ''.join(batch_data)

        headers = {
            'Content-Type': 'text/csv',
            'Content-Length': str(len(csv_content)),
            'X-Session-ID': SESSION_ID,
            'X-Batch-Number': str(batch_num),
            'X-Total-Batches': str(total_batches),
            'X-Batch-Points': str(len(batch_data)),
            'X-Is-Final-Batch': 'true' if batch_num == total_batches else 'false'
        }

        response = None
        try:
            response = urequests.post(SERVER_URL, data=csv_content, headers=headers)
            print(f'Batch {batch_num} sent successfully: {response.status_code}, Points: {len(batch_data)}')

            # Brief flash to indicate successful batch
            led.off()
            time.sleep(0.1)
            led.on()
            time.sleep(0.1)

        except Exception as e:
            print(f'Failed to send batch {batch_num} with {len(batch_data)} points:', e)
            print('Headers:', headers)
            # On memory error, force cleanup and continue
            if 'ENOMEM' in str(e) or 'MBEDTLS_ERR' in str(e):
                print('Memory error - forcing cleanup')
                if response:
                    response.close()
                    response = None
                gc.collect()
                time.sleep(2)
        finally:
            if response:
                response.close()
            led.off()

        # Cleanup variables and force garbage collection
        csv_content = None
        headers = None
        batch_data = None
        gc.collect()
        time.sleep(1)  # Recovery time between batches

    csv_data = []
    print(f'Finished sending {batch_num} batches')

# Modified send_complete_csv function
def send_complete_csv():
    global csv_data

    if not csv_data:
        print('No data to send')
        return

    # Check if we have enough data points to warrant sending
    if len(csv_data) < MIN_CSV_LINES:
        print(f'CSV has only {len(csv_data)} data points, minimum required is {MIN_CSV_LINES}. Discarding data (likely noise/static).')
        # Clear the insufficient data but DON'T reset timestamp
        csv_data = []
        return

    # If data is small enough, try sending as one piece
    if len(csv_data) <= BATCH_SIZE:
        # Calculate average pressure for this data
        data_pressure_sum = 0
        data_pressure_count = 0
        for row in csv_data:
            # Parse pressure value from CSV row (format: timestamp,pressure,vapor,temp)
            parts = row.strip().split(',')
            if len(parts) >= 2:
                data_pressure_sum += int(parts[1])
                data_pressure_count += 1

        data_pressure_average = data_pressure_sum / data_pressure_count if data_pressure_count > 0 else 0
        print(f'Payload Average Pressure: {data_pressure_average:.2f}')

        # Flash Morse code for number of data points
        flash_morse_for_number(len(csv_data))
        time.sleep(WORD_SPACE)

        led.on()  # Turn LED solid on for the network request duration

        # Build complete CSV content
        csv_content = csv_header + ''.join(csv_data)

        headers = {
            'Content-Type': 'text/csv',
            'Content-Length': str(len(csv_content)),
            'X-Session-ID': SESSION_ID,
            'X-Batch-Number': '1',
            'X-Total-Batches': '1',
            'X-Batch-Points': str(len(csv_data)),
            'X-Is-Final-Batch': 'true'
        }

        try:
            response = urequests.post(SERVER_URL, data=csv_content, headers=headers)
            print(f'CSV sent successfully: {response.status_code}')
            print(f'Data points sent: {len(csv_data)}')
            print('Response text:', response.text)
            response.close()

            # Clear the data after successful send but DON'T reset timestamp
            csv_data = []

        except Exception as e:
            print(f'Failed to send CSV with {len(csv_data)} data points:', e)
            print('Falling back to batch sending...')
            send_csv_in_batches()
        finally:
            led.off()
    else:
        # Data is too large, send in batches
        print(f'Data too large ({len(csv_data)} points), sending in batches')
        send_csv_in_batches()

# Function to send data to server
def send_data(pressureVal, vaporVal, tempVal):
    global gathering

    # Calculate pressure percentage (0-99) against max ADC value (65535), truncating to integer
    # e.g., if pressureVal is 25000, (25000 / 65535) * 100 = 38.14... -> int(38.14...) = 38
    pressure_percentage = int((pressureVal / 65535) * 100)

    # Flash Morse code for the calculated percentage
    flash_morse_for_number(pressure_percentage)
    #time.sleep(WORD_SPACE) # Pause after flashing percentage before network activity LED indication

    led.on() # Turn LED solid on for the network request duration

    payload = json.dumps({'pressure': pressureVal, 'vapor': vaporVal, 'temp': tempVal})

    # Print the pressure value from this single payload
    print(f'Payload Pressure: {pressureVal}')

    headers = {
        'Content-Type': 'application/json',
        'Content-Length': str(len(payload))
    }
    gathering = True
    try:
        response = urequests.post(SERVER_URL, data=payload, headers=headers)
        print('Response status:', response.status_code)
        print('Response text:', response.text)
        response.close()
    except Exception as e:
        print('Payload:', payload)
        print('Headers:', headers)
        print('Failed to send data:', e)
    finally:
        led.off() # Ensure LED is off after the operation

def sendEndRequest():
    """Send an END signal to the server to finalize the session"""
    global csv_data

    # First, send any accumulated CSV data
    if csv_data:
        print('Sending final CSV data before END signal...')
        send_complete_csv()

    try:
        # Send POST request with session ID
        data = json.dumps({'session_id': SESSION_ID})
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': str(len(data)),
            'X-Session-ID': SESSION_ID
        }

        response = urequests.post(SERVER_URL + 'finished', data=data, headers=headers)
        print(f'END signal sent. Response: {response.status_code}')
        if response.status_code == 200:
            response_data = response.json()
            print(f'Server response: {response_data}')
        response.close()

        print('END signal sent successfully')

    except Exception as e:
        print(f'Failed to send END signal: {e}')
    finally:
        led.off()

# Main loop
RESET_DELAY_S = 5  # Delay before machine.reset() on fatal error, so logs flush

def main_loop():
    global wlan
    while True:
        # Ensure Wi-Fi is still up; reconnect if it dropped
        try:
            if not wlan.isconnected():
                print('Wi-Fi disconnected, reconnecting...')
                wlan = connect_wifi()
        except Exception as e:
            print('Wi-Fi check failed:', e)
            wlan = connect_wifi()

        try:
            pressureVal = adc0.read_u16()
            vaporVal = adc1.read_u16()
            tempVal = adc2.read_u16()
        except Exception as e:
            print('ADC read failed:', e)
            time.sleep(1)
            continue

        print('Analog value (Pressure):', pressureVal) # Logging the primary control value

        try:
            if pressureVal < MIN_VALID_PRESSURE_READING:
                # Pressure is below the minimum valid threshold, assume disconnected or machine off.
                if gathering:
                    # If data was being gathered, stop now.
                    print(f'Pressure ({pressureVal}) fell below threshold ({MIN_VALID_PRESSURE_READING}). Sending final CSV and stopping.')
                    gathering = False
                    send_complete_csv()  # Send accumulated data before stopping
                    # Reset timestamp ONLY when falling below detection threshold
                    first_timestamp = None
                    print('Timestamp reset - ready for next run')
                else:
                    # Not gathering, and pressure is too low. System is likely idle or disconnected.
                    print(f'Pressure ({pressureVal}) below threshold ({MIN_VALID_PRESSURE_READING}). System idle or disconnected. Not sending data.')
                # No data is sent in this state.

            elif pressureVal < STOP_COLLECTING_PRESSURE_READING:
                # Pressure is in the valid operational range for sending data.
                print('Adding data for pressure:', pressureVal)
                add_data_to_csv(pressureVal, vaporVal, tempVal)
                gathering = True

                # Additional safety check for very long runs
                if len(csv_data) > 100:  # Emergency send if somehow auto-send didn't trigger
                    print('Emergency auto-send: too much data accumulated')
                    send_csv_in_batches()

            elif gathering:
                # This condition means:
                # 1. pressureVal >= MIN_VALID_PRESSURE_READING (checked by the first 'if')
                # 2. pressureVal >= STOP_COLLECTING_PRESSURE_READING (because the 'elif' above was false)
                # 3. And 'gathering' is True (meaning we were actively collecting data)
                # So, the process has reached its end condition.
                print(f'Pressure ({pressureVal}) reached stop threshold ({STOP_COLLECTING_PRESSURE_READING}). Finalizing and sending END request.')
                gathering = False
                sendEndRequest()  # This will send CSV data and then the END signal

            # Memory monitoring (optional - can be removed in production)
            if gathering and len(csv_data) % 10 == 0:  # Every 10th data point
                print(f'Memory status: {gc.mem_free()} bytes free, {len(csv_data)} data points stored')

            # Sleep if not actively gathering data.
            # If 'gathering' is True, we just added data to CSV, and the loop will iterate
            # more quickly to gather subsequent data points.
            if not gathering:
                time.sleep(1)
            else:
                # When gathering, sleep for a shorter time to collect data more frequently
                time.sleep(0.1)  # Collect data every 100ms when actively gathering

        except Exception as e:
            # Non-fatal iteration error: log, free memory, and keep the loop alive.
            print('Iteration error:', e)
            try:
                led.off()
            except Exception:
                pass
            gc.collect()
            time.sleep(1)


try:
    main_loop()
except Exception as e:
    # Fatal: unrecoverable error escaped main_loop. Log, then reset the board
    # so the device comes back up on its own instead of hanging.
    print('FATAL error in main loop:', e)
    try:
        led.off()
    except Exception:
        pass
    time.sleep(RESET_DELAY_S)
    machine.reset()



```

## Line-By-Line Reconstruction Notes

### Line 9

```text
import network
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
import urequests
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 11

```text
import time
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 13

```text
from machine import ADC, Pin
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 14

```text
import ubinascii
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 15

```text
import machine
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 16

```text
import gc
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 19

```text
SSID = 'ULink'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 20

```text
PASSWORD = '<redacted-secret-value>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 23

```text
SERVER_URL = 'https://nfhistory.nanofab.utah.edu/sdsanalog'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 26

```text
ADC_PIN_PRESSURE = 26
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 27

```text
ADC_PIN_VAPOR = 27
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 28

```text
ADC_PIN_TEMP = 28
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 35

```text
MIN_VALID_PRESSURE_READING = 1000  # Placeholder: Adjust this value!
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 39

```text
STOP_COLLECTING_PRESSURE_READING = 65535
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 42

```text
adc0 = ADC(Pin(ADC_PIN_PRESSURE)) # Pressure
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 43

```text
adc1 = ADC(Pin(ADC_PIN_VAPOR))    # Vapor
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 44

```text
adc2 = ADC(Pin(ADC_PIN_TEMP))     # Temperature
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 45

```text
led = Pin('LED', Pin.OUT)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 48

```text
DOT_DURATION = 0.02  # seconds for a dot - Adjusted for potentially faster flashing
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 49

```text
DASH_DURATION = 3 * DOT_DURATION
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 50

```text
INTRA_CHAR_SPACE = DOT_DURATION  # Space between dots/dashes of a single character
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 51

```text
INTER_CHAR_SPACE = 3 * DOT_DURATION # Space between characters (digits or letters)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 52

```text
WORD_SPACE = 7 * DOT_DURATION       # Space between numbers or words
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 54

```text
MORSE_CODE_DICT = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 55

```text
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 56

```text
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 57

```text
    'E': '.', 'N': '-.', 'D': '-..', # For "END"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 58

```text
}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 60

```text
def _flash_signal(duration):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 61

```text
    led.on()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 62

```text
    time.sleep(duration)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 63

```text
    led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 65

```text
def _morse_element(element_type):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 66

```text
    if element_type == '.':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 67

```text
        _flash_signal(DOT_DURATION)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 68

```text
    elif element_type == '-':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 69

```text
        _flash_signal(DASH_DURATION)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 70

```text
    time.sleep(INTRA_CHAR_SPACE)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 72

```text
def _flash_morse_code_for_char(code_string):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 73

```text
    for element in code_string:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 74

```text
        _morse_element(element)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 76

```text
def flash_morse_for_number(number):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 77

```text
    s_number = str(number)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 78

```text
    for i, digit in enumerate(s_number):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 79

```text
        if digit in MORSE_CODE_DICT:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 80

```text
            _flash_morse_code_for_char(MORSE_CODE_DICT[digit])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 81

```text
            if i < len(s_number) - 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 82

```text
                time.sleep(INTER_CHAR_SPACE)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 84

```text
def flash_morse_for_message(message):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 85

```text
    for i, char_val in enumerate(message.upper()):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 86

```text
        if (char_val in MORSE_CODE_DICT):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 87

```text
            _flash_morse_code_for_char(MORSE_CODE_DICT[char_val])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 88

```text
            if i < len(message) - 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 89

```text
                time.sleep(INTER_CHAR_SPACE)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 92

```text
WIFI_CONNECT_TIMEOUT_S = 30   # Per-attempt timeout
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 93

```text
WIFI_RETRY_DELAY_S = 5        # Delay between retry attempts
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 95

```text
def connect_wifi():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 96

```text
    wlan = network.WLAN(network.STA_IF)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 97

```text
    wlan.active(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 98

```text
    attempt = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 99

```text
    while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 100

```text
        attempt += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 101

```text
        print(f'Wi-Fi connect attempt {attempt}...')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 102

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 103

```text
            if not wlan.isconnected():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 104

```text
                wlan.connect(SSID, PASSWORD)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 106

```text
            waited = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 107

```text
            while not wlan.isconnected() and waited < WIFI_CONNECT_TIMEOUT_S:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 108

```text
                led.on()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 109

```text
                time.sleep(0.1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 110

```text
                led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 111

```text
                time.sleep(0.9)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 112

```text
                waited += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 113

```text
            if wlan.isconnected():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 114

```text
                print('Connected to Wi-Fi:', wlan.ifconfig())
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 115

```text
                return wlan
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 116

```text
            print(f'Wi-Fi not connected after {WIFI_CONNECT_TIMEOUT_S}s, retrying...')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 117

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 118

```text
            print('Wi-Fi error:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 120

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 121

```text
            wlan.disconnect()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 122

```text
        except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 123

```text
            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 124

```text
        time.sleep(WIFI_RETRY_DELAY_S)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 126

```text
wlan = connect_wifi()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 127

```text
gathering = False
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 130

```text
csv_data = []  # Store all readings as CSV rows
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 131

```text
csv_header = "timestamp,pressure,vapor,temp\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 132

```text
first_timestamp = None  # Track the first timestamp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 135

```text
BATCH_SIZE = 20  # Reduced for memory efficiency
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 138

```text
MIN_CSV_LINES = 3  # Won't send if CSV has fewer than 3 data lines
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 141

```text
MAX_CSV_POINTS = 50  # Auto-send when reaching this many points
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 144

```text
AUTO_SEND_INTERVAL_MS = 300000  # Auto-send every 5 minutes (300,000ms)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 145

```text
last_auto_send_time = time.ticks_ms()  # Track last auto-send time
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 148

```text
SESSION_ID = ubinascii.hexlify(machine.unique_id()).decode('utf-8')[:8]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 151

```text
def check_auto_send():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 152

```text
    global csv_data, last_auto_send_time
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 154

```text
    current_time = time.ticks_ms()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 155

```text
    time_since_last_send = time.ticks_diff(current_time, last_auto_send_time)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 158

```text
    if len(csv_data) >= MAX_CSV_POINTS:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 159

```text
        print(f'Auto-send triggered: {len(csv_data)} data points reached maximum ({MAX_CSV_POINTS})')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 160

```text
        send_csv_in_batches()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 161

```text
        last_auto_send_time = current_time
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 162

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 165

```text
    if time_since_last_send >= AUTO_SEND_INTERVAL_MS:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 166

```text
        if len(csv_data) >= MIN_CSV_LINES:  # Only send if we have enough data
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 167

```text
            print(f'Auto-send triggered: {time_since_last_send}ms elapsed (interval: {AUTO_SEND_INTERVAL_MS}ms)')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 168

```text
            send_complete_csv()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 169

```text
            last_auto_send_time = current_time
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 170

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 171

```text
            print(f'Auto-send timer elapsed but only {len(csv_data)} data points (minimum: {MIN_CSV_LINES})')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 172

```text
            last_auto_send_time = current_time  # Reset timer even if not sending
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 175

```text
def add_data_to_csv(pressureVal, vaporVal, tempVal):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 176

```text
    global csv_data, first_timestamp
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 182

```text
    pressure_percentage = int((pressureVal / 65535) * 100)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 183

```text
    flash_morse_for_number(pressure_percentage)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 186

```text
    current_timestamp = time.ticks_ms()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 189

```text
    if first_timestamp is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 190

```text
        first_timestamp = current_timestamp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 191

```text
        relative_timestamp = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 192

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 194

```text
        relative_timestamp = time.ticks_diff(current_timestamp, first_timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 197

```text
    csv_row = f"{relative_timestamp},{pressureVal},{vaporVal},{tempVal}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 198

```text
    csv_data.append(csv_row)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
    print(f'Added data point {len(csv_data)}: Pressure={pressureVal}, Time={relative_timestamp}ms')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 203

```text
    check_auto_send()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
def send_csv_in_batches():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 207

```text
    global csv_data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 209

```text
    if not csv_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 210

```text
        print('No data to send')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 211

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 214

```text
    if len(csv_data) < MIN_CSV_LINES:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 215

```text
        print(f'CSV has only {len(csv_data)} data points, minimum required is {MIN_CSV_LINES}. Discarding data (likely noise/static).')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 216

```text
        csv_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 217

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 219

```text
    total_points = len(csv_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 220

```text
    total_batches = (total_points + BATCH_SIZE - 1) // BATCH_SIZE
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 221

```text
    print(f'Sending {total_points} data points in batches of {BATCH_SIZE}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 224

```text
    flash_morse_for_number(total_points)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 225

```text
    time.sleep(WORD_SPACE)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 228

```text
    batch_num = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 229

```text
    for i in range(0, total_points, BATCH_SIZE):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 230

```text
        batch_num += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 231

```text
        batch_data = csv_data[i:i + BATCH_SIZE]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 234

```text
        batch_pressure_sum = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 235

```text
        batch_pressure_count = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 236

```text
        for row in batch_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 238

```text
            parts = row.strip().split(',')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 239

```text
            if len(parts) >= 2:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 240

```text
                batch_pressure_sum += int(parts[1])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 241

```text
                batch_pressure_count += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 243

```text
        batch_pressure_average = batch_pressure_sum / batch_pressure_count if batch_pressure_count > 0 else 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 244

```text
        print(f'Batch {batch_num} Average Pressure: {batch_pressure_average:.2f}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 247

```text
        gc.collect()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 248

```text
        print(f'Free memory: {gc.mem_free()} bytes')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 250

```text
        led.on()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 253

```text
        csv_content = csv_header + ''.join(batch_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 255

```text
        headers = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 256

```text
            'Content-Type': 'text/csv',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 257

```text
            'Content-Length': str(len(csv_content)),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 258

```text
            'X-Session-ID': SESSION_ID,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 259

```text
            'X-Batch-Number': str(batch_num),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 260

```text
            'X-Total-Batches': str(total_batches),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 261

```text
            'X-Batch-Points': str(len(batch_data)),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 262

```text
            'X-Is-Final-Batch': 'true' if batch_num == total_batches else 'false'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 263

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 265

```text
        response = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 266

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 267

```text
            response = urequests.post(SERVER_URL, data=csv_content, headers=headers)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 268

```text
            print(f'Batch {batch_num} sent successfully: {response.status_code}, Points: {len(batch_data)}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 271

```text
            led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 272

```text
            time.sleep(0.1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 273

```text
            led.on()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 274

```text
            time.sleep(0.1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 276

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 277

```text
            print(f'Failed to send batch {batch_num} with {len(batch_data)} points:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 278

```text
            print('Headers:', headers)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 280

```text
            if 'ENOMEM' in str(e) or 'MBEDTLS_ERR' in str(e):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 281

```text
                print('Memory error - forcing cleanup')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 282

```text
                if response:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 283

```text
                    response.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 284

```text
                    response = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 285

```text
                gc.collect()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 286

```text
                time.sleep(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 287

```text
        finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 288

```text
            if response:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 289

```text
                response.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 290

```text
            led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 293

```text
        csv_content = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 294

```text
        headers = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 295

```text
        batch_data = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 296

```text
        gc.collect()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 297

```text
        time.sleep(1)  # Recovery time between batches
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 299

```text
    csv_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 300

```text
    print(f'Finished sending {batch_num} batches')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 303

```text
def send_complete_csv():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 304

```text
    global csv_data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 306

```text
    if not csv_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 307

```text
        print('No data to send')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 308

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 311

```text
    if len(csv_data) < MIN_CSV_LINES:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 312

```text
        print(f'CSV has only {len(csv_data)} data points, minimum required is {MIN_CSV_LINES}. Discarding data (likely noise/static).')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 314

```text
        csv_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 315

```text
        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 318

```text
    if len(csv_data) <= BATCH_SIZE:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 320

```text
        data_pressure_sum = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 321

```text
        data_pressure_count = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 322

```text
        for row in csv_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 324

```text
            parts = row.strip().split(',')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 325

```text
            if len(parts) >= 2:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 326

```text
                data_pressure_sum += int(parts[1])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 327

```text
                data_pressure_count += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 329

```text
        data_pressure_average = data_pressure_sum / data_pressure_count if data_pressure_count > 0 else 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 330

```text
        print(f'Payload Average Pressure: {data_pressure_average:.2f}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 333

```text
        flash_morse_for_number(len(csv_data))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 334

```text
        time.sleep(WORD_SPACE)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 336

```text
        led.on()  # Turn LED solid on for the network request duration
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 339

```text
        csv_content = csv_header + ''.join(csv_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 341

```text
        headers = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 342

```text
            'Content-Type': 'text/csv',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 343

```text
            'Content-Length': str(len(csv_content)),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 344

```text
            'X-Session-ID': SESSION_ID,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 345

```text
            'X-Batch-Number': '1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 346

```text
            'X-Total-Batches': '1',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 347

```text
            'X-Batch-Points': str(len(csv_data)),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 348

```text
            'X-Is-Final-Batch': 'true'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 349

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 351

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 352

```text
            response = urequests.post(SERVER_URL, data=csv_content, headers=headers)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 353

```text
            print(f'CSV sent successfully: {response.status_code}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 354

```text
            print(f'Data points sent: {len(csv_data)}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 355

```text
            print('Response text:', response.text)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 356

```text
            response.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 359

```text
            csv_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 361

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 362

```text
            print(f'Failed to send CSV with {len(csv_data)} data points:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 363

```text
            print('Falling back to batch sending...')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 364

```text
            send_csv_in_batches()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 365

```text
        finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 366

```text
            led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 367

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 369

```text
        print(f'Data too large ({len(csv_data)} points), sending in batches')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 370

```text
        send_csv_in_batches()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 373

```text
def send_data(pressureVal, vaporVal, tempVal):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 374

```text
    global gathering
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 378

```text
    pressure_percentage = int((pressureVal / 65535) * 100)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 381

```text
    flash_morse_for_number(pressure_percentage)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 384

```text
    led.on() # Turn LED solid on for the network request duration
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 386

```text
    payload = json.dumps({'pressure': pressureVal, 'vapor': vaporVal, 'temp': tempVal})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 389

```text
    print(f'Payload Pressure: {pressureVal}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 391

```text
    headers = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 392

```text
        'Content-Type': 'application/json',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 393

```text
        'Content-Length': str(len(payload))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 394

```text
    }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 395

```text
    gathering = True
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 396

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 397

```text
        response = urequests.post(SERVER_URL, data=payload, headers=headers)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 398

```text
        print('Response status:', response.status_code)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 399

```text
        print('Response text:', response.text)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 400

```text
        response.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 401

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 402

```text
        print('Payload:', payload)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 403

```text
        print('Headers:', headers)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 404

```text
        print('Failed to send data:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 405

```text
    finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 406

```text
        led.off() # Ensure LED is off after the operation
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 408

```text
def sendEndRequest():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 409

```text
    """Send an END signal to the server to finalize the session"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 410

```text
    global csv_data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 413

```text
    if csv_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 414

```text
        print('Sending final CSV data before END signal...')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 415

```text
        send_complete_csv()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 417

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 419

```text
        data = json.dumps({'session_id': SESSION_ID})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 420

```text
        headers = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 421

```text
            'Content-Type': 'application/json',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 422

```text
            'Content-Length': str(len(data)),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 423

```text
            'X-Session-ID': SESSION_ID
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 424

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 426

```text
        response = urequests.post(SERVER_URL + 'finished', data=data, headers=headers)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 427

```text
        print(f'END signal sent. Response: {response.status_code}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 428

```text
        if response.status_code == 200:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 429

```text
            response_data = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 430

```text
            print(f'Server response: {response_data}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 431

```text
        response.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 433

```text
        print('END signal sent successfully')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 435

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 436

```text
        print(f'Failed to send END signal: {e}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 437

```text
    finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 438

```text
        led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 441

```text
RESET_DELAY_S = 5  # Delay before machine.reset() on fatal error, so logs flush
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 443

```text
def main_loop():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 444

```text
    global wlan
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 445

```text
    while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 447

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 448

```text
            if not wlan.isconnected():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 449

```text
                print('Wi-Fi disconnected, reconnecting...')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 450

```text
                wlan = connect_wifi()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 451

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 452

```text
            print('Wi-Fi check failed:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 453

```text
            wlan = connect_wifi()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 455

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 456

```text
            pressureVal = adc0.read_u16()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 457

```text
            vaporVal = adc1.read_u16()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 458

```text
            tempVal = adc2.read_u16()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 459

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 460

```text
            print('ADC read failed:', e)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 461

```text
            time.sleep(1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 462

```text
            continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 464

```text
        print('Analog value (Pressure):', pressureVal) # Logging the primary control value
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 466

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 467

```text
            if pressureVal < MIN_VALID_PRESSURE_READING:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 469

```text
                if gathering:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 471

```text
                    print(f'Pressure ({pressureVal}) fell below threshold ({MIN_VALID_PRESSURE_READING}). Sending final CSV and stopping.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 472

```text
                    gathering = False
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 473

```text
                    send_complete_csv()  # Send accumulated data before stopping
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 475

```text
                    first_timestamp = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 476

```text
                    print('Timestamp reset - ready for next run')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 477

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 479

```text
                    print(f'Pressure ({pressureVal}) below threshold ({MIN_VALID_PRESSURE_READING}). System idle or disconnected. Not sending data.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 482

```text
            elif pressureVal < STOP_COLLECTING_PRESSURE_READING:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 484

```text
                print('Adding data for pressure:', pressureVal)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 485

```text
                add_data_to_csv(pressureVal, vaporVal, tempVal)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 486

```text
                gathering = True
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 489

```text
                if len(csv_data) > 100:  # Emergency send if somehow auto-send didn't trigger
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 490

```text
                    print('Emergency auto-send: too much data accumulated')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 491

```text
                    send_csv_in_batches()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 493

```text
            elif gathering:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 499

```text
                print(f'Pressure ({pressureVal}) reached stop threshold ({STOP_COLLECTING_PRESSURE_READING}). Finalizing and sending END request.')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 500

```text
                gathering = False
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 501

```text
                sendEndRequest()  # This will send CSV data and then the END signal
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 504

```text
            if gathering and len(csv_data) % 10 == 0:  # Every 10th data point
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 505

```text
                print(f'Memory status: {gc.mem_free()} bytes free, {len(csv_data)} data points stored')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 510

```text
            if not gathering:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 511

```text
                time.sleep(1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 512

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 514

```text
                time.sleep(0.1)  # Collect data every 100ms when actively gathering
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 516

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 518

```text
            print('Iteration error:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 520

```text
                led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 521

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 522

```text
                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 523

```text
            gc.collect()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 524

```text
            time.sleep(1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 527

```text
try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 528

```text
    main_loop()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 529

```text
except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 532

```text
    print('FATAL error in main loop:', e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 533

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 534

```text
        led.off()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 535

```text
    except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 536

```text
        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 537

```text
    time.sleep(RESET_DELAY_S)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 538

```text
    machine.reset()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/PicoParylene.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/PicoParylene.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/PicoParylene.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/PicoParylene.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/PicoParylene.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/PicoParylene.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/PicoParylene.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/PicoParylene.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/PicoParylene.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/PicoParylene.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/PicoParylene.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/PicoParylene.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/PicoParylene.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/PicoParylene.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/PicoParylene.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/PicoParylene.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/PicoParylene.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/PicoParylene.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/PicoParylene.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/PicoParylene.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/PicoParylene.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/PicoParylene.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/PicoParylene.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/PicoParylene.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
