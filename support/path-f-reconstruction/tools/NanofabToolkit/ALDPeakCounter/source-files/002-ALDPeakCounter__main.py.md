

# Source Reconstruction: NanofabToolkit/ALDPeakCounter/main.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `NanofabToolkit`
- Relative path: `ALDPeakCounter/main.py`
- Lines read: `94`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `eb791d590bd82400`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import sys`, `import os`, `import traceback`, `import tkinter`, `from tkinter import messagebox, scrolledtext`, `from src.gui import PeakCounterGUI`, `import numpy`, `import scipy`, `import matplotlib`
- Classes: none detected
- Functions: `show_error_dialog`, `show_error`, `main`
- Routes: none detected

## Sanitized Source Excerpt

```python
import sys
import os
import traceback
import tkinter as tk
from tkinter import messagebox, scrolledtext

def show_error_dialog(title, message):
    """Display a scrollable error dialog with the full traceback"""
    # Create a root window
    root = tk.Tk()
    root.title(title)
    root.geometry("800x600")  # Larger window for error details

    # Add instruction label
    tk.Label(root, text="An error occurred. Please send this information to the developer:",
             pady=10).pack(fill=tk.X)

    # Create a scrolled text area for the error message
    error_text = scrolledtext.ScrolledText(root, width=100, height=30)
    error_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
    error_text.insert(tk.END, message)
    error_text.config(state=tk.DISABLED)  # Make read-only

    # Add a close button
    tk.Button(root, text="Close", command=root.destroy, padx=20).pack(pady=10)

    # Center the window
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f"{width}x{height}+{x}+{y}")

    root.mainloop()
    sys.exit(1)  # Exit after showing error

def show_error(exception_type, exception_value, exception_traceback):
    """Global exception handler for showing errors in a windowed app"""
    err_msg = "".join(traceback.format_exception(exception_type, exception_value, exception_traceback))
    show_error_dialog("Unexpected Error", err_msg)
    return True  # Prevent default handler from running

def main():
    try:
        # Try to check environment information first
        env_info = f"Python version: {sys.version}\n"
        env_info += f"Executable path: {sys.executable}\n"
        env_info += f"Operating system: {sys.platform}\n"

        # Try importing required libraries with error checking
        try:
            import numpy
            env_info += f"NumPy version: {numpy.__version__}\n"
        except ImportError as e:
            env_info += f"NumPy import error: {str(e)}\n"

        try:
            import scipy
            env_info += f"SciPy version: {scipy.__version__}\n"
        except ImportError as e:
            env_info += f"SciPy import error: {str(e)}\n"

        try:
            import matplotlib
            env_info += f"Matplotlib version: {matplotlib.__version__}\n"
        except ImportError as e:
            env_info += f"Matplotlib import error: {str(e)}\n"

        # Now try running the actual application
        from src.gui import PeakCounterGUI
        app = PeakCounterGUI()
        app.run()

    except Exception as e:
        # Get full traceback
        error_traceback = traceback.format_exc()

        # Create detailed error message
        error_message = "Peak Counter application failed to start.\n\n"
        error_message += "Error details:\n"
        error_message += f"{str(e)}\n\n"
        error_message += "Environment information:\n"
        error_message += env_info + "\n\n"
        error_message += "Full traceback:\n"
        error_message += error_traceback

        # Show the error dialog
        show_error_dialog("Application Error", error_message)

if __name__ == "__main__":
    # Set up global exception handler for windowed mode
    sys.excepthook = show_error
    main()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
import sys
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 2

```text
import os
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 3

```text
import traceback
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 4

```text
import tkinter as tk
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 5

```text
from tkinter import messagebox, scrolledtext
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 7

```text
def show_error_dialog(title, message):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 8

```text
    """Display a scrollable error dialog with the full traceback"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 10

```text
    root = tk.Tk()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 11

```text
    root.title(title)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 12

```text
    root.geometry("800x600")  # Larger window for error details
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 15

```text
    tk.Label(root, text="An error occurred. Please send this information to the developer:",
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 16

```text
             pady=10).pack(fill=tk.X)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 19

```text
    error_text = scrolledtext.ScrolledText(root, width=100, height=30)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 20

```text
    error_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 21

```text
    error_text.insert(tk.END, message)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 22

```text
    error_text.config(state=tk.DISABLED)  # Make read-only
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 25

```text
    tk.Button(root, text="Close", command=root.destroy, padx=20).pack(pady=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 28

```text
    root.update_idletasks()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 29

```text
    width = root.winfo_width()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 30

```text
    height = root.winfo_height()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 31

```text
    x = (root.winfo_screenwidth() // 2) - (width // 2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 32

```text
    y = (root.winfo_screenheight() // 2) - (height // 2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 33

```text
    root.geometry(f"{width}x{height}+{x}+{y}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 35

```text
    root.mainloop()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 36

```text
    sys.exit(1)  # Exit after showing error
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 38

```text
def show_error(exception_type, exception_value, exception_traceback):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 39

```text
    """Global exception handler for showing errors in a windowed app"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 40

```text
    err_msg = "".join(traceback.format_exception(exception_type, exception_value, exception_traceback))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 41

```text
    show_error_dialog("Unexpected Error", err_msg)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 42

```text
    return True  # Prevent default handler from running
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 44

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 45

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 47

```text
        env_info = f"Python version: {sys.version}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 48

```text
        env_info += f"Executable path: {sys.executable}\n"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 49

```text
        env_info += f"Operating system: {sys.platform}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 52

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 53

```text
            import numpy
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 54

```text
            env_info += f"NumPy version: {numpy.__version__}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 55

```text
        except ImportError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 56

```text
            env_info += f"NumPy import error: {str(e)}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 58

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 59

```text
            import scipy
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 60

```text
            env_info += f"SciPy version: {scipy.__version__}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 61

```text
        except ImportError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 62

```text
            env_info += f"SciPy import error: {str(e)}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 64

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 65

```text
            import matplotlib
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 66

```text
            env_info += f"Matplotlib version: {matplotlib.__version__}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 67

```text
        except ImportError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 68

```text
            env_info += f"Matplotlib import error: {str(e)}\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 71

```text
        from src.gui import PeakCounterGUI
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 72

```text
        app = PeakCounterGUI()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 73

```text
        app.run()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 75

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 77

```text
        error_traceback = traceback.format_exc()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 80

```text
        error_message = "Peak Counter application failed to start.\n\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 81

```text
        error_message += "Error details:\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 82

```text
        error_message += f"{str(e)}\n\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 83

```text
        error_message += "Environment information:\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 84

```text
        error_message += env_info + "\n\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        error_message += "Full traceback:\n"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 86

```text
        error_message += error_traceback
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 89

```text
        show_error_dialog("Application Error", error_message)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 91

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 93

```text
    sys.excepthook = show_error
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 94

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/ALDPeakCounter/main.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
