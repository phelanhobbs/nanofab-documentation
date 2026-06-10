

# Source Reconstruction: UNanofabTools/ParticleSensor.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `ParticleSensor.py`
- Lines read: `148`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `a13cf5c3b71b00da`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import time`, `import struct`, `from machine import I2C, Pin`
- Classes: `SPS30`
- Functions: `_crc8_word`, `format_row`, `main`, `__init__`, `_write_ptr`, `_write_ptr_with_data`, `start_measurement_float`, `stop_measurement`, `read_data_ready`, `read_measured_values_float`
- Routes: none detected

## Sanitized Source Excerpt

```python
import time
import struct
from machine import I2C, Pin

# ===== User config =====
I2C_ID = 0          # 0 or 1
SDA_PIN = 4         # GP4 for I2C0
SCL_PIN = 5         # GP5 for I2C0
ADDR    = 0x69      # SPS30 I2C address
PRINT_PERIOD_S = 1  # SPS30 updates every ~1 s

# ===== SPS30 constants (from datasheet) =====
# Command "pointers"
PTR_START_MEAS   = 0x0010  # write: [0x03, 0x00, CRC] for big-endian IEEE754 floats
PTR_STOP_MEAS    = 0x0104
PTR_DATA_RDY     = 0x0202  # read 3 bytes (2 data + CRC); byte[1] is flag (0x01 ready)
PTR_READ_VALUES  = 0x0300  # read 60 bytes for float format (10 floats, 2 CRCs per float)
# CRC-8 parameters for word packets (poly 0x31, init 0xFF)
def _crc8_word(b0, b1):
    crc = 0xFF
    for byte in (b0, b1):
        crc ^= byte
        for _ in range(8):
            crc = ((crc << 1) ^ 0x31) & 0xFF if (crc & 0x80) else ((crc << 1) & 0xFF)
    return crc

class SPS30:
    def __init__(self, i2c, addr=ADDR):
        self.i2c = i2c
        self.addr = addr

    def _write_ptr(self, ptr):
        # Write 16-bit pointer, big-endian
        self.i2c.writeto(self.addr, bytes([(ptr >> 8) & 0xFF, ptr & 0xFF]))

    def _write_ptr_with_data(self, ptr, payload):
        self.i2c.writeto(self.addr, bytes([(ptr >> 8) & 0xFF, ptr & 0xFF]) + payload)

    def start_measurement_float(self):
        # payload: [0x03, 0x00, CRC]  => 0x03 selects float output; 0x00 dummy; CRC over the two bytes
        b0, b1 = 0x03, 0x00
        crc = _crc8_word(b0, b1)
        self._write_ptr_with_data(PTR_START_MEAS, bytes([b0, b1, crc]))

    def stop_measurement(self):
        self._write_ptr(PTR_STOP_MEAS)

    def read_data_ready(self):
        self._write_ptr(PTR_DATA_RDY)
        data = self.i2c.readfrom(self.addr, 3)  # 2 bytes + CRC
        # verify CRC (optional, but let's be good)
        if _crc8_word(data[0], data[1]) != data[2]:
            return False
        return data[1] == 0x01

    def read_measured_values_float(self):
        # Returns list of 10 floats:
        # [mass_PM1, mass_PM2_5, mass_PM4, mass_PM10,
        #  num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, typical_particle_size_um]
        self._write_ptr(PTR_READ_VALUES)
        raw = self.i2c.readfrom(self.addr, 60)  # 10 floats * (2 bytes + CRC + 2 bytes + CRC)
        vals = []
        # Each float spans 6 bytes: [hi0, hi1, CRC, lo0, lo1, CRC]
        for i in range(10):
            base = i * 6
            hi0, hi1, crc1, lo0, lo1, crc2 = raw[base:base+6]
            if _crc8_word(hi0, hi1) != crc1 or _crc8_word(lo0, lo1) != crc2:
                raise ValueError("CRC error on float index {}".format(i))
            fbytes = bytes([hi0, hi1, lo0, lo1])  # big-endian 32-bit float
            vals.append(struct.unpack('>f', fbytes)[0])
        return vals

def format_row(v):
    # Keep it tight but readable
    return "{:10.2f}".format(v)

def main():
    i2c = I2C(I2C_ID, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=100_000)
    sps = SPS30(i2c)

    # Start measurement in float mode
    sps.start_measurement_float()

    # Warm-up: sensor specifies ~1 s cadence; stable startup may take several seconds.
    # We'll just wait for first ready flag and go.
    t0 = time.ticks_ms()
    while not sps.read_data_ready():
        if time.ticks_diff(time.ticks_ms(), t0) > 5000:
            # If the flag isn't toggling, still proceed (some stacks poll less reliably).
            break
        time.sleep_ms(100)

    # Header
    print("SPS30 number concentration (#/cm^3)")
    print("Bins: [0.3–0.5] [0.5–1] [1–2.5] [2.5–4] [4–10] | Cumulative: [>=0.3] [>=0.5] [>=1] [>=4] [>=10]")
    print("-" * 100)

    try:
        while True:
            # Optionally poll data-ready (not strictly required)
            # if not sps.read_data_ready(): time.sleep_ms(50); continue

            vals = sps.read_measured_values_float()
            # Unpack fields per datasheet order
            mass_PM1, mass_PM2_5, mass_PM4, mass_PM10, \
            num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, tps_um = vals

            # Differential (disjoint) bins derived from cumulative-to-upper-edge channels:
            # B0: 0.3–0.5       = PM0.5
            # B1: 0.5–1.0       = PM1.0  - PM0.5
            # B2: 1.0–2.5       = PM2.5  - PM1.0
            # B3: 2.5–4.0       = PM4.0  - PM2.5
            # B4: 4.0–10.0      = PM10   - PM4.0
            b0 = max(num_PM0_5, 0.0)
            b1 = max(num_PM1 - num_PM0_5, 0.0)
            b2 = max(num_PM2_5 - num_PM1, 0.0)
            b3 = max(num_PM4 - num_PM2_5, 0.0)
            b4 = max(num_PM10 - num_PM4, 0.0)

            # Cumulative (>= threshold) using the available cutoffs:
            # >=0.3 = PM10, >=0.5 = PM10 - PM0.5, >=1 = PM10 - PM1.0, >=4 = PM10 - PM4.0, >=10 ~= 0 (upper edge)
            c03 = max(num_PM10, 0.0)
            c05 = max(num_PM10 - num_PM0_5, 0.0)
            c1  = max(num_PM10 - num_PM1,   0.0)
            c4  = max(num_PM10 - num_PM4,   0.0)
            c10 = 0.0  # upper limit is 10 µm; there's no ">=10" bin within SPS30's range

            # Print one line
            line = (
                f"{format_row(b0)} {format_row(b1)} {format_row(b2)} {format_row(b3)} {format_row(b4)} |"
                f" {format_row(c03)} {format_row(c05)} {format_row(c1)} {format_row(c4)} {format_row(c10)}"
            )
            print(line)

            # Optional: also show typical particle size (µm) now and then
            # print("TPS: {:.2f} µm".format(tps_um))

            time.sleep(PRINT_PERIOD_S)
    except KeyboardInterrupt:
        pass
    finally:
        try:
            sps.stop_measurement()
        except Exception:
            pass

if __name__ == "__main__":
    main()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
import time
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 2

```text
import struct
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 3

```text
from machine import I2C, Pin
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 6

```text
I2C_ID = 0          # 0 or 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 7

```text
SDA_PIN = 4         # GP4 for I2C0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 8

```text
SCL_PIN = 5         # GP5 for I2C0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 9

```text
ADDR    = 0x69      # SPS30 I2C address
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 10

```text
PRINT_PERIOD_S = 1  # SPS30 updates every ~1 s
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 14

```text
PTR_START_MEAS   = 0x0010  # write: [0x03, 0x00, CRC] for big-endian IEEE754 floats
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 15

```text
PTR_STOP_MEAS    = 0x0104
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 16

```text
PTR_DATA_RDY     = 0x0202  # read 3 bytes (2 data + CRC); byte[1] is flag (0x01 ready)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 17

```text
PTR_READ_VALUES  = 0x0300  # read 60 bytes for float format (10 floats, 2 CRCs per float)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 19

```text
def _crc8_word(b0, b1):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 20

```text
    crc = 0xFF
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 21

```text
    for byte in (b0, b1):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 22

```text
        crc ^= byte
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 23

```text
        for _ in range(8):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 24

```text
            crc = ((crc << 1) ^ 0x31) & 0xFF if (crc & 0x80) else ((crc << 1) & 0xFF)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 25

```text
    return crc
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 27

```text
class SPS30:
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 28

```text
    def __init__(self, i2c, addr=ADDR):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 29

```text
        self.i2c = i2c
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 30

```text
        self.addr = addr
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 32

```text
    def _write_ptr(self, ptr):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 34

```text
        self.i2c.writeto(self.addr, bytes([(ptr >> 8) & 0xFF, ptr & 0xFF]))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 36

```text
    def _write_ptr_with_data(self, ptr, payload):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 37

```text
        self.i2c.writeto(self.addr, bytes([(ptr >> 8) & 0xFF, ptr & 0xFF]) + payload)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 39

```text
    def start_measurement_float(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 41

```text
        b0, b1 = 0x03, 0x00
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 42

```text
        crc = _crc8_word(b0, b1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 43

```text
        self._write_ptr_with_data(PTR_START_MEAS, bytes([b0, b1, crc]))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 45

```text
    def stop_measurement(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 46

```text
        self._write_ptr(PTR_STOP_MEAS)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 48

```text
    def read_data_ready(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 49

```text
        self._write_ptr(PTR_DATA_RDY)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 50

```text
        data = self.i2c.readfrom(self.addr, 3)  # 2 bytes + CRC
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 52

```text
        if _crc8_word(data[0], data[1]) != data[2]:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 53

```text
            return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 54

```text
        return data[1] == 0x01
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 56

```text
    def read_measured_values_float(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 60

```text
        self._write_ptr(PTR_READ_VALUES)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 61

```text
        raw = self.i2c.readfrom(self.addr, 60)  # 10 floats * (2 bytes + CRC + 2 bytes + CRC)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 62

```text
        vals = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 64

```text
        for i in range(10):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 65

```text
            base = i * 6
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 66

```text
            hi0, hi1, crc1, lo0, lo1, crc2 = raw[base:base+6]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 67

```text
            if _crc8_word(hi0, hi1) != crc1 or _crc8_word(lo0, lo1) != crc2:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 68

```text
                raise ValueError("CRC error on float index {}".format(i))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
            fbytes = bytes([hi0, hi1, lo0, lo1])  # big-endian 32-bit float
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 70

```text
            vals.append(struct.unpack('>f', fbytes)[0])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 71

```text
        return vals
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 73

```text
def format_row(v):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 75

```text
    return "{:10.2f}".format(v)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 77

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 78

```text
    i2c = I2C(I2C_ID, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=100_000)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 79

```text
    sps = SPS30(i2c)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 82

```text
    sps.start_measurement_float()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 86

```text
    t0 = time.ticks_ms()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 87

```text
    while not sps.read_data_ready():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 88

```text
        if time.ticks_diff(time.ticks_ms(), t0) > 5000:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 90

```text
            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 91

```text
        time.sleep_ms(100)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 94

```text
    print("SPS30 number concentration (#/cm^3)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 95

```text
    print("Bins: [0.3–0.5] [0.5–1] [1–2.5] [2.5–4] [4–10] | Cumulative: [>=0.3] [>=0.5] [>=1] [>=4] [>=10]")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 96

```text
    print("-" * 100)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 98

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 99

```text
        while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 103

```text
            vals = sps.read_measured_values_float()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 105

```text
            mass_PM1, mass_PM2_5, mass_PM4, mass_PM10, \
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 106

```text
            num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, tps_um = vals
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 114

```text
            b0 = max(num_PM0_5, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 115

```text
            b1 = max(num_PM1 - num_PM0_5, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 116

```text
            b2 = max(num_PM2_5 - num_PM1, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 117

```text
            b3 = max(num_PM4 - num_PM2_5, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 118

```text
            b4 = max(num_PM10 - num_PM4, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 122

```text
            c03 = max(num_PM10, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 123

```text
            c05 = max(num_PM10 - num_PM0_5, 0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 124

```text
            c1  = max(num_PM10 - num_PM1,   0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 125

```text
            c4  = max(num_PM10 - num_PM4,   0.0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 126

```text
            c10 = 0.0  # upper limit is 10 µm; there's no ">=10" bin within SPS30's range
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 129

```text
            line = (
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 130

```text
                f"{format_row(b0)} {format_row(b1)} {format_row(b2)} {format_row(b3)} {format_row(b4)} |"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 131

```text
                f" {format_row(c03)} {format_row(c05)} {format_row(c1)} {format_row(c4)} {format_row(c10)}"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 132

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 133

```text
            print(line)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 138

```text
            time.sleep(PRINT_PERIOD_S)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 139

```text
    except KeyboardInterrupt:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 140

```text
        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 141

```text
    finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 142

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 143

```text
            sps.stop_measurement()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 144

```text
        except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 145

```text
            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 147

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 148

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/ParticleSensor.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/ParticleSensor.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/ParticleSensor.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/ParticleSensor.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/ParticleSensor.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/ParticleSensor.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/ParticleSensor.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/ParticleSensor.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/ParticleSensor.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/ParticleSensor.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/ParticleSensor.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/ParticleSensor.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/ParticleSensor.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/ParticleSensor.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/ParticleSensor.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/ParticleSensor.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/ParticleSensor.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/ParticleSensor.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/ParticleSensor.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/ParticleSensor.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/ParticleSensor.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/ParticleSensor.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/ParticleSensor.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/ParticleSensor.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
