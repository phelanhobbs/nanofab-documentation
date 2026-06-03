

# Source Reconstruction: NanofabToolkit/ParticleSensor/src/assets/icon.py

- Repository: `NanofabToolkit`
- Relative path: `ParticleSensor/src/assets/icon.py`
- Lines read: `71`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `406841c4cbea9a0a`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `from PyQt5.QtGui import QIcon, QPixmap`, `from PyQt5.QtWidgets import QApplication`, `import os`
- Classes: none detected
- Functions: `get_icon_path`, `load_icon`, `set_window_icon`, `create_pixmap`
- Routes: none detected

## Sanitized Source Excerpt

```python
"""
Icon module for Particle Sensor application
"""

from PyQt5.QtGui import QIcon, QPixmap
from PyQt5.QtWidgets import QApplication
import os


def get_icon_path():
    """Get the path to the application icon"""
    # Get the directory containing this file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    icon_path = os.path.join(current_dir, "icon.png")
    return icon_path


def load_icon():
    """
    Load the application icon for PyQt5.

    Returns:
        QIcon: The loaded icon image, or None if not found.
    """
    try:
        icon_path = get_icon_path()
        if os.path.exists(icon_path):
            return QIcon(icon_path)
        else:
            # Return a default system icon if custom icon not found
            return QApplication.style().standardIcon(QApplication.style().SP_ComputerIcon)
    except Exception:
        # Return None if any error occurs
        return None


def set_window_icon(window):
    """
    Set the window icon for a QMainWindow or QWidget.

    Args:
        window: The window to set the icon for
    """
    try:
        icon = load_icon()
        if icon:
            window.setWindowIcon(icon)
    except Exception:
        # Silently ignore icon loading errors
        pass


def create_pixmap(size=(32, 32)):
    """
    Create a QPixmap from the icon file.

    Args:
        size: Tuple of (width, height) for the pixmap size

    Returns:
        QPixmap: The loaded pixmap, or None if not found
    """
    try:
        icon_path = get_icon_path()
        if os.path.exists(icon_path):
            pixmap = QPixmap(icon_path)
            if not pixmap.isNull():
                return pixmap.scaled(size[0], size[1])
        return None
    except Exception:
        return None
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
"""
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 1 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `none` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
Icon module for Particle Sensor application
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 2 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
"""
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 3 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
from PyQt5.QtGui import QIcon, QPixmap
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `blank` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
from PyQt5.QtWidgets import QApplication
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 6 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
import os
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 7 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
def get_icon_path():
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 10 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
    """Get the path to the application icon"""
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 11 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `function` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
    # Get the directory containing this file
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    current_dir = os.path.dirname(os.path.abspath(__file__))
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 13 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
    icon_path = os.path.join(current_dir, "icon.png")
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 14 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
    return icon_path
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 15 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 16 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 17 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
def load_icon():
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 18 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 19 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    Load the application icon for PyQt5.
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 20 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    Returns:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 22 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
        QIcon: The loaded icon image, or None if not found.
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 23 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 24 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 25 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        icon_path = get_icon_path()
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 26 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
        if os.path.exists(icon_path):
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 27 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
            return QIcon(icon_path)
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 28 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        else:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 29 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
            # Return a default system icon if custom icon not found
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 30 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
            return QApplication.style().standardIcon(QApplication.style().SP_ComputerIcon)
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 31 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    except Exception:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 32 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `return` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        # Return None if any error occurs
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 33 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
        return None
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 34 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 35 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `return` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 36 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
def set_window_icon(window):
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 37 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 38 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    Set the window icon for a QMainWindow or QWidget.
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 39 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
    Args:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 41 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        window: The window to set the icon for
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 42 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 43 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 44 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
        icon = load_icon()
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 45 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
        if icon:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 46 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
            window.setWindowIcon(icon)
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 47 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
    except Exception:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 48 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        # Silently ignore icon loading errors
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 49 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
        pass
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 50 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
def create_pixmap(size=(32, 32)):
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 53 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 54 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    Create a QPixmap from the icon file.
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 55 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 56 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    Args:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 57 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
        size: Tuple of (width, height) for the pixmap size
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 58 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    Returns:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 60 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
        QPixmap: The loaded pixmap, or None if not found
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 61 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
    """
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 62 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    try:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 63 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        icon_path = get_icon_path()
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 64 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        if os.path.exists(icon_path):
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 65 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
            pixmap = QPixmap(icon_path)
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 66 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
            if not pixmap.isNull():
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 67 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `filesystem` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
                return pixmap.scaled(size[0], size[1])
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 68 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `branch` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        return None
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 69 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `return` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
    except Exception:
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 70 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `return` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        return None
```

Reconstruction rule: in `NanofabToolkit/ParticleSensor/src/assets/icon.py`, line 71 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `exception` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/ParticleSensor/src/assets/icon.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
