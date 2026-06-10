

# Source Reconstruction: UNanofabTools/DATgrapher.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `DATgrapher.py`
- Lines read: `146`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `6c94af7a7df4133f`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import argparse`, `import re`, `import datetime`, `import matplotlib.pyplot`, `import numpy`, `from pathlib import Path`
- Classes: none detected
- Functions: `create_pressure_graph`, `main`
- Routes: none detected

## Sanitized Source Excerpt

```python
import argparse
import re
import datetime
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

def create_pressure_graph(input_file, output_file=None, show_graph=True, log_scale=False):
    """
    Create a pressure vs time graph from a cleaned DATfixer output file.

    Args:
        input_file: Path to cleaned log file
        output_file: Path to save the graph (optional)
        show_graph: If True, displays the graph (default: True)
        log_scale: If True, uses logarithmic scale for y-axis (default: False)
    """
    try:
        # Read the file
        with open(input_file, 'r', errors='replace') as f:
            text = f.read()

        lines = text.split('\n')

        # Data structures for the graph
        times = []
        pressures = []

        # Regular expressions for extracting time and pressure
        time_regex = re.compile(r'(\d{2}:\d{2}:\d{2})')
        pressure_regex = re.compile(r'\[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]')

        # Base time to convert timestamps to relative seconds
        base_time = None

        # Process each line
        for line in lines:
            # Skip empty lines
            if not line.strip():
                continue

            # Extract timestamp
            time_match = time_regex.search(line)
            if not time_match:
                continue

            time_str = time_match.group(1)
            try:
                # Convert time string to datetime object
                time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S")

                # Set base time if not set
                if base_time is None:
                    base_time = time_obj

                # Calculate seconds since base time
                time_delta = (time_obj - base_time).total_seconds()
                if time_delta < 0:  # Handle crossing midnight
                    time_delta += 24 * 60 * 60

                # Extract pressure (first bracketed value)
                pressure_match = pressure_regex.search(line)
                if pressure_match:
                    try:
                        pressure = float(pressure_match.group(1))

                        # Add to data lists
                        times.append(time_delta)
                        pressures.append(pressure)
                    except ValueError:
                        # Skip if pressure value can't be converted
                        continue
            except ValueError:
                # Skip if time can't be parsed
                continue

        # Create the graph if we have data
        if times and pressures:
            # Create figure and axis
            fig, ax = plt.figure(figsize=(10, 6)), plt.gca()

            # Plot the data
            ax.plot(times, pressures)

            # Add labels and title
            ax.set_xlabel('Time (seconds since start)')
            ax.set_ylabel('Pressure')
            ax.set_title(f'Pressure vs Time - {Path(input_file).stem}')

            # Format y-axis to use scientific notation if not log scale
            if not log_scale:
                ax.ticklabel_format(axis='y', style='sci', scilimits=(0,0))
            else:
                ax.set_yscale('log')

            # Add grid
            ax.grid(True)

            # Save the figure if requested
            if output_file:
                plt.savefig(output_file)
                print(f"Graph saved to: {output_file}")

            # Show the graph if requested
            if show_graph:
                plt.show()
            else:
                plt.close(fig)

            # If very few data points, warn the user
            if len(times) < 10:
                print(f"Warning: Only {len(times)} data points were found for plotting.")

            return True
        else:
            print("No valid time and pressure data found in the file.")
            return False

    except Exception as e:
        print(f"Error processing file: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Create pressure vs time graph from cleaned DATfixer output")
    parser.add_argument("input_file", help="Path to the cleaned log file")
    parser.add_argument("-o", "--output", help="Output graph file path (optional)")
    parser.add_argument("--no-display", action="store_true",
                        help="Don't display the graph, just save it if output is specified")
    parser.add_argument("--log", action="store_true",
                        help="Use logarithmic scale for pressure axis")

    args = parser.parse_args()

    # If no output file is specified and no display, specify a default output
    if args.no_display and not args.output:
        args.output = Path(args.input_file).with_suffix('.png')

    create_pressure_graph(
        args.input_file,
        args.output,
        show_graph=not args.no_display,
        log_scale=args.log
    )

if __name__ == "__main__":
    main()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
import argparse
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 2

```text
import re
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 3

```text
import datetime
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 4

```text
import matplotlib.pyplot as plt
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 5

```text
import numpy as np
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 6

```text
from pathlib import Path
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 8

```text
def create_pressure_graph(input_file, output_file=None, show_graph=True, log_scale=False):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 9

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 10

```text
    Create a pressure vs time graph from a cleaned DATfixer output file.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 12

```text
    Args:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 13

```text
        input_file: Path to cleaned log file
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 14

```text
        output_file: Path to save the graph (optional)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 15

```text
        show_graph: If True, displays the graph (default: True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 16

```text
        log_scale: If True, uses logarithmic scale for y-axis (default: False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 17

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 18

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 20

```text
        with open(input_file, 'r', errors='replace') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 21

```text
            text = f.read()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 23

```text
        lines = text.split('\n')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 26

```text
        times = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 27

```text
        pressures = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 30

```text
        time_regex = re.compile(r'(\d{2}:\d{2}:\d{2})')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 31

```text
        pressure_regex = re.compile(r'\[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 34

```text
        base_time = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 37

```text
        for line in lines:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 39

```text
            if not line.strip():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 40

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 43

```text
            time_match = time_regex.search(line)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 44

```text
            if not time_match:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 45

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 47

```text
            time_str = time_match.group(1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 48

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 50

```text
                time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 53

```text
                if base_time is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 54

```text
                    base_time = time_obj
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 57

```text
                time_delta = (time_obj - base_time).total_seconds()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 58

```text
                if time_delta < 0:  # Handle crossing midnight
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 59

```text
                    time_delta += 24 * 60 * 60
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 62

```text
                pressure_match = pressure_regex.search(line)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 63

```text
                if pressure_match:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 64

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 65

```text
                        pressure = float(pressure_match.group(1))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 68

```text
                        times.append(time_delta)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
                        pressures.append(pressure)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 70

```text
                    except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 72

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 73

```text
            except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 75

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 78

```text
        if times and pressures:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 80

```text
            fig, ax = plt.figure(figsize=(10, 6)), plt.gca()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 83

```text
            ax.plot(times, pressures)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 86

```text
            ax.set_xlabel('Time (seconds since start)')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 87

```text
            ax.set_ylabel('Pressure')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 88

```text
            ax.set_title(f'Pressure vs Time - {Path(input_file).stem}')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 91

```text
            if not log_scale:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 92

```text
                ax.ticklabel_format(axis='y', style='sci', scilimits=(0,0))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 93

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 94

```text
                ax.set_yscale('log')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 97

```text
            ax.grid(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 100

```text
            if output_file:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 101

```text
                plt.savefig(output_file)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 102

```text
                print(f"Graph saved to: {output_file}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 105

```text
            if show_graph:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 106

```text
                plt.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 107

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 108

```text
                plt.close(fig)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 111

```text
            if len(times) < 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 112

```text
                print(f"Warning: Only {len(times)} data points were found for plotting.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 114

```text
            return True
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 115

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 116

```text
            print("No valid time and pressure data found in the file.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 117

```text
            return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 119

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 120

```text
        print(f"Error processing file: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 121

```text
        return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 123

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 124

```text
    parser = argparse.ArgumentParser(description="Create pressure vs time graph from cleaned DATfixer output")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 125

```text
    parser.add_argument("input_file", help="Path to the cleaned log file")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 126

```text
    parser.add_argument("-o", "--output", help="Output graph file path (optional)")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 127

```text
    parser.add_argument("--no-display", action="store_true",
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 128

```text
                        help="Don't display the graph, just save it if output is specified")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 129

```text
    parser.add_argument("--log", action="store_true",
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 130

```text
                        help="Use logarithmic scale for pressure axis")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 132

```text
    args = parser.parse_args()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 135

```text
    if args.no_display and not args.output:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 136

```text
        args.output = Path(args.input_file).with_suffix('.png')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 138

```text
    create_pressure_graph(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 139

```text
        args.input_file,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 140

```text
        args.output,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 141

```text
        show_graph=not args.no_display,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 142

```text
        log_scale=args.log
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 143

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 145

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 146

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/DATgrapher.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/DATgrapher.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/DATgrapher.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/DATgrapher.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/DATgrapher.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/DATgrapher.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/DATgrapher.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/DATgrapher.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/DATgrapher.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/DATgrapher.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/DATgrapher.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/DATgrapher.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/DATgrapher.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/DATgrapher.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/DATgrapher.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/DATgrapher.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/DATgrapher.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/DATgrapher.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/DATgrapher.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/DATgrapher.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/DATgrapher.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/DATgrapher.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/DATgrapher.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/DATgrapher.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
