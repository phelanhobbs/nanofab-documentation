

# Source Reconstruction: NanofabToolkit/ALDPeakCounter/src/gui.py

- Repository: `NanofabToolkit`
- Relative path: `ALDPeakCounter/src/gui.py`
- Lines read: `323`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `a9621c3bc787fdc8`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import os`, `import tkinter`, `from tkinter import filedialog, ttk, messagebox`, `from matplotlib.figure import Figure`, `from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg`, `import matplotlib.cm`, `from numpy import array, zeros, where`, `from .peakCount import count_peaks, multi_file_plot`
- Classes: `PeakCounterGUI`
- Functions: `__init__`, `_create_widgets`, `add_files`, `clear_files`, `_clear_offset_controls`, `create_offset_controls`, `apply_offset`, `zero_offset`, `reset_offsets`, `process_files`, `update_plot`, `on_mouse_press`, `on_mouse_release`, `on_mouse_move`, `apply_zoom`, `reset_zoom`, `run`
- Routes: none detected

## Sanitized Source Excerpt

```python
import os
import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.cm as cm  # For color maps
from numpy import array, zeros, where

# Import your peak counter module
from .peakCount import count_peaks, multi_file_plot

class PeakCounterGUI:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Peak Counter")
        self.root.geometry("1000x800")  # Increased height to accommodate offset controls

        # Store selected files and results
        self.selected_files = []
        self.results = []
        self.time_offsets = {}  # Store time offsets for each file

        # Parameters for peak detection
        self.height_var = tk.DoubleVar(value=0.0)
        self.prominence_var = tk.DoubleVar(value=0.01)
        self.distance_var = tk.IntVar(value=10)
        self.width_var = tk.DoubleVar(value=0.0)

        # Variables for zoom functionality
        self.zoom_rect = None
        self.zooming = False

        self._create_widgets()

    def _create_widgets(self):
        # Create main frames
        control_frame = ttk.Frame(self.root, padding=10)
        control_frame.pack(fill=tk.X, side=tk.TOP)

        files_frame = ttk.Frame(self.root, padding=10)
        files_frame.pack(fill=tk.BOTH, side=tk.TOP, expand=True)

        # New frame for time offset controls
        self.offset_frame = ttk.LabelFrame(self.root, text="Time Alignment Controls", padding=10)
        self.offset_frame.pack(fill=tk.X, side=tk.TOP, padx=10, pady=5)

        # Container for offset sliders (will be populated dynamically)
        self.offset_controls_frame = ttk.Frame(self.offset_frame)
        self.offset_controls_frame.pack(fill=tk.X, expand=True)

        # Reset offsets button
        ttk.Button(self.offset_frame, text="Reset All Offsets",
                  command=self.reset_offsets).pack(pady=5)

        plot_frame = ttk.Frame(self.root, padding=10)
        plot_frame.pack(fill=tk.BOTH, side=tk.BOTTOM, expand=True)

        # Add instruction frame above the plot
        instruction_frame = ttk.Frame(plot_frame)
        instruction_frame.pack(fill=tk.X, side=tk.TOP, pady=(0, 5))

        # Add zoom instructions
        ttk.Label(instruction_frame,
                 text="Click and drag to zoom into a specific area of the graph",
                 font=("Arial", 9)).pack(side=tk.LEFT, padx=5)

        # Add reset zoom button next to instructions
        ttk.Button(instruction_frame, text="Reset Zoom",
                  command=self.reset_zoom).pack(side=tk.LEFT, padx=10)

        # Plot area
        self.fig = Figure(figsize=(9, 5))
        self.canvas = FigureCanvasTkAgg(self.fig, master=plot_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Add box zoom functionality
        self.zoom_rect = None
        self.zooming = False
        self.canvas.mpl_connect('button_press_event', self.on_mouse_press)
        self.canvas.mpl_connect('button_release_event', self.on_mouse_release)
        self.canvas.mpl_connect('motion_notify_event', self.on_mouse_move)

        # File selection controls
        file_controls = ttk.Frame(control_frame)
        file_controls.pack(fill=tk.X, pady=5)

        ttk.Button(file_controls, text="Add Files", command=self.add_files).pack(side=tk.LEFT, padx=5)
        ttk.Button(file_controls, text="Clear Files", command=self.clear_files).pack(side=tk.LEFT, padx=5)

        # Parameter controls
        param_frame = ttk.LabelFrame(control_frame, text="Peak Detection Parameters")
        param_frame.pack(fill=tk.X, pady=10)

        # Create parameter inputs
        params = [
            ("Min Height:", self.height_var),
            ("Prominence:", self.prominence_var),
            ("Min Distance:", self.distance_var),
            ("Min Width:", self.width_var)
        ]

        for i, (label, var) in enumerate(params):
            ttk.Label(param_frame, text=label).grid(row=i, column=0, sticky=tk.W, padx=5, pady=2)
            ttk.Entry(param_frame, textvariable=var, width=10).grid(row=i, column=1, padx=5, pady=2)

        # Process Button
        ttk.Button(control_frame, text="Process Files", command=self.process_files).pack(pady=10)

        # File list (with scrollbar)
        self.file_list = tk.Listbox(files_frame, height=6)
        scrollbar = ttk.Scrollbar(files_frame, orient="vertical", command=self.file_list.yview)
        self.file_list.configure(yscrollcommand=scrollbar.set)

        self.file_list.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Results section
        self.results_text = tk.Text(files_frame, height=10)
        self.results_text.pack(fill=tk.BOTH, expand=True, pady=10)

    def add_files(self):
        files = filedialog.askopenfilenames(
            title="Select Data Files",
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )

        if files:
            for file in files:
                if file not in self.selected_files:
                    self.selected_files.append(file)
                    self.file_list.insert(tk.END, os.path.basename(file))
                    # Initialize time offset for this file
                    self.time_offsets[file] = 0.0

    def clear_files(self):
        self.selected_files = []
        self.file_list.delete(0, tk.END)
        self.results_text.delete(1.0, tk.END)
        self.time_offsets = {}
        self.fig.clear()
        self.canvas.draw()
        self._clear_offset_controls()

    def _clear_offset_controls(self):
        # Clear all offset controls
        for widget in self.offset_controls_frame.winfo_children():
            widget.destroy()

    def create_offset_controls(self):
        # First clear existing controls
        self._clear_offset_controls()

        # Create new offset controls for each file
        for i, file_path in enumerate(self.selected_files):
            basename = os.path.basename(file_path)

            # Create a frame for this file's offset control
            file_frame = ttk.Frame(self.offset_controls_frame)
            file_frame.pack(fill=tk.X, pady=2)

            # Create a label with the filename
            ttk.Label(file_frame, text=f"{basename}:", width=20,
                     anchor=tk.W).pack(side=tk.LEFT, padx=5)

            # Create offset variable and link it to the time_offsets dictionary
            offset_var = tk.DoubleVar(value=self.time_offsets[file_path])

            # Create numeric entry for precise control
            entry = ttk.Entry(file_frame, textvariable=offset_var, width=8)
            entry.pack(side=tk.LEFT, padx=5)

            # Create a slider for time offset adjustment (-50 to 50)
            slider = ttk.Scale(file_frame, from_=-50, to=50,
                             orient=tk.HORIZONTAL, length=200,
                             variable=offset_var)
            slider.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)

            # Add "Apply" button
            apply_btn = ttk.Button(file_frame, text="Apply",
                                 command=lambda fp=file_path, ov=offset_var: self.apply_offset(fp, ov))
            apply_btn.pack(side=tk.LEFT, padx=5)

            # Add "Zero" button to reset just this file
            zero_btn = ttk.Button(file_frame, text="Zero",
                                command=lambda fp=file_path, ov=offset_var: self.zero_offset(fp, ov))
            zero_btn.pack(side=tk.LEFT, padx=5)

    def apply_offset(self, file_path, offset_var):
        # Update the offset in our dictionary
        self.time_offsets[file_path] = offset_var.get()
        # Update the plot with the new offset
        self.update_plot()

    def zero_offset(self, file_path, offset_var):
        # Reset this file's offset to zero
        offset_var.set(0.0)
        self.time_offsets[file_path] = 0.0
        self.update_plot()

    def reset_offsets(self):
        # Reset all time offsets to zero
        for file_path in self.time_offsets:
            self.time_offsets[file_path] = 0.0

        # Update offset controls
        self.create_offset_controls()

        # Update the plot
        self.update_plot()

    def process_files(self):
        if not self.selected_files:
            messagebox.showinfo("No Files", "Please select at least one data file to process.")
            return

        # Clear previous results
        self.results_text.delete(1.0, tk.END)
        self.results = []

        # Get parameters
        params = {
            'height': None if self.height_var.get() == 0 else self.height_var.get(),
            'prominence': self.prominence_var.get(),
            'distance': self.distance_var.get(),
            'width': None if self.width_var.get() == 0 else self.width_var.get(),
        }

        # Process each file
        for file_path in self.selected_files:
            peak_count, pressure_times, pressures, peaks = count_peaks(
                file_path,
                **params,
                plot=False,
                quiet=True
            )
            self.results.append((file_path, peak_count, pressure_times, pressures, peaks))

            # Add results to text area
            basename = os.path.basename(file_path)
            self.results_text.insert(tk.END, f"{basename}: {peak_count} peaks\n")

            if peaks is not None and len(peaks) > 0:
                self.results_text.insert(tk.END, f"  Peak times: {', '.join([f'{t:.2f}' for t in pressure_times[peaks]])}\n\n")

        # Create offset controls for the files
        self.create_offset_controls()

        # Plot the results
        self.update_plot()

    def update_plot(self):
        self.fig.clear()
        ax = self.fig.add_subplot(111)

        # Use a different color for each file
        colors = cm.tab10.colors
        marker_styles = ['o', 's', '^', 'd', 'x', '+', '*', 'v', '<', '>']

        for i, (filename, peak_count, pressure_times, pressures, peaks) in enumerate(self.results):
            if pressure_times is None or pressures is None:
                continue

            color = colors[i % len(colors)]
            marker = marker_styles[i % len(marker_styles)]

            # Apply the time offset to the pressure times
            offset = self.time_offsets.get(filename, 0.0)
            adjusted_times = pressure_times + offset

            # Plot the pressure data
            basename = os.path.basename(filename)
            offset_text = f" (offset: {offset:.2f})" if offset != 0 else ""
            label = f"{basename} ({peak_count} peaks){offset_text}"

            ax.plot(adjusted_times, pressures, label=label, color=color, alpha=0.7)

            # Plot the peaks as points
            if peaks is not None and len(peaks) > 0:
                ax.plot(adjusted_times[peaks], pressures[peaks], marker=marker,
                        linestyle='None', color=color, markersize=8)

        ax.set_title("Pressure vs Time")
        ax.set_xlabel("Pressure Time")
        ax.set_ylabel("Pressure")
        ax.grid(True)
        ax.legend()

        self.canvas.draw()

    def on_mouse_press(self, event):
        if event.inaxes:
            self.zooming = True
            self.zoom_rect = [event.xdata, event.ydata, event.xdata, event.ydata]

    def on_mouse_release(self, event):
        if self.zooming and self.zoom_rect and event.inaxes:
            self.zoom_rect[2] = event.xdata
            self.zoom_rect[3] = event.ydata
            self.zooming = False
            self.apply_zoom()

    def on_mouse_move(self, event):
        if self.zooming and self.zoom_rect and event.inaxes:
            self.zoom_rect[2] = event.xdata
            self.zoom_rect[3] = event.ydata

    def apply_zoom(self):
        if self.zoom_rect:
            x_min, y_min, x_max, y_max = self.zoom_rect
            self.fig.axes[0].set_xlim(min(x_min, x_max), max(x_min, x_max))
            self.fig.axes[0].set_ylim(min(y_min, y_max), max(y_min, y_max))
            self.canvas.draw()

    def reset_zoom(self):
        self.fig.axes[0].autoscale()
        self.canvas.draw()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = PeakCounterGUI()
    app.run()
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
import os
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 1 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `none` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
import tkinter as tk
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 2 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
from tkinter import filedialog, ttk, messagebox
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 3 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
from matplotlib.figure import Figure
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 4 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
import matplotlib.cm as cm  # For color maps
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 6 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
from numpy import array, zeros, where
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 7 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
# Import your peak counter module
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 9 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
from .peakCount import count_peaks, multi_file_plot
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 10 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `class`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
class PeakCounterGUI:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 12 is classified as `class`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    def __init__(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 13 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `class` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
        self.root = tk.Tk()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 14 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
        self.root.title("Peak Counter")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 15 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
        self.root.geometry("1000x800")  # Increased height to accommodate offset controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 16 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 17 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
        # Store selected files and results
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 18 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
        self.selected_files = []
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 19 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
        self.results = []
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 20 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
        self.time_offsets = {}  # Store time offsets for each file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 21 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
        # Parameters for peak detection
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 23 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
        self.height_var = tk.DoubleVar(value=0.0)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 24 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
        self.prominence_var = tk.DoubleVar(value=0.01)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 25 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        self.distance_var = tk.IntVar(value=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 26 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
        self.width_var = tk.DoubleVar(value=0.0)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 27 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 28 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        # Variables for zoom functionality
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 29 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
        self.zoom_rect = None
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 30 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
        self.zooming = False
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 31 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        self._create_widgets()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 33 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 34 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    def _create_widgets(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 35 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        # Create main frames
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 36 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        control_frame = ttk.Frame(self.root, padding=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 37 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
        control_frame.pack(fill=tk.X, side=tk.TOP)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 38 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        files_frame = ttk.Frame(self.root, padding=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 40 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        files_frame.pack(fill=tk.BOTH, side=tk.TOP, expand=True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 41 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 42 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
        # New frame for time offset controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 43 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
        self.offset_frame = ttk.LabelFrame(self.root, text="Time Alignment Controls", padding=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 44 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
        self.offset_frame.pack(fill=tk.X, side=tk.TOP, padx=10, pady=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 45 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 46 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
        # Container for offset sliders (will be populated dynamically)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 47 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        self.offset_controls_frame = ttk.Frame(self.offset_frame)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 48 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        self.offset_controls_frame.pack(fill=tk.X, expand=True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 49 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 50 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
        # Reset offsets button
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 51 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
        ttk.Button(self.offset_frame, text="Reset All Offsets",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 52 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
                  command=self.reset_offsets).pack(pady=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 53 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 54 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
        plot_frame = ttk.Frame(self.root, padding=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 55 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
        plot_frame.pack(fill=tk.BOTH, side=tk.BOTTOM, expand=True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 56 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 57 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
        # Add instruction frame above the plot
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 58 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
        instruction_frame = ttk.Frame(plot_frame)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 59 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
        instruction_frame.pack(fill=tk.X, side=tk.TOP, pady=(0, 5))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 60 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 61 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        # Add zoom instructions
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 62 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
        ttk.Label(instruction_frame,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 63 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
                 text="Click and drag to zoom into a specific area of the graph",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 64 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
                 font=("Arial", 9)).pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 65 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 66 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
        # Add reset zoom button next to instructions
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 67 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
        ttk.Button(instruction_frame, text="Reset Zoom",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 68 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
                  command=self.reset_zoom).pack(side=tk.LEFT, padx=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 69 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        # Plot area
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 71 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
        self.fig = Figure(figsize=(9, 5))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 72 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
        self.canvas = FigureCanvasTkAgg(self.fig, master=plot_frame)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 73 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 74 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 75 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
        # Add box zoom functionality
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 76 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
        self.zoom_rect = None
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 77 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
        self.zooming = False
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 78 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
        self.canvas.mpl_connect('button_press_event', self.on_mouse_press)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 79 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
        self.canvas.mpl_connect('button_release_event', self.on_mouse_release)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 80 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
        self.canvas.mpl_connect('motion_notify_event', self.on_mouse_move)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 81 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 82 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
        # File selection controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 83 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
        file_controls = ttk.Frame(control_frame)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 84 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
        file_controls.pack(fill=tk.X, pady=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 85 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 86 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
        ttk.Button(file_controls, text="Add Files", command=self.add_files).pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 87 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
        ttk.Button(file_controls, text="Clear Files", command=self.clear_files).pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 88 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 89 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        # Parameter controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 90 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
        param_frame = ttk.LabelFrame(control_frame, text="Peak Detection Parameters")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 91 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
        param_frame.pack(fill=tk.X, pady=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 92 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 93 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
        # Create parameter inputs
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 94 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
        params = [
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 95 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
            ("Min Height:", self.height_var),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 96 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
            ("Prominence:", self.prominence_var),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 97 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
            ("Min Distance:", self.distance_var),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 98 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
            ("Min Width:", self.width_var)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 99 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
        ]
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 100 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 101 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
        for i, (label, var) in enumerate(params):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 102 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
            ttk.Label(param_frame, text=label).grid(row=i, column=0, sticky=tk.W, padx=5, pady=2)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 103 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
            ttk.Entry(param_frame, textvariable=var, width=10).grid(row=i, column=1, padx=5, pady=2)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 104 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 105 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
        # Process Button
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 106 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
        ttk.Button(control_frame, text="Process Files", command=self.process_files).pack(pady=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 107 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 108 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
        # File list (with scrollbar)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 109 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
        self.file_list = tk.Listbox(files_frame, height=6)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 110 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
        scrollbar = ttk.Scrollbar(files_frame, orient="vertical", command=self.file_list.yview)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 111 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
        self.file_list.configure(yscrollcommand=scrollbar.set)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 112 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 113 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
        self.file_list.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 114 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 115 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 116 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
        # Results section
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 117 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
        self.results_text = tk.Text(files_frame, height=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 118 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
        self.results_text.pack(fill=tk.BOTH, expand=True, pady=10)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 119 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 120 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
    def add_files(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 121 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
        files = filedialog.askopenfilenames(
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 122 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
            title="Select Data Files",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 123 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 124 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `database` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
        )
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 125 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
        if files:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 127 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
            for file in files:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 128 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
                if file not in self.selected_files:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 129 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
                    self.selected_files.append(file)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 130 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
                    self.file_list.insert(tk.END, os.path.basename(file))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 131 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
                    # Initialize time offset for this file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 132 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
                    self.time_offsets[file] = 0.0
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 133 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 134 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
    def clear_files(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 135 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
        self.selected_files = []
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 136 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
        self.file_list.delete(0, tk.END)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 137 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
        self.results_text.delete(1.0, tk.END)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 138 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
        self.time_offsets = {}
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 139 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
        self.fig.clear()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 140 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
        self.canvas.draw()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 141 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
        self._clear_offset_controls()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 142 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 143 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
    def _clear_offset_controls(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 144 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
        # Clear all offset controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 145 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
        for widget in self.offset_controls_frame.winfo_children():
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 146 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
            widget.destroy()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 147 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `loop` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 148 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
    def create_offset_controls(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 149 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
        # First clear existing controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 150 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
        self._clear_offset_controls()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 151 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 152 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
        # Create new offset controls for each file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 153 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
        for i, file_path in enumerate(self.selected_files):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 154 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
            basename = os.path.basename(file_path)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 155 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `loop` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 156 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
            # Create a frame for this file's offset control
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 157 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
            file_frame = ttk.Frame(self.offset_controls_frame)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 158 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
            file_frame.pack(fill=tk.X, pady=2)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 159 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 160 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
            # Create a label with the filename
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 161 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
            ttk.Label(file_frame, text=f"{basename}:", width=20,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 162 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
                     anchor=tk.W).pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 163 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 164 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
            # Create offset variable and link it to the time_offsets dictionary
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 165 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
            offset_var = tk.DoubleVar(value=self.time_offsets[file_path])
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 166 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 167 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
            # Create numeric entry for precise control
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 168 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
            entry = ttk.Entry(file_frame, textvariable=offset_var, width=8)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 169 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
            entry.pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 170 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 171 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
            # Create a slider for time offset adjustment (-50 to 50)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 172 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
            slider = ttk.Scale(file_frame, from_=-50, to=50,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 173 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
                             orient=tk.HORIZONTAL, length=200,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 174 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
                             variable=offset_var)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 175 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
            slider.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 176 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 177 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
            # Add "Apply" button
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 178 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
            apply_btn = ttk.Button(file_frame, text="Apply",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 179 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
                                 command=lambda fp=file_path, ov=offset_var: self.apply_offset(fp, ov))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 180 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
            apply_btn.pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 181 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 182 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
            # Add "Zero" button to reset just this file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 183 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
            zero_btn = ttk.Button(file_frame, text="Zero",
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 184 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
                                command=lambda fp=file_path, ov=offset_var: self.zero_offset(fp, ov))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 185 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
            zero_btn.pack(side=tk.LEFT, padx=5)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 186 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 187 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
    def apply_offset(self, file_path, offset_var):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 188 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
        # Update the offset in our dictionary
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 189 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
        self.time_offsets[file_path] = offset_var.get()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 190 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
        # Update the plot with the new offset
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 191 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
        self.update_plot()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 192 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 193 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
    def zero_offset(self, file_path, offset_var):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 194 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
        # Reset this file's offset to zero
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 195 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
        offset_var.set(0.0)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 196 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
        self.time_offsets[file_path] = 0.0
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 197 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
        self.update_plot()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 198 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 199 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
    def reset_offsets(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 200 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
        # Reset all time offsets to zero
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 201 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `function` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
        for file_path in self.time_offsets:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 202 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
            self.time_offsets[file_path] = 0.0
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 203 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `loop` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 204 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
        # Update offset controls
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 205 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
        self.create_offset_controls()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 206 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 207 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
        # Update the plot
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 208 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
        self.update_plot()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 209 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 210 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
    def process_files(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 211 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
        if not self.selected_files:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 212 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
            messagebox.showinfo("No Files", "Please select at least one data file to process.")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 213 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
            return
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 214 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `database` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 215 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
        # Clear previous results
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 216 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
        self.results_text.delete(1.0, tk.END)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 217 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
        self.results = []
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 218 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 219 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 220

```text
        # Get parameters
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 220 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 221

```text
        params = {
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 221 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 222

```text
            'height': None if self.height_var.get() == 0 else self.height_var.get(),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 222 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 223

```text
            'prominence': self.prominence_var.get(),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 223 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 224

```text
            'distance': self.distance_var.get(),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 224 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 225

```text
            'width': None if self.width_var.get() == 0 else self.width_var.get(),
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 225 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 226

```text
        }
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 226 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 227

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 227 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 228

```text
        # Process each file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 228 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 229

```text
        for file_path in self.selected_files:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 229 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 230

```text
            peak_count, pressure_times, pressures, peaks = count_peaks(
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 230 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `loop` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 231

```text
                file_path,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 231 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 232

```text
                **params,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 232 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 233

```text
                plot=False,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 233 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 234

```text
                quiet=True
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 234 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 235

```text
            )
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 235 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 236

```text
            self.results.append((file_path, peak_count, pressure_times, pressures, peaks))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 236 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 237

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 237 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `filesystem` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 238

```text
            # Add results to text area
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 238 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 239

```text
            basename = os.path.basename(file_path)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 239 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 240

```text
            self.results_text.insert(tk.END, f"{basename}: {peak_count} peaks\n")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 240 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `filesystem` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 241

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 241 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 242

```text
            if peaks is not None and len(peaks) > 0:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 242 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 243

```text
                self.results_text.insert(tk.END, f"  Peak times: {', '.join([f'{t:.2f}' for t in pressure_times[peaks]])}\n\n")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 243 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 244

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 244 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 245

```text
        # Create offset controls for the files
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 245 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 246

```text
        self.create_offset_controls()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 246 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 247

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 247 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 248

```text
        # Plot the results
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 248 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 249

```text
        self.update_plot()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 249 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 250

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 250 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 251

```text
    def update_plot(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 251 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 252

```text
        self.fig.clear()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 252 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 253

```text
        ax = self.fig.add_subplot(111)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 253 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 254

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 254 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 255

```text
        # Use a different color for each file
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 255 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 256

```text
        colors = cm.tab10.colors
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 256 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 257

```text
        marker_styles = ['o', 's', '^', 'd', 'x', '+', '*', 'v', '<', '>']
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 257 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 258

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 258 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 259

```text
        for i, (filename, peak_count, pressure_times, pressures, peaks) in enumerate(self.results):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 259 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 260

```text
            if pressure_times is None or pressures is None:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 260 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `loop` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 261

```text
                continue
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 261 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 262

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 262 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 263

```text
            color = colors[i % len(colors)]
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 263 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 264

```text
            marker = marker_styles[i % len(marker_styles)]
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 264 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 265

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 265 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 266

```text
            # Apply the time offset to the pressure times
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 266 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 267

```text
            offset = self.time_offsets.get(filename, 0.0)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 267 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 268

```text
            adjusted_times = pressure_times + offset
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 268 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 269

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 269 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 270

```text
            # Plot the pressure data
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 270 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `filesystem`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 271

```text
            basename = os.path.basename(filename)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 271 is classified as `filesystem`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 272

```text
            offset_text = f" (offset: {offset:.2f})" if offset != 0 else ""
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 272 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `filesystem` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 273

```text
            label = f"{basename} ({peak_count} peaks){offset_text}"
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 273 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 274

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 274 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 275

```text
            ax.plot(adjusted_times, pressures, label=label, color=color, alpha=0.7)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 275 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 276

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 276 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 277

```text
            # Plot the peaks as points
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 277 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 278

```text
            if peaks is not None and len(peaks) > 0:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 278 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `comment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 279

```text
                ax.plot(adjusted_times[peaks], pressures[peaks], marker=marker,
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 279 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 280

```text
                        linestyle='None', color=color, markersize=8)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 280 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 281

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 281 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 282

```text
        ax.set_title("Pressure vs Time")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 282 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 283

```text
        ax.set_xlabel("Pressure Time")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 283 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 284

```text
        ax.set_ylabel("Pressure")
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 284 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 285

```text
        ax.grid(True)
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 285 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 286

```text
        ax.legend()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 286 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 287

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 287 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 288

```text
        self.canvas.draw()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 288 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 289

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 289 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 290

```text
    def on_mouse_press(self, event):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 290 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 291

```text
        if event.inaxes:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 291 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 292

```text
            self.zooming = True
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 292 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 293

```text
            self.zoom_rect = [event.xdata, event.ydata, event.xdata, event.ydata]
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 293 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 294

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 294 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 295

```text
    def on_mouse_release(self, event):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 295 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 296

```text
        if self.zooming and self.zoom_rect and event.inaxes:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 296 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 297

```text
            self.zoom_rect[2] = event.xdata
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 297 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 298

```text
            self.zoom_rect[3] = event.ydata
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 298 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 299

```text
            self.zooming = False
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 299 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 300

```text
            self.apply_zoom()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 300 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 301

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 301 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 302

```text
    def on_mouse_move(self, event):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 302 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 303

```text
        if self.zooming and self.zoom_rect and event.inaxes:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 303 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 304

```text
            self.zoom_rect[2] = event.xdata
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 304 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 305

```text
            self.zoom_rect[3] = event.ydata
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 305 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 306

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 306 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 307

```text
    def apply_zoom(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 307 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 308

```text
        if self.zoom_rect:
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 308 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 309

```text
            x_min, y_min, x_max, y_max = self.zoom_rect
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 309 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 310

```text
            self.fig.axes[0].set_xlim(min(x_min, x_max), max(x_min, x_max))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 310 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 311

```text
            self.fig.axes[0].set_ylim(min(y_min, y_max), max(y_min, y_max))
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 311 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 312

```text
            self.canvas.draw()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 312 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 313

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 313 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 314

```text
    def reset_zoom(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 314 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 315

```text
        self.fig.axes[0].autoscale()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 315 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 316

```text
        self.canvas.draw()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 316 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 317

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 317 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 318

```text
    def run(self):
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 318 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 319

```text
        self.root.mainloop()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 319 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 320

```text
<blank line>
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 320 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 321

```text
if __name__ == "__main__":
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 321 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 322

```text
    app = PeakCounterGUI()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 322 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 323

```text
    app.run()
```

Reconstruction rule: in `NanofabToolkit/ALDPeakCounter/src/gui.py`, line 323 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/ALDPeakCounter/src/gui.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
