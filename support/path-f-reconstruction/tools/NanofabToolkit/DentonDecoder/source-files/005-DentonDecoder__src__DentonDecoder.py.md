

# Source Reconstruction: NanofabToolkit/DentonDecoder/src/DentonDecoder.py

- Repository: `NanofabToolkit`
- Relative path: `DentonDecoder/src/DentonDecoder.py`
- Lines read: `150`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `63d4379a4337e86a`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import argparse`, `import csv`, `import struct`, `import os`, `import tempfile`
- Classes: none detected
- Functions: `convertFile`, `main`
- Routes: none detected

## Sanitized Source Excerpt

```python
import argparse
import csv
import struct
import os
import tempfile

def convertFile(filePath):
    """
    Converts a .dat file to a CSV file.
    Parameters:
    filePath (str): Path to the .dat file

    Returns:
    str: Path to the converted CSV file
    """
    # Check if file exists
    if not os.path.exists(filePath):
        raise FileNotFoundError(f"File does not exist: {filePath}")

    # Check if file is readable
    if not os.access(filePath, os.R_OK):
        raise PermissionError(f"Cannot read file: {filePath}")

    try:
        # Open the .denton file in binary mode
        with open(filePath, 'rb') as f:
            data = f.read()
    except Exception as e:
        raise IOError(f"Failed to read file {filePath}: {str(e)}")

    # Create a new .csv file in the user's temporary directory to avoid permission issues
    filename_base = os.path.splitext(os.path.basename(filePath))[0]
    temp_dir = tempfile.gettempdir()
    csvFilePath = os.path.join(temp_dir, f"{filename_base}.csv")
    print(f"Debug: CSV will be written to: {csvFilePath}")
    decoded_values = []

    # Iterate through the data in 128 byte chunks
    i = 0
    while i < len(data):
        # Process the next 128 bytes
        chunk = data[i:i + 128]

        if len(chunk) >= 4:
            # Format of 0x08 0x00 0x?? 0x00 means next ?? bytes are chars
            if chunk[0] == 0x08 and chunk[1] == 0x00 and chunk[3] == 0x00:
                text_length = chunk[2]
                if 4 + text_length <= len(chunk):
                    text = chunk[4:4 + text_length].decode('ascii', errors='replace')
                    decoded_values.append(text)

            # Format of 0x05 0x00 means next 8 bytes are double
            elif chunk[0] == 0x05 and chunk[1] == 0x00 and len(chunk) >= 10:
                try:
                    # Extract the 8 bytes for the double value
                    double_bytes = chunk[2:10]
                    # Unpack as little-endian double
                    double_val = struct.unpack('<d', double_bytes)[0]
                    decoded_values.append(double_val)
                except struct.error as e:
                    print(f"Error unpacking double at position {i}: {e}")
                    # For debugging, print the bytes
                    print(f"Bytes: {[hex(b) for b in double_bytes]}")
                    decoded_values.append("ERROR")

            # Format of 0x03 0x00 means next 4 bytes are int
            elif chunk[0] == 0x03 and chunk[1] == 0x00 and len(chunk) >= 6:
                try:
                    # Extract the 4 bytes for the int value
                    int_bytes = chunk[2:6]
                    # Unpack as little-endian int
                    int_val = struct.unpack('<I', int_bytes)[0]
                    decoded_values.append(int_val)
                except struct.error as e:
                    print(f"Error unpacking int at position {i}: {e}")
                    # For debugging, print the bytes
                    print(f"Bytes: {[hex(b) for b in int_bytes]}")
                    decoded_values.append("ERROR")

        i += 128

    # Format the decoded values into a table structure
    # First 27 values become headers, rest become rows of 27 columns each
    headers = decoded_values[:27]
    data_rows = []

    # Process remaining values into rows of 27 columns each
    remaining_values = decoded_values[27:]
    for i in range(0, len(remaining_values), 27):
        row = remaining_values[i:i+27]
        # Pad row with empty strings if needed to ensure 27 columns
        while len(row) < 27:
            row.append("")
        data_rows.append(row)

    # Write content to a csv
    try:
        # Check if we can write to the directory
        csv_dir = os.path.dirname(csvFilePath)
        if not os.access(csv_dir, os.W_OK):
            raise PermissionError(f"No write permission for directory: {csv_dir}")

        print(f"Debug: Writing CSV file with {len(headers)} headers and {len(data_rows)} rows")
        with open(csvFilePath, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(headers)  # Write headers
            writer.writerows(data_rows)  # Write data rows
        print(f"Debug: Successfully wrote CSV file: {csvFilePath}")
    except Exception as e:
        raise IOError(f"Failed to write CSV file {csvFilePath}: {str(e)}")

    return csvFilePath

def main():
    parser = argparse.ArgumentParser(description="Convert .dat files to CSV files")
    parser.add_argument("filePath", type=str, help="Path to the .dat file")
    parser.add_argument("--output", type=str, help="Path to the output CSV file")

    args = parser.parse_args()

    # Check if the input file exists
    if not os.path.isfile(args.filePath):
        print(f"Error: Input file '{args.filePath}' does not exist.")
        return 1

    # Check if the input file has the .dat extension
    if not args.filePath.lower().endswith('.dat'):
        print(f"Warning: Input file '{args.filePath}' does not have a .dat extension.")

    try:
        # Convert the file
        output_file = convertFile(args.filePath)

        # If an output path was specified, rename the file
        if args.output:
            if os.path.exists(output_file):
                # If the output file already exists, rename it
                if os.path.exists(args.output):
                    os.remove(args.output)
                os.rename(output_file, args.output)
                output_file = args.output

        print(f"Successfully converted '{args.filePath}' to '{output_file}'")
        return 0
    except Exception as e:
        print(f"Error converting file: {e}")
        return 1

if __name__ == "__main__":
    main()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
import argparse
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 1 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `none` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
import csv
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 2 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
import struct
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 3 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
import os
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 4 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
import tempfile
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
def convertFile(filePath):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 7 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
    """
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 8 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
    Converts a .dat file to a CSV file.
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 9 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
    Parameters:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 10 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
    filePath (str): Path to the .dat file
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 11 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 12 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    Returns:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 13 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
    str: Path to the converted CSV file
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 14 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
    """
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 15 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    # Check if file exists
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 16 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    if not os.path.exists(filePath):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 17 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
        raise FileNotFoundError(f"File does not exist: {filePath}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 18 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 19 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    # Check if file is readable
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 20 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
    if not os.access(filePath, os.R_OK):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 21 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
        raise PermissionError(f"Cannot read file: {filePath}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 22 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 24 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
        # Open the .denton file in binary mode
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 25 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        with open(filePath, 'rb') as f:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 26 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
            data = f.read()
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 27 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    except Exception as e:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 28 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        raise IOError(f"Failed to read file {filePath}: {str(e)}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 29 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 30 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    # Create a new .csv file in the user's temporary directory to avoid permission issues
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 31 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    filename_base = os.path.splitext(os.path.basename(filePath))[0]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 32 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    temp_dir = tempfile.gettempdir()
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 33 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    csvFilePath = os.path.join(temp_dir, f"{filename_base}.csv")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 34 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    print(f"Debug: CSV will be written to: {csvFilePath}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 35 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    decoded_values = []
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 36 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 37 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    # Iterate through the data in 128 byte chunks
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 38 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    i = 0
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 39 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
    while i < len(data):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 40 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        # Process the next 128 bytes
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 41 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        chunk = data[i:i + 128]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 42 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 43 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
        if len(chunk) >= 4:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 44 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
            # Format of 0x08 0x00 0x?? 0x00 means next ?? bytes are chars
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 45 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            if chunk[0] == 0x08 and chunk[1] == 0x00 and chunk[3] == 0x00:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 46 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
                text_length = chunk[2]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 47 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
                if 4 + text_length <= len(chunk):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 48 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
                    text = chunk[4:4 + text_length].decode('ascii', errors='replace')
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 49 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
                    decoded_values.append(text)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 50 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            # Format of 0x05 0x00 means next 8 bytes are double
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 52 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
            elif chunk[0] == 0x05 and chunk[1] == 0x00 and len(chunk) >= 10:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 53 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
                try:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 54 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
                    # Extract the 8 bytes for the double value
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 55 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
                    double_bytes = chunk[2:10]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 56 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
                    # Unpack as little-endian double
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 57 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
                    double_val = struct.unpack('<d', double_bytes)[0]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 58 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
                    decoded_values.append(double_val)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 59 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
                except struct.error as e:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 60 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
                    print(f"Error unpacking double at position {i}: {e}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 61 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
                    # For debugging, print the bytes
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 62 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
                    print(f"Bytes: {[hex(b) for b in double_bytes]}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 63 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
                    decoded_values.append("ERROR")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 64 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 65 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
            # Format of 0x03 0x00 means next 4 bytes are int
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 66 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
            elif chunk[0] == 0x03 and chunk[1] == 0x00 and len(chunk) >= 6:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 67 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
                try:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 68 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `branch` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
                    # Extract the 4 bytes for the int value
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 69 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
                    int_bytes = chunk[2:6]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 70 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
                    # Unpack as little-endian int
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 71 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
                    int_val = struct.unpack('<I', int_bytes)[0]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 72 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
                    decoded_values.append(int_val)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 73 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
                except struct.error as e:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 74 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
                    print(f"Error unpacking int at position {i}: {e}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 75 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
                    # For debugging, print the bytes
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 76 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
                    print(f"Bytes: {[hex(b) for b in int_bytes]}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 77 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
                    decoded_values.append("ERROR")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 78 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 79 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
        i += 128
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 80 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 81 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    # Format the decoded values into a table structure
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 82 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
    # First 27 values become headers, rest become rows of 27 columns each
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 83 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
    headers = decoded_values[:27]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 84 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
    data_rows = []
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 85 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 86 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
    # Process remaining values into rows of 27 columns each
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 87 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
    remaining_values = decoded_values[27:]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 88 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
    for i in range(0, len(remaining_values), 27):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 89 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        row = remaining_values[i:i+27]
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 90 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `loop` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
        # Pad row with empty strings if needed to ensure 27 columns
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 91 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
        while len(row) < 27:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 92 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
            row.append("")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 93 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `loop` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
        data_rows.append(row)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 94 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 95 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
    # Write content to a csv
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 96 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 97 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
        # Check if we can write to the directory
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 98 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
        csv_dir = os.path.dirname(csvFilePath)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 99 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
        if not os.access(csv_dir, os.W_OK):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 100 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
            raise PermissionError(f"No write permission for directory: {csv_dir}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 101 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 102 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
        print(f"Debug: Writing CSV file with {len(headers)} headers and {len(data_rows)} rows")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 103 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
        with open(csvFilePath, 'w', newline='') as csvfile:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 104 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
            writer = csv.writer(csvfile)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 105 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
            writer.writerow(headers)  # Write headers
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 106 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
            writer.writerows(data_rows)  # Write data rows
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 107 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
        print(f"Debug: Successfully wrote CSV file: {csvFilePath}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 108 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    except Exception as e:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 109 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
        raise IOError(f"Failed to write CSV file {csvFilePath}: {str(e)}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 110 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 111 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
    return csvFilePath
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 112 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 113 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
def main():
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 114 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
    parser = argparse.ArgumentParser(description="Convert .dat files to CSV files")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 115 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
    parser.add_argument("filePath", type=str, help="Path to the .dat file")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 116 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
    parser.add_argument("--output", type=str, help="Path to the output CSV file")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 117 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 118 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
    args = parser.parse_args()
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 119 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 120 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
    # Check if the input file exists
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 121 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
    if not os.path.isfile(args.filePath):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 122 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
        print(f"Error: Input file '{args.filePath}' does not exist.")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 123 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
        return 1
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 124 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 125 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
    # Check if the input file has the .dat extension
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 126 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
    if not args.filePath.lower().endswith('.dat'):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 127 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
        print(f"Warning: Input file '{args.filePath}' does not have a .dat extension.")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 128 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 129 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 130 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
        # Convert the file
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 131 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
        output_file = convertFile(args.filePath)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 132 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 133 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
        # If an output path was specified, rename the file
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 134 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
        if args.output:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 135 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
            if os.path.exists(output_file):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 136 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `branch` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
                # If the output file already exists, rename it
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 137 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
                if os.path.exists(args.output):
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 138 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
                    os.remove(args.output)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 139 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
                os.rename(output_file, args.output)
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 140 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
                output_file = args.output
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 141 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 142 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
        print(f"Successfully converted '{args.filePath}' to '{output_file}'")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 143 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `blank` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
        return 0
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 144 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `filesystem` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
    except Exception as e:
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 145 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `return` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
        print(f"Error converting file: {e}")
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 146 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
        return 1
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 147 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 148 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
if __name__ == "__main__":
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 149 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
    main()
```

Reconstruction rule: in `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, line 150 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/DentonDecoder/src/DentonDecoder.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
