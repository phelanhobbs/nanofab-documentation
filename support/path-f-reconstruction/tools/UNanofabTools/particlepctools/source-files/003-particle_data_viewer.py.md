

# Source Reconstruction: UNanofabTools/particle_data_viewer.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `particle_data_viewer.py`
- Lines read: `1099`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `99a7c7f948f6c83f`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import sys`, `import warnings`, `import requests`, `import json`, `import csv`, `from datetime import datetime, timedelta`, `import pytz`, `import matplotlib.pyplot`, `from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg`, `from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT`, `from matplotlib.figure import Figure`, `from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget, QTableWidgetItem, QFrame, QLabel, QMessageBox, QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog`, `from PyQt5.QtCore import Qt, QDate`, `from PyQt5.QtGui import QMouseEvent`, `from datetime import datetime`
- Classes: `RoomFrame`, `ParticleDataViewer`, `HistoricalDataWindow`
- Functions: `convert_to_mountain`, `main`, `__init__`, `set_color_state`, `init_ui`, `refresh_data`, `populate_table`, `_normalize_name`, `update_room_colors`, `on_sensor_double_click`, `on_date_range_changed`, `filter_data_by_date_range`, `extract_timestamp_from_record`, `load_historical_data`, `populate_historical_table`, `update_graph`, `export_selected_data`, `export_all_data`, `_export_to_csv`
- Routes: none detected

## Sanitized Source Excerpt

```python
#!/usr/bin/env python3
"""
Particle Data Viewer GUI
A simple GUI application to view particle sensor data from the API endpoint.
"""

import sys
import warnings
import requests
import json
import csv
from datetime import datetime, timedelta
import pytz
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar
from matplotlib.figure import Figure
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
                             QHBoxLayout, QPushButton, QTableWidget,
                             QTableWidgetItem, QFrame, QLabel, QMessageBox,
                             QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog)
from PyQt5.QtCore import Qt, QDate
from PyQt5.QtGui import QMouseEvent

# Disable SSL warnings using warnings module
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

# Mountain Time timezone
MOUNTAIN_TZ = pytz.timezone('US/Mountain')

def convert_to_mountain(dt):
    """Convert datetime to Mountain Time, adding offset to fix API time discrepancy"""
    # Add 7 hours to fix the time discrepancy observed in the API data
    corrected_dt = dt + timedelta(hours=7)

    if corrected_dt.tzinfo is None:
        # Assume it's now in Mountain Time after correction
        return MOUNTAIN_TZ.localize(corrected_dt)
    else:
        # Convert to Mountain Time if it has timezone info
        return corrected_dt.astimezone(MOUNTAIN_TZ)


class RoomFrame(QFrame):
    """Custom QFrame for room color management"""
    def __init__(self, parent, room_name, initial_color="#FFFFE0"):
        super().__init__()
        self.parent = parent
        self.room_name = room_name
        self.state = "yellow"  # Track current state: yellow, red, green
        self.colors = {
            "yellow": "#FFFFE0",
            "red": "#FF6B6B",
            "green": "#4ECDC4"
        }
        self.setFrameStyle(QFrame.Box)
        self.setStyleSheet(f"background-color: {initial_color}; border: 0.5px solid #666;")

    def set_color_state(self, state):
        """Set the color state programmatically"""
        if state in self.colors:
            self.state = state
            new_color = self.colors[self.state]
            self.setStyleSheet(f"background-color: {new_color}; border: 0.5px solid #666;")


class ParticleDataViewer(QMainWindow):
    def __init__(self):
        super().__init__()
        self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"
        self.room_frames = {}  # Track room frames for state management
        self.init_ui()

    def init_ui(self):
        """Initialize the user interface"""
        self.setWindowTitle("Particle Data Viewer")
        self.setGeometry(100, 100, 1200, 700)

        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Main layout
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)

        # Refresh button
        self.refresh_button = QPushButton("Refresh")
        self.refresh_button.clicked.connect(self.refresh_data)
        self.refresh_button.setMaximumWidth(150)
        main_layout.addWidget(self.refresh_button, alignment=Qt.AlignCenter)

        # Content layout (left and right halves)
        content_layout = QHBoxLayout()
        main_layout.addLayout(content_layout)

        # Left half - Cleanroom Layout Map
        left_frame = QFrame()
        left_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
        left_frame.setLineWidth(2)
        left_layout = QVBoxLayout()
        left_frame.setLayout(left_layout)

        # Add title for the map
        map_title = QLabel("Cleanroom Layout")
        map_title.setAlignment(Qt.AlignCenter)
        map_title.setStyleSheet("font-weight: bold; font-size: 14px; margin: 5px;")
        left_layout.addWidget(map_title)

        # Create room layout widget
        room_widget = QWidget()
        room_layout = QGridLayout()
        room_widget.setLayout(room_layout)

        # Define room data with positions matching actual layout
        rooms = [
            # Top row - main cleanroom area
            {"name": "Gas/Chem\nStorage", "row": 0, "col": 1, "rowspan": 1, "colspan": 2, "color": "#FFFFE0"},
            {"name": "Chase", "row": 0, "col": 3, "rowspan": 1, "colspan": 6, "color": "#FFFFE0"},

            # Second row - Lab C above Lab B
            {"name": "Lab C\n2010N", "row": 1, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},

            # Main bay row - Bays A through G
            {"name": "Bay A\n2025N", "row": 2, "col": 1, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay B\n2022N", "row": 2, "col": 2, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay C\n2020N", "row": 2, "col": 3, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay D\n2018N", "row": 2, "col": 4, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay E\n2016N", "row": 2, "col": 5, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay F\n2014N", "row": 2, "col": 6, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Bay G\n2012N", "row": 2, "col": 7, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},

            # Right side labs
            {"name": "Lab B\n2008N", "row": 2, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Lab A\n2006N", "row": 3, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},

            # Bottom row
            {"name": "Bay M\nMetrology\n2026N", "row": 4, "col": 1, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Clean Conf\n2002N", "row": 4, "col": 2, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
            {"name": "Hallway", "row": 4, "col": 3, "rowspan": 1, "colspan": 5, "color": "#FFFFE0"},
            {"name": "Gowning\nRoom\n2221", "row": 4, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"}
        ]

        # Create room squares
        for room in rooms:
            room_frame = RoomFrame(self, room['name'], room['color'])

            # Store reference to room frame
            self.room_frames[room['name']] = room_frame

            room_label = QLabel(room['name'])
            room_label.setAlignment(Qt.AlignCenter)
            room_label.setStyleSheet("""
                font-size: 8px;
                font-weight: bold;
                padding: 2px;
                color: white;
                background-color: rgba(0, 0, 0, 180);
                border-radius: 3px;
                margin: 2px;
            """)

            room_frame_layout = QVBoxLayout()
            room_frame_layout.addWidget(room_label)
            room_frame.setLayout(room_frame_layout)
            room_frame.setMinimumSize(40, 30)

            room_layout.addWidget(room_frame, room['row'], room['col'],
                                room['rowspan'], room['colspan'])

        # Set spacing and margins
        room_layout.setSpacing(2)
        room_layout.setContentsMargins(5, 5, 5, 5)

        left_layout.addWidget(room_widget)
        content_layout.addWidget(left_frame, 1)  # stretch factor of 1

        # Right half - Table for particle data
        right_frame = QFrame()
        right_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
        right_frame.setLineWidth(2)
        right_layout = QVBoxLayout()
        right_frame.setLayout(right_layout)

        right_label = QLabel("Particle Data")
        right_label.setAlignment(Qt.AlignCenter)
        right_layout.addWidget(right_label)

        # Information label about double-click functionality
        info_label = QLabel("💡 Double-click any sensor row to view historical data")
        info_label.setAlignment(Qt.AlignCenter)
        info_label.setStyleSheet("color: #666; font-style: italic; margin: 5px; font-size: 12px;")
        right_layout.addWidget(info_label)

        # Create table
        self.table = QTableWidget()
        # Define columns
        self.columns = [
            "Room Name", "Sensor Number", "Timestamp",
            "pm0_5 (ft³)", "pm1 (ft³)", "pm2_5 (ft³)", "pm4 (ft³)", "pm10 (ft³)"
        ]
        self.table.setColumnCount(len(self.columns))
        self.table.setHorizontalHeaderLabels(self.columns)
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
        self.table.horizontalHeader().setStretchLastSection(False)
        self.table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
        self.table.setAlternatingRowColors(True)
        self.table.itemDoubleClicked.connect(self.on_sensor_double_click)
        right_layout.addWidget(self.table)

        content_layout.addWidget(right_frame, 1)  # stretch factor of 1

    def refresh_data(self):
        """Fetch data from API and populate the table"""
        try:
            # Make GET request to the API
            response = requests.get(self.api_url, verify=False, timeout=5)
            response.raise_for_status()

            # Parse JSON data
            data = response.json()

            # Clear existing data
            self.table.setRowCount(0)

            # Populate table with data
            self.populate_table(data)

            # Update cleanroom layout colors based on sensor data
            self.update_room_colors(data)

        except requests.exceptions.ConnectionError:
            QMessageBox.critical(self, "Connection Error",
                               f"Could not connect to {self.api_url}\nMake sure the server is running.")
        except requests.exceptions.Timeout:
            QMessageBox.critical(self, "Timeout Error",
                               "Request timed out. Server may be unresponsive.")
        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Request Error", f"Error fetching data: {str(e)}")
        except json.JSONDecodeError:
            QMessageBox.critical(self, "Parse Error", "Invalid JSON response from server.")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")

    def populate_table(self, data, prefix=""):
        """Populate the table with particle sensor data"""
        # Handle the API response structure with sensors array
        if isinstance(data, dict) and "sensors" in data:
            data_list = data["sensors"]
        elif isinstance(data, list):
            data_list = data
        else:
            data_list = [data]

        for record in data_list:
            row_position = self.table.rowCount()
            self.table.insertRow(row_position)

            # Column 0: Room Name
            room_name = record.get("room_name", "N/A") if isinstance(record, dict) else "N/A"
            self.table.setItem(row_position, 0, QTableWidgetItem(str(room_name)))

            # Column 1: Sensor Number
            sensor_number = record.get("sensor_number", "N/A") if isinstance(record, dict) else "N/A"
            self.table.setItem(row_position, 1, QTableWidgetItem(str(sensor_number)))

            # Column 2: Timestamp
            timestamp = record.get("timestamp") if isinstance(record, dict) else None
            if timestamp:
                try:
                    # Handle string timestamp format
                    if isinstance(timestamp, str):
                        from datetime import datetime
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        # Convert to Mountain Time
                        dt_mountain = convert_to_mountain(dt)
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
                    else:
                        dt = datetime.fromtimestamp(timestamp)
                        # Convert to Mountain Time
                        dt_mountain = convert_to_mountain(dt)
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
                except:
                    timestamp_str = str(timestamp)
            else:
                timestamp_str = "N/A"
            self.table.setItem(row_position, 2, QTableWidgetItem(timestamp_str))

            # Get converted values
            converted = record.get("converted_values", {}) if isinstance(record, dict) else {}

            # Columns 3-7: Number concentrations (ft³)
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}
            self.table.setItem(row_position, 3, QTableWidgetItem(str(num_conc.get("pm0_5", "N/A"))))
            self.table.setItem(row_position, 4, QTableWidgetItem(str(num_conc.get("pm1", "N/A"))))
            self.table.setItem(row_position, 5, QTableWidgetItem(str(num_conc.get("pm2_5", "N/A"))))
            self.table.setItem(row_position, 6, QTableWidgetItem(str(num_conc.get("pm4", "N/A"))))
            self.table.setItem(row_position, 7, QTableWidgetItem(str(num_conc.get("pm10", "N/A"))))

    def _normalize_name(self, name):
        """Normalize a room name for matching: take first line, remove spaces, lowercase"""
        first_line = name.split('\n')[0].strip()
        return first_line.replace(' ', '').lower()

    def update_room_colors(self, data):
        """Update room frame colors based on particle data freshness and values.

        Yellow = no matching sensor data or stale data (>30 min old)
        Green  = fresh data with all particle counts at 0
        Red    = fresh data with any particle count > 0
        """
        # Reset all rooms to yellow (disconnected / no data)
        for room_frame in self.room_frames.values():
            room_frame.set_color_state("yellow")

        # Extract the sensor list from the API response
        if isinstance(data, dict) and "sensors" in data:
            data_list = data["sensors"]
        elif isinstance(data, list):
            data_list = data
        else:
            data_list = [data]

        # Build lookup: normalized API room_name -> record
        api_rooms = {}
        for record in data_list:
            if isinstance(record, dict):
                room_name = record.get("room_name", "")
                normalized = room_name.replace(' ', '').lower()
                api_rooms[normalized] = record

        now = datetime.now(MOUNTAIN_TZ)

        for layout_name, room_frame in self.room_frames.items():
            normalized_layout = self._normalize_name(layout_name)

            if normalized_layout not in api_rooms:
                continue  # No matching sensor data – stays yellow

            record = api_rooms[normalized_layout]

            # --- Parse timestamp ---
            timestamp = record.get("timestamp")
            if not timestamp:
                continue

            try:
                if isinstance(timestamp, str):
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    dt_mountain = convert_to_mountain(dt)
                else:
                    dt = datetime.fromtimestamp(timestamp)
                    dt_mountain = convert_to_mountain(dt)
            except Exception:
                continue

            # --- Check freshness (stale = more than 30 minutes old) ---
            age = now - dt_mountain
            if age > timedelta(minutes=30):
                continue  # Stale data – stays yellow

            # --- Check particle values ---
            converted = record.get("converted_values", {})
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}

            try:
                pm0_5 = float(num_conc.get("pm0_5", 0) or 0)
                pm1   = float(num_conc.get("pm1", 0) or 0)
                pm4   = float(num_conc.get("pm4", 0) or 0)
                pm10  = float(num_conc.get("pm10", 0) or 0)
            except (ValueError, TypeError):
                continue

            if pm0_5 == 0 and pm1 == 0 and pm4 == 0 and pm10 == 0:
                room_frame.set_color_state("green")
            else:
                room_frame.set_color_state("red")

    def on_sensor_double_click(self, item):
        """Handle double-click on sensor table item"""
        row = item.row()
        room_name_item = self.table.item(row, 0)
        sensor_number_item = self.table.item(row, 1)

        if room_name_item and sensor_number_item:
            room_name = room_name_item.text()
            sensor_number = sensor_number_item.text()

            # Open historical data window
            self.historical_window = HistoricalDataWindow(room_name, sensor_number, self.api_url)
            self.historical_window.show()


class HistoricalDataWindow(QMainWindow):
    def __init__(self, room_name, sensor_number, api_url):
        super().__init__()
        self.room_name = room_name
        self.sensor_number = sensor_number
        self.api_url = api_url
        self.init_ui()
        self.load_historical_data()

    def init_ui(self):
        """Initialize the historical data window UI"""
        self.setWindowTitle(f"Historical Data - {self.room_name}/{self.sensor_number}")
        self.setGeometry(150, 150, 1600, 900)

        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Main layout
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)

        # Title label
        title_label = QLabel(f"Historical Data for {self.room_name} - {self.sensor_number}")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; margin: 10px;")
        main_layout.addWidget(title_label)

        # Control panel
        control_layout = QHBoxLayout()

        # Date range controls
        date_label = QLabel("Date Range:")
        control_layout.addWidget(date_label)

        start_date_label = QLabel("Start:")
        control_layout.addWidget(start_date_label)

        # Set default to one week ago
        default_start_date = QDate.currentDate().addDays(-7)
        self.start_date_edit = QDateEdit(default_start_date)
        self.start_date_edit.setCalendarPopup(True)
        self.start_date_edit.setMaximumWidth(120)
        self.start_date_edit.dateChanged.connect(self.on_date_range_changed)
        control_layout.addWidget(self.start_date_edit)

        end_date_label = QLabel("End:")
        control_layout.addWidget(end_date_label)

        # Set default to today
        default_end_date = QDate.currentDate()
        self.end_date_edit = QDateEdit(default_end_date)
        self.end_date_edit.setCalendarPopup(True)
        self.end_date_edit.setMaximumWidth(120)
        self.end_date_edit.dateChanged.connect(self.on_date_range_changed)
        control_layout.addWidget(self.end_date_edit)

        # Add some spacing
        control_layout.addWidget(QLabel("  "))

        # CSV Export buttons
        export_selected_button = QPushButton("Export Selected Data")
        export_selected_button.clicked.connect(self.export_selected_data)
        export_selected_button.setMaximumWidth(150)
        control_layout.addWidget(export_selected_button)

        export_all_button = QPushButton("Export All Data")
        export_all_button.clicked.connect(self.export_all_data)
        export_all_button.setMaximumWidth(150)
        control_layout.addWidget(export_all_button)

        # Refresh button (hidden from user but code preserved)
        # refresh_button = QPushButton("Refresh Historical Data")
        # refresh_button.clicked.connect(self.load_historical_data)
        # refresh_button.setMaximumWidth(200)
        # control_layout.addWidget(refresh_button)

        # PM Size checkboxes
        pm_label = QLabel("PM Sizes to Graph (ft³):")
        control_layout.addWidget(pm_label)

        # Create checkbox layout
        checkbox_widget = QWidget()
        checkbox_layout = QHBoxLayout()
        checkbox_widget.setLayout(checkbox_layout)

        # Create checkboxes for each PM size
        self.pm_checkboxes = {}
        pm_sizes = [("PM0.5", "num_pm0_5_ft3", True),
                    ("PM1", "num_pm1_ft3", True),
                    ("PM2.5", "num_pm2_5_ft3", True),
                    ("PM4", "num_pm4_ft3", True),
                    ("PM10", "num_pm10_ft3", True)]

        for display_name, data_key, default_checked in pm_sizes:
            checkbox = QCheckBox(display_name)
            checkbox.setChecked(default_checked)
            checkbox.stateChanged.connect(self.update_graph)
            self.pm_checkboxes[data_key] = checkbox
            checkbox_layout.addWidget(checkbox)

        control_layout.addWidget(checkbox_widget)

        control_layout.addStretch()
        main_layout.addLayout(control_layout)

        # Create horizontal splitter for table and graph
        splitter = QSplitter(Qt.Horizontal)
        main_layout.addWidget(splitter)

        # Left side - Historical data table
        table_widget = QWidget()
        table_layout = QVBoxLayout()
        table_widget.setLayout(table_layout)

        table_label = QLabel("Historical Data Table")
        table_label.setAlignment(Qt.AlignCenter)
        table_label.setStyleSheet("font-weight: bold; margin: 5px;")
        table_layout.addWidget(table_label)

        self.hist_table = QTableWidget()

        # Define columns for historical data (excluding room_name and sensor_number)
        self.hist_columns = [
            "Timestamp", "ISO Timestamp",
            "PM1 Mass", "PM2.5 Mass", "PM4 Mass", "PM10 Mass",
            "PM0.5 Count", "PM1 Count", "PM2.5 Count", "PM4 Count", "PM10 Count",
            "Particle Size (μm)",
            "PM0.5 (ft³)", "PM1 (ft³)", "PM2.5 (ft³)", "PM4 (ft³)", "PM10 (ft³)",
            "Bin 0.3-0.5", "Bin 0.5-1.0", "Bin 1.0-2.5", "Bin 2.5-4.0", "Bin 4.0-10",
            "PM1 (μg/m³)", "PM2.5 (μg/m³)", "PM4 (μg/m³)", "PM10 (μg/m³)"
        ]

        self.hist_table.setColumnCount(len(self.hist_columns))
        self.hist_table.setHorizontalHeaderLabels(self.hist_columns)
        self.hist_table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
        self.hist_table.horizontalHeader().setStretchLastSection(False)
        self.hist_table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
        self.hist_table.setAlternatingRowColors(True)
        self.hist_table.setSortingEnabled(True)

        table_layout.addWidget(self.hist_table)
        splitter.addWidget(table_widget)

        # Right side - Graph
        graph_widget = QWidget()
        graph_layout = QVBoxLayout()
        graph_widget.setLayout(graph_layout)

        graph_label = QLabel("Historical Data Graph")
        graph_label.setAlignment(Qt.AlignCenter)
        graph_label.setStyleSheet("font-weight: bold; margin: 5px;")
        graph_layout.addWidget(graph_label)

        # Create matplotlib figure and canvas
        self.figure = Figure(figsize=(8, 6), dpi=80)
        self.canvas = FigureCanvas(self.figure)
        self.ax = self.figure.add_subplot(111)

        # Add navigation toolbar for zoom, pan, and reset functionality
        self.toolbar = NavigationToolbar(self.canvas, graph_widget)
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")

        graph_layout.addWidget(self.toolbar)
        graph_layout.addWidget(self.canvas)

        splitter.addWidget(graph_widget)

        # Set initial splitter sizes (50/50 split)
        splitter.setSizes([800, 800])

        # Store historical data for graphing
        self.historical_data = []  # All data from API
        self.filtered_data = []    # Filtered data based on date range

    def on_date_range_changed(self):
        """Handle date range changes"""
        self.filter_data_by_date_range()
        self.populate_historical_table(self.filtered_data)
        self.update_graph()

    def filter_data_by_date_range(self):
        """Filter historical data based on selected date range"""
        start_date = self.start_date_edit.date().toPyDate()
        end_date = self.end_date_edit.date().toPyDate()

        # Add one day to end_date to include the entire end day
        end_date = end_date + timedelta(days=1)

        self.filtered_data = []

        for record in self.historical_data:
            # Extract timestamp from record
            record_datetime = self.extract_timestamp_from_record(record)

            if record_datetime:
                record_date = record_datetime.date()
                if start_date <= record_date < end_date:
                    self.filtered_data.append(record)

    def extract_timestamp_from_record(self, record):
        """Extract datetime object from a record"""
        timestamp_value = None

        # Check for standard timestamp formats first
        if "timestamp_iso" in record:
            timestamp_value = record["timestamp_iso"]
        elif "timestamp" in record:
            timestamp_value = record["timestamp"]
        else:
            # Look for timestamp in raw data
            for key, value in record.items():
                if isinstance(value, str) and 'T' in value and ':' in value:
                    timestamp_value = value
                    break
                elif isinstance(key, str) and 'T' in key and ':' in key:
                    timestamp_value = key
                    break

            # If still no timestamp, try Unix timestamp
            if not timestamp_value:
                for key, value in record.items():
                    if isinstance(key, str) and key.replace('.', '').isdigit() and len(key) >= 10:
                        try:
                            timestamp_value = float(key)
                            break
                        except:
                            pass
                    elif isinstance(value, (int, float, str)) and str(value).replace('.', '').isdigit() and len(str(value)) >= 10:
                        try:
                            timestamp_value = float(value)
                            break
                        except:
                            pass

        if timestamp_value is not None:
            try:
                if isinstance(timestamp_value, str):
                    # Try ISO format
                    if 'T' in timestamp_value:
                        return datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
                    else:
                        # Try to parse as Unix timestamp string
                        return datetime.fromtimestamp(float(timestamp_value))
                else:
                    # Numeric timestamp
                    return datetime.fromtimestamp(float(timestamp_value))
            except (ValueError, TypeError, OSError):
                pass

        return None

    def load_historical_data(self):
        """Load historical data from the API"""
        try:
            # Make request for historical data
            url = f"{self.api_url}?room_name={self.room_name}&sensor_number={self.sensor_number}"
            response = requests.get(url, verify=False, timeout=10)
            response.raise_for_status()

            data = response.json()

            # Handle different response formats
            if data.get("status") == "success" and "historical_data" in data:
                self.historical_data = data["historical_data"]
            elif "historical_data" in data:  # Handle response without status field
                self.historical_data = data["historical_data"]
            else:
                QMessageBox.warning(self, "No Data",
                                   f"No historical data found for {self.room_name}/{self.sensor_number}")
                return

            # Filter data and update displays
            self.filter_data_by_date_range()
            self.populate_historical_table(self.filtered_data)
            self.update_graph()

        except requests.exceptions.ConnectionError:
            QMessageBox.critical(self, "Connection Error",
                               "Could not connect to server. Make sure the server is running.")
        except requests.exceptions.RequestException as e:
            QMessageBox.critical(self, "Request Error", f"Error fetching historical data: {str(e)}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")

    def populate_historical_table(self, historical_data):
        """Populate the historical data table"""
        self.hist_table.setRowCount(0)  # Clear existing data

        for record in historical_data:
            row_position = self.hist_table.rowCount()
            self.hist_table.insertRow(row_position)

            # Check for standard data structure first
            if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
                # Standard structured format
                columns_data = [
                    record.get("timestamp", "N/A"),
                    record.get("timestamp_iso", "N/A"),
                    record.get("mass_pm1", "N/A"),
                    record.get("mass_pm2_5", "N/A"),
                    record.get("mass_pm4", "N/A"),
                    record.get("mass_pm10", "N/A"),
                    record.get("num_pm0_5", "N/A"),
                    record.get("num_pm1", "N/A"),
                    record.get("num_pm2_5", "N/A"),
                    record.get("num_pm4", "N/A"),
                    record.get("num_pm10", "N/A"),
                    record.get("typical_particle_size_um", "N/A"),
                    record.get("num_pm0_5_ft3", "N/A"),
                    record.get("num_pm1_ft3", "N/A"),
                    record.get("num_pm2_5_ft3", "N/A"),
                    record.get("num_pm4_ft3", "N/A"),
                    record.get("num_pm10_ft3", "N/A"),
                    record.get("bin_0_3_to_0_5", "N/A"),
                    record.get("bin_0_5_to_1_0", "N/A"),
                    record.get("bin_1_0_to_2_5", "N/A"),
                    record.get("bin_2_5_to_4_0", "N/A"),
                    record.get("bin_4_0_to_10", "N/A"),
                    record.get("mass_pm1_ug_m3", "N/A"),
                    record.get("mass_pm2_5_ug_m3", "N/A"),
                    record.get("mass_pm4_ug_m3", "N/A"),
                    record.get("mass_pm10_ug_m3", "N/A")
                ]
            else:
                # Raw CSV format - keys are timestamps and particle sizes
                # Try to extract timestamp information
                timestamp_unix = None
                timestamp_iso = None

                # Look for timestamp patterns in keys
                for key in record.keys():
                    if isinstance(key, str):
                        # Look for ISO timestamp format in keys
                        if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
                            timestamp_iso = key
                        # Look for Unix timestamp (numeric string)
                        elif key.replace('.', '').isdigit() and len(key) >= 10:
                            try:
                                # Validate it's a reasonable Unix timestamp
                                ts = float(key)
                                if ts > 1000000000:  # After 2001
                                    timestamp_unix = key
                            except:
                                pass

                # Look for timestamp patterns in values if not found in keys
                if not timestamp_unix and not timestamp_iso:
                    for key, value in record.items():
                        if isinstance(value, str):
                            if 'T' in value and (':' in value or '-' in value) and len(value) > 15:
                                timestamp_iso = value
                            elif value.replace('.', '').isdigit() and len(value) >= 10:
                                try:
                                    ts = float(value)
                                    if ts > 1000000000:
                                        timestamp_unix = value
                                except:
                                    pass

                columns_data = [
                    timestamp_unix if timestamp_unix else "N/A",
                    timestamp_iso if timestamp_iso else "N/A"
                ]

                # Add particle measurement data
                # Look for numeric keys that might represent particle measurements
                particle_measurements = {}
                for key, value in record.items():
                    try:
                        # Skip timestamp keys we already processed
                        if key == timestamp_unix or key == timestamp_iso:
                            continue
                        # Skip non-numeric keys that are identifiers
                        if key in ['room_name', 'sensor_number']:
                            continue

                        # Try to parse key as particle size
                        if isinstance(key, str) and key.replace('.', '').isdigit():
                            size = float(key)
                            if 0.1 <= size <= 50.0:  # Reasonable particle size range in micrometers
                                particle_measurements[size] = value
                    except (ValueError, TypeError):
                        continue

                # Sort particle measurements by size
                sorted_measurements = sorted(particle_measurements.items())

                # Fill in columns based on available data
                # For now, put the particle size data in the remaining columns
                remaining_cols = len(self.hist_columns) - 2  # Subtract timestamp columns
                for i in range(remaining_cols):
                    if i < len(sorted_measurements):
                        size, value = sorted_measurements[i]
                        columns_data.append(f"{size}μm: {value}")
                    else:
                        columns_data.append("N/A")

            # Set items in the table
            for col, value in enumerate(columns_data):
                if col >= len(self.hist_columns):
                    break

                if value is None:
                    value = "N/A"
                elif isinstance(value, float):
                    value = f"{value:.6f}"
                self.hist_table.setItem(row_position, col, QTableWidgetItem(str(value)))

        # Sort by timestamp (most recent first) if we have timestamp data
        if self.hist_table.rowCount() > 0:
            try:
                self.hist_table.sortItems(0, Qt.DescendingOrder)
            except:
                # If sorting fails, that's okay
                pass

    def update_graph(self):
        """Update the graph based on selected PM sizes"""
        if not self.filtered_data:
            # Clear the plot if no data
            self.ax.clear()
            self.ax.set_title("No Data Available for Selected Date Range")
            self.ax.set_xlabel("Time")
            self.ax.set_ylabel("Particle Count (ft³)")
            self.canvas.draw()
            return

        # Get checked PM sizes
        checked_params = []
        for data_key, checkbox in self.pm_checkboxes.items():
            if checkbox.isChecked():
                checked_params.append(data_key)

        if not checked_params:
            # Clear the plot if no parameters selected
            self.ax.clear()
            self.ax.set_title("No PM Sizes Selected")
            self.ax.set_xlabel("Time")
            self.ax.set_ylabel("Particle Count (ft³)")
            self.canvas.draw()
            return

        # Fixed color mapping for each PM size to maintain consistency
        color_map = {
            "num_pm0_5_ft3": 'blue',
            "num_pm1_ft3": 'red',
            "num_pm2_5_ft3": 'green',
            "num_pm4_ft3": 'orange',
            "num_pm10_ft3": 'purple'
        }

        # Clear the plot
        self.ax.clear()

        # Process each checked parameter
        legend_labels = []
        for data_key in checked_params:
            timestamps = []
            values = []

            for record in self.filtered_data:
                # Try to extract timestamp
                timestamp_value = None

                # Check for standard timestamp formats first
                if "timestamp_iso" in record:
                    timestamp_value = record["timestamp_iso"]
                elif "timestamp" in record:
                    timestamp_value = record["timestamp"]
                else:
                    # Look for timestamp in raw data
                    for key, value in record.items():
                        if isinstance(value, str) and 'T' in value and ':' in value:
                            timestamp_value = value
                            break
                        elif isinstance(key, str) and 'T' in key and ':' in key:
                            timestamp_value = key
                            break

                    # If still no timestamp, try Unix timestamp
                    if not timestamp_value:
                        for key, value in record.items():
                            if isinstance(key, str) and key.replace('.', '').isdigit() and len(key) >= 10:
                                try:
                                    timestamp_value = float(key)
                                    break
                                except:
                                    pass
                            elif isinstance(value, (int, float, str)) and str(value).replace('.', '').isdigit() and len(str(value)) >= 10:
                                try:
                                    timestamp_value = float(value)
                                    break
                                except:
                                    pass

                # Try to extract value for the current parameter
                param_value = None

                if data_key in record:
                    param_value = record[data_key]

                # Process timestamp and add to data if we have both timestamp and value
                if timestamp_value is not None and param_value is not None:
                    try:
                        if isinstance(timestamp_value, str):
                            # Try ISO format
                            if 'T' in timestamp_value:
                                dt = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
                            else:
                                # Try to parse as Unix timestamp string
                                dt = datetime.fromtimestamp(float(timestamp_value))
                        else:
                            # Numeric timestamp
                            dt = datetime.fromtimestamp(float(timestamp_value))

                        # Convert to Mountain Time
                        dt_mountain = convert_to_mountain(dt)
                        timestamps.append(dt_mountain)
                        values.append(float(param_value))
                    except (ValueError, TypeError, OSError):
                        continue

            # Plot this parameter if we have data
            if timestamps and values:
                # Sort by timestamp
                sorted_data = sorted(zip(timestamps, values))
                timestamps, values = zip(*sorted_data)

                # Get display name for legend
                display_name = {
                    "num_pm0_5_ft3": "PM0.5",
                    "num_pm1_ft3": "PM1",
                    "num_pm2_5_ft3": "PM2.5",
                    "num_pm4_ft3": "PM4",
                    "num_pm10_ft3": "PM10"
                }.get(data_key, data_key)

                # Plot line
                color = color_map[data_key]
                self.ax.plot(timestamps, values, color=color, linewidth=2, marker='o',
                           markersize=3, label=display_name, alpha=0.8)
                legend_labels.append(display_name)

        # Set title and labels
        self.ax.set_title("PM Particle Concentrations Over Time")
        self.ax.set_xlabel("Time (Mountain Time)")
        self.ax.set_ylabel("Particle Count (ft³)")
        self.ax.grid(True, alpha=0.3)

        # Add legend if we have data
        if legend_labels:
            self.ax.legend(loc='upper right')

        # Format x-axis
        self.figure.autofmt_xdate()

        # Adjust layout and refresh
        self.figure.tight_layout()
        self.canvas.draw()

    def export_selected_data(self):
        """Export currently filtered/displayed data to CSV"""
        if not self.filtered_data:
            QMessageBox.information(self, "No Data", "No data available to export.")
            return

        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export Selected Data",
            f"particle_data_{self.room_name}_{self.sensor_number}_selected.csv",
            "CSV Files (*.csv)"
        )

        if file_path:
            self._export_to_csv(self.filtered_data, file_path)

    def export_all_data(self):
        """Export all historical data to CSV"""
        if not self.historical_data:
            QMessageBox.information(self, "No Data", "No data available to export.")
            return

        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export All Data",
            f"particle_data_{self.room_name}_{self.sensor_number}_all.csv",
            "CSV Files (*.csv)"
        )

        if file_path:
            self._export_to_csv(self.historical_data, file_path)

    def _export_to_csv(self, data, file_path):
        """Helper method to write data to CSV file"""
        try:
            with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)

                # Write header
                writer.writerow(self.hist_columns)

                # Write data rows
                for record in data:
                    row_data = []

                    # Check for standard data structure first
                    if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
                        # Standard structured format
                        columns_data = [
                            record.get("timestamp", ""),
                            record.get("timestamp_iso", ""),
                            record.get("mass_pm1", ""),
                            record.get("mass_pm2_5", ""),
                            record.get("mass_pm4", ""),
                            record.get("mass_pm10", ""),
                            record.get("num_pm0_5", ""),
                            record.get("num_pm1", ""),
                            record.get("num_pm2_5", ""),
                            record.get("num_pm4", ""),
                            record.get("num_pm10", ""),
                            record.get("typical_particle_size_um", ""),
                            record.get("num_pm0_5_ft3", ""),
                            record.get("num_pm1_ft3", ""),
                            record.get("num_pm2_5_ft3", ""),
                            record.get("num_pm4_ft3", ""),
                            record.get("num_pm10_ft3", ""),
                            record.get("bin_0_3_to_0_5", ""),
                            record.get("bin_0_5_to_1_0", ""),
                            record.get("bin_1_0_to_2_5", ""),
                            record.get("bin_2_5_to_4_0", ""),
                            record.get("bin_4_0_to_10", ""),
                            record.get("mass_pm1_ug_m3", ""),
                            record.get("mass_pm2_5_ug_m3", ""),
                            record.get("mass_pm4_ug_m3", ""),
                            record.get("mass_pm10_ug_m3", "")
                        ]
                    else:
                        # Raw CSV format handling
                        timestamp_unix = None
                        timestamp_iso = None

                        # Look for timestamp patterns
                        for key in record.keys():
                            if isinstance(key, str):
                                if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
                                    timestamp_iso = key
                                elif key.replace('.', '').isdigit() and len(key) >= 10:
                                    try:
                                        ts = float(key)
                                        if ts > 1000000000:
                                            timestamp_unix = key
                                    except:
                                        pass

                        columns_data = [timestamp_unix or "", timestamp_iso or ""]

                        # Add particle data
                        particle_measurements = {}
                        for key, value in record.items():
                            try:
                                if key == timestamp_unix or key == timestamp_iso:
                                    continue
                                if key in ['room_name', 'sensor_number']:
                                    continue
                                if isinstance(key, str) and key.replace('.', '').isdigit():
                                    size = float(key)
                                    if 0.1 <= size <= 50.0:
                                        particle_measurements[size] = value
                            except (ValueError, TypeError):
                                continue

                        sorted_measurements = sorted(particle_measurements.items())
                        remaining_cols = len(self.hist_columns) - 2
                        for i in range(remaining_cols):
                            if i < len(sorted_measurements):
                                size, value = sorted_measurements[i]
                                columns_data.append(f"{size}μm: {value}")
                            else:
                                columns_data.append("")

                    # Clean the data for CSV
                    clean_row = []
                    for value in columns_data:
                        if value is None or value == "N/A":
                            clean_row.append("")
                        else:
                            clean_row.append(str(value))

                    writer.writerow(clean_row)

            QMessageBox.information(self, "Export Complete", f"Data exported successfully to:\n{file_path}")

        except Exception as e:
            QMessageBox.critical(self, "Export Error", f"Error exporting data to CSV:\n{str(e)}")


def main():
    app = QApplication(sys.argv)
    viewer = ParticleDataViewer()
    viewer.show()
    sys.exit(app.exec_())


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
Particle Data Viewer GUI
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 4

```text
A simple GUI application to view particle sensor data from the API endpoint.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 5

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 7

```text
import sys
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 8

```text
import warnings
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 9

```text
import requests
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 11

```text
import csv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
from datetime import datetime, timedelta
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 13

```text
import pytz
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 14

```text
import matplotlib.pyplot as plt
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 15

```text
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 16

```text
from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT as NavigationToolbar
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 17

```text
from matplotlib.figure import Figure
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 18

```text
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout,
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 19

```text
                             QHBoxLayout, QPushButton, QTableWidget,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 20

```text
                             QTableWidgetItem, QFrame, QLabel, QMessageBox,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 21

```text
                             QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 22

```text
from PyQt5.QtCore import Qt, QDate
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 23

```text
from PyQt5.QtGui import QMouseEvent
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 26

```text
warnings.filterwarnings('ignore', message='Unverified HTTPS request')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 29

```text
MOUNTAIN_TZ = pytz.timezone('US/Mountain')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 31

```text
def convert_to_mountain(dt):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 32

```text
    """Convert datetime to Mountain Time, adding offset to fix API time discrepancy"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 34

```text
    corrected_dt = dt + timedelta(hours=7)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 36

```text
    if corrected_dt.tzinfo is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 38

```text
        return MOUNTAIN_TZ.localize(corrected_dt)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 39

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 41

```text
        return corrected_dt.astimezone(MOUNTAIN_TZ)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 44

```text
class RoomFrame(QFrame):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 45

```text
    """Custom QFrame for room color management"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 46

```text
    def __init__(self, parent, room_name, initial_color="#FFFFE0"):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 47

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 48

```text
        self.parent = parent
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 49

```text
        self.room_name = room_name
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 50

```text
        self.state = "yellow"  # Track current state: yellow, red, green
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 51

```text
        self.colors = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 52

```text
            "yellow": "#FFFFE0",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 53

```text
            "red": "#FF6B6B",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 54

```text
            "green": "#4ECDC4"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 55

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 56

```text
        self.setFrameStyle(QFrame.Box)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 57

```text
        self.setStyleSheet(f"background-color: {initial_color}; border: 0.5px solid #666;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 59

```text
    def set_color_state(self, state):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 60

```text
        """Set the color state programmatically"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 61

```text
        if state in self.colors:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 62

```text
            self.state = state
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 63

```text
            new_color = self.colors[self.state]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 64

```text
            self.setStyleSheet(f"background-color: {new_color}; border: 0.5px solid #666;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 67

```text
class ParticleDataViewer(QMainWindow):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 68

```text
    def __init__(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 69

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 70

```text
        self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 71

```text
        self.room_frames = {}  # Track room frames for state management
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 72

```text
        self.init_ui()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 74

```text
    def init_ui(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 75

```text
        """Initialize the user interface"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 76

```text
        self.setWindowTitle("Particle Data Viewer")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 77

```text
        self.setGeometry(100, 100, 1200, 700)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 80

```text
        central_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 81

```text
        self.setCentralWidget(central_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 84

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        central_widget.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 88

```text
        self.refresh_button = QPushButton("Refresh")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 89

```text
        self.refresh_button.clicked.connect(self.refresh_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 90

```text
        self.refresh_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 91

```text
        main_layout.addWidget(self.refresh_button, alignment=Qt.AlignCenter)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 94

```text
        content_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 95

```text
        main_layout.addLayout(content_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 98

```text
        left_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 99

```text
        left_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 100

```text
        left_frame.setLineWidth(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 101

```text
        left_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 102

```text
        left_frame.setLayout(left_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 105

```text
        map_title = QLabel("Cleanroom Layout")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 106

```text
        map_title.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 107

```text
        map_title.setStyleSheet("font-weight: bold; font-size: 14px; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 108

```text
        left_layout.addWidget(map_title)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 111

```text
        room_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 112

```text
        room_layout = QGridLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 113

```text
        room_widget.setLayout(room_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 116

```text
        rooms = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 118

```text
            {"name": "Gas/Chem\nStorage", "row": 0, "col": 1, "rowspan": 1, "colspan": 2, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 119

```text
            {"name": "Chase", "row": 0, "col": 3, "rowspan": 1, "colspan": 6, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 122

```text
            {"name": "Lab C\n2010N", "row": 1, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 125

```text
            {"name": "Bay A\n2025N", "row": 2, "col": 1, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 126

```text
            {"name": "Bay B\n2022N", "row": 2, "col": 2, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 127

```text
            {"name": "Bay C\n2020N", "row": 2, "col": 3, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 128

```text
            {"name": "Bay D\n2018N", "row": 2, "col": 4, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 129

```text
            {"name": "Bay E\n2016N", "row": 2, "col": 5, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 130

```text
            {"name": "Bay F\n2014N", "row": 2, "col": 6, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 131

```text
            {"name": "Bay G\n2012N", "row": 2, "col": 7, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 134

```text
            {"name": "Lab B\n2008N", "row": 2, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 135

```text
            {"name": "Lab A\n2006N", "row": 3, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 138

```text
            {"name": "Bay M\nMetrology\n2026N", "row": 4, "col": 1, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 139

```text
            {"name": "Clean Conf\n2002N", "row": 4, "col": 2, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 140

```text
            {"name": "Hallway", "row": 4, "col": 3, "rowspan": 1, "colspan": 5, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 141

```text
            {"name": "Gowning\nRoom\n2221", "row": 4, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 142

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 145

```text
        for room in rooms:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 146

```text
            room_frame = RoomFrame(self, room['name'], room['color'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 149

```text
            self.room_frames[room['name']] = room_frame
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 151

```text
            room_label = QLabel(room['name'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 152

```text
            room_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 153

```text
            room_label.setStyleSheet("""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 154

```text
                font-size: 8px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 155

```text
                font-weight: bold;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 156

```text
                padding: 2px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 157

```text
                color: white;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 158

```text
                background-color: rgba(0, 0, 0, 180);
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 159

```text
                border-radius: 3px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 160

```text
                margin: 2px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 161

```text
            """)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 163

```text
            room_frame_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 164

```text
            room_frame_layout.addWidget(room_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 165

```text
            room_frame.setLayout(room_frame_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 166

```text
            room_frame.setMinimumSize(40, 30)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 168

```text
            room_layout.addWidget(room_frame, room['row'], room['col'],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 169

```text
                                room['rowspan'], room['colspan'])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 172

```text
        room_layout.setSpacing(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 173

```text
        room_layout.setContentsMargins(5, 5, 5, 5)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 175

```text
        left_layout.addWidget(room_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 176

```text
        content_layout.addWidget(left_frame, 1)  # stretch factor of 1
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 179

```text
        right_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 180

```text
        right_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 181

```text
        right_frame.setLineWidth(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 182

```text
        right_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 183

```text
        right_frame.setLayout(right_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 185

```text
        right_label = QLabel("Particle Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 186

```text
        right_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 187

```text
        right_layout.addWidget(right_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 190

```text
        info_label = QLabel("💡 Double-click any sensor row to view historical data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 191

```text
        info_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 192

```text
        info_label.setStyleSheet("color: #666; font-style: italic; margin: 5px; font-size: 12px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 193

```text
        right_layout.addWidget(info_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 196

```text
        self.table = QTableWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 198

```text
        self.columns = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 199

```text
            "Room Name", "Sensor Number", "Timestamp",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
            "pm0_5 (ft³)", "pm1 (ft³)", "pm2_5 (ft³)", "pm4 (ft³)", "pm10 (ft³)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 201

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 202

```text
        self.table.setColumnCount(len(self.columns))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 203

```text
        self.table.setHorizontalHeaderLabels(self.columns)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 204

```text
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 205

```text
        self.table.horizontalHeader().setStretchLastSection(False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
        self.table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 207

```text
        self.table.setAlternatingRowColors(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 208

```text
        self.table.itemDoubleClicked.connect(self.on_sensor_double_click)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 209

```text
        right_layout.addWidget(self.table)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 211

```text
        content_layout.addWidget(right_frame, 1)  # stretch factor of 1
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 213

```text
    def refresh_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 214

```text
        """Fetch data from API and populate the table"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 215

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 217

```text
            response = requests.get(self.api_url, verify=False, timeout=5)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 218

```text
            response.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 221

```text
            data = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 224

```text
            self.table.setRowCount(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 227

```text
            self.populate_table(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 230

```text
            self.update_room_colors(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 232

```text
        except requests.exceptions.ConnectionError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 233

```text
            QMessageBox.critical(self, "Connection Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 234

```text
                               f"Could not connect to {self.api_url}\nMake sure the server is running.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 235

```text
        except requests.exceptions.Timeout:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 236

```text
            QMessageBox.critical(self, "Timeout Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 237

```text
                               "Request timed out. Server may be unresponsive.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 238

```text
        except requests.exceptions.RequestException as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 239

```text
            QMessageBox.critical(self, "Request Error", f"Error fetching data: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 240

```text
        except json.JSONDecodeError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 241

```text
            QMessageBox.critical(self, "Parse Error", "Invalid JSON response from server.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 242

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 243

```text
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 245

```text
    def populate_table(self, data, prefix=""):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 246

```text
        """Populate the table with particle sensor data"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 248

```text
        if isinstance(data, dict) and "sensors" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 249

```text
            data_list = data["sensors"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 250

```text
        elif isinstance(data, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 251

```text
            data_list = data
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 252

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 253

```text
            data_list = [data]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 255

```text
        for record in data_list:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 256

```text
            row_position = self.table.rowCount()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 257

```text
            self.table.insertRow(row_position)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 260

```text
            room_name = record.get("room_name", "N/A") if isinstance(record, dict) else "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 261

```text
            self.table.setItem(row_position, 0, QTableWidgetItem(str(room_name)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 264

```text
            sensor_number = record.get("sensor_number", "N/A") if isinstance(record, dict) else "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 265

```text
            self.table.setItem(row_position, 1, QTableWidgetItem(str(sensor_number)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 268

```text
            timestamp = record.get("timestamp") if isinstance(record, dict) else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 269

```text
            if timestamp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 270

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 272

```text
                    if isinstance(timestamp, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 273

```text
                        from datetime import datetime
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 274

```text
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 276

```text
                        dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 277

```text
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 278

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 279

```text
                        dt = datetime.fromtimestamp(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 281

```text
                        dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 282

```text
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 283

```text
                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 284

```text
                    timestamp_str = str(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 285

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 286

```text
                timestamp_str = "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 287

```text
            self.table.setItem(row_position, 2, QTableWidgetItem(timestamp_str))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 290

```text
            converted = record.get("converted_values", {}) if isinstance(record, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 293

```text
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 294

```text
            self.table.setItem(row_position, 3, QTableWidgetItem(str(num_conc.get("pm0_5", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 295

```text
            self.table.setItem(row_position, 4, QTableWidgetItem(str(num_conc.get("pm1", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 296

```text
            self.table.setItem(row_position, 5, QTableWidgetItem(str(num_conc.get("pm2_5", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 297

```text
            self.table.setItem(row_position, 6, QTableWidgetItem(str(num_conc.get("pm4", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 298

```text
            self.table.setItem(row_position, 7, QTableWidgetItem(str(num_conc.get("pm10", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 300

```text
    def _normalize_name(self, name):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 301

```text
        """Normalize a room name for matching: take first line, remove spaces, lowercase"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 302

```text
        first_line = name.split('\n')[0].strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 303

```text
        return first_line.replace(' ', '').lower()
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 305

```text
    def update_room_colors(self, data):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 306

```text
        """Update room frame colors based on particle data freshness and values.
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 308

```text
        Yellow = no matching sensor data or stale data (>30 min old)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 309

```text
        Green  = fresh data with all particle counts at 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 310

```text
        Red    = fresh data with any particle count > 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 311

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 313

```text
        for room_frame in self.room_frames.values():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 314

```text
            room_frame.set_color_state("yellow")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 317

```text
        if isinstance(data, dict) and "sensors" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 318

```text
            data_list = data["sensors"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 319

```text
        elif isinstance(data, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 320

```text
            data_list = data
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 321

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 322

```text
            data_list = [data]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 325

```text
        api_rooms = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 326

```text
        for record in data_list:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 327

```text
            if isinstance(record, dict):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 328

```text
                room_name = record.get("room_name", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 329

```text
                normalized = room_name.replace(' ', '').lower()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 330

```text
                api_rooms[normalized] = record
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 332

```text
        now = datetime.now(MOUNTAIN_TZ)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 334

```text
        for layout_name, room_frame in self.room_frames.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 335

```text
            normalized_layout = self._normalize_name(layout_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 337

```text
            if normalized_layout not in api_rooms:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 338

```text
                continue  # No matching sensor data – stays yellow
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 340

```text
            record = api_rooms[normalized_layout]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 343

```text
            timestamp = record.get("timestamp")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 344

```text
            if not timestamp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 345

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 347

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 348

```text
                if isinstance(timestamp, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 349

```text
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 350

```text
                    dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 351

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 352

```text
                    dt = datetime.fromtimestamp(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 353

```text
                    dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 354

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 355

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 358

```text
            age = now - dt_mountain
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 359

```text
            if age > timedelta(minutes=30):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 360

```text
                continue  # Stale data – stays yellow
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 363

```text
            converted = record.get("converted_values", {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 364

```text
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 366

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 367

```text
                pm0_5 = float(num_conc.get("pm0_5", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 368

```text
                pm1   = float(num_conc.get("pm1", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 369

```text
                pm4   = float(num_conc.get("pm4", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 370

```text
                pm10  = float(num_conc.get("pm10", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 371

```text
            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 372

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 374

```text
            if pm0_5 == 0 and pm1 == 0 and pm4 == 0 and pm10 == 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 375

```text
                room_frame.set_color_state("green")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 376

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 377

```text
                room_frame.set_color_state("red")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 379

```text
    def on_sensor_double_click(self, item):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 380

```text
        """Handle double-click on sensor table item"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 381

```text
        row = item.row()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 382

```text
        room_name_item = self.table.item(row, 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 383

```text
        sensor_number_item = self.table.item(row, 1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 385

```text
        if room_name_item and sensor_number_item:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 386

```text
            room_name = room_name_item.text()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 387

```text
            sensor_number = sensor_number_item.text()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 390

```text
            self.historical_window = HistoricalDataWindow(room_name, sensor_number, self.api_url)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 391

```text
            self.historical_window.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 394

```text
class HistoricalDataWindow(QMainWindow):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 395

```text
    def __init__(self, room_name, sensor_number, api_url):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 396

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 397

```text
        self.room_name = room_name
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 398

```text
        self.sensor_number = sensor_number
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 399

```text
        self.api_url = api_url
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 400

```text
        self.init_ui()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 401

```text
        self.load_historical_data()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 403

```text
    def init_ui(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 404

```text
        """Initialize the historical data window UI"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 405

```text
        self.setWindowTitle(f"Historical Data - {self.room_name}/{self.sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 406

```text
        self.setGeometry(150, 150, 1600, 900)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 409

```text
        central_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 410

```text
        self.setCentralWidget(central_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 413

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 414

```text
        central_widget.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 417

```text
        title_label = QLabel(f"Historical Data for {self.room_name} - {self.sensor_number}")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 418

```text
        title_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 419

```text
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; margin: 10px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 420

```text
        main_layout.addWidget(title_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 423

```text
        control_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 426

```text
        date_label = QLabel("Date Range:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 427

```text
        control_layout.addWidget(date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 429

```text
        start_date_label = QLabel("Start:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 430

```text
        control_layout.addWidget(start_date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 433

```text
        default_start_date = QDate.currentDate().addDays(-7)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 434

```text
        self.start_date_edit = QDateEdit(default_start_date)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 435

```text
        self.start_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 436

```text
        self.start_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 437

```text
        self.start_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 438

```text
        control_layout.addWidget(self.start_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 440

```text
        end_date_label = QLabel("End:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 441

```text
        control_layout.addWidget(end_date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 444

```text
        default_end_date = QDate.currentDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 445

```text
        self.end_date_edit = QDateEdit(default_end_date)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 446

```text
        self.end_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 447

```text
        self.end_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 448

```text
        self.end_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 449

```text
        control_layout.addWidget(self.end_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 452

```text
        control_layout.addWidget(QLabel("  "))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 455

```text
        export_selected_button = QPushButton("Export Selected Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 456

```text
        export_selected_button.clicked.connect(self.export_selected_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 457

```text
        export_selected_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 458

```text
        control_layout.addWidget(export_selected_button)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 460

```text
        export_all_button = QPushButton("Export All Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 461

```text
        export_all_button.clicked.connect(self.export_all_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 462

```text
        export_all_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 463

```text
        control_layout.addWidget(export_all_button)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 472

```text
        pm_label = QLabel("PM Sizes to Graph (ft³):")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 473

```text
        control_layout.addWidget(pm_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 476

```text
        checkbox_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 477

```text
        checkbox_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 478

```text
        checkbox_widget.setLayout(checkbox_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 481

```text
        self.pm_checkboxes = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 482

```text
        pm_sizes = [("PM0.5", "num_pm0_5_ft3", True),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 483

```text
                    ("PM1", "num_pm1_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 484

```text
                    ("PM2.5", "num_pm2_5_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 485

```text
                    ("PM4", "num_pm4_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 486

```text
                    ("PM10", "num_pm10_ft3", True)]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 488

```text
        for display_name, data_key, default_checked in pm_sizes:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 489

```text
            checkbox = QCheckBox(display_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 490

```text
            checkbox.setChecked(default_checked)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 491

```text
            checkbox.stateChanged.connect(self.update_graph)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 492

```text
            self.pm_checkboxes[data_key] = checkbox
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 493

```text
            checkbox_layout.addWidget(checkbox)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 495

```text
        control_layout.addWidget(checkbox_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 497

```text
        control_layout.addStretch()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 498

```text
        main_layout.addLayout(control_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 501

```text
        splitter = QSplitter(Qt.Horizontal)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 502

```text
        main_layout.addWidget(splitter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 505

```text
        table_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 506

```text
        table_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 507

```text
        table_widget.setLayout(table_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 509

```text
        table_label = QLabel("Historical Data Table")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 510

```text
        table_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 511

```text
        table_label.setStyleSheet("font-weight: bold; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 512

```text
        table_layout.addWidget(table_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 514

```text
        self.hist_table = QTableWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 517

```text
        self.hist_columns = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 518

```text
            "Timestamp", "ISO Timestamp",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
            "PM1 Mass", "PM2.5 Mass", "PM4 Mass", "PM10 Mass",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 520

```text
            "PM0.5 Count", "PM1 Count", "PM2.5 Count", "PM4 Count", "PM10 Count",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 521

```text
            "Particle Size (μm)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 522

```text
            "PM0.5 (ft³)", "PM1 (ft³)", "PM2.5 (ft³)", "PM4 (ft³)", "PM10 (ft³)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 523

```text
            "Bin 0.3-0.5", "Bin 0.5-1.0", "Bin 1.0-2.5", "Bin 2.5-4.0", "Bin 4.0-10",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 524

```text
            "PM1 (μg/m³)", "PM2.5 (μg/m³)", "PM4 (μg/m³)", "PM10 (μg/m³)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 525

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 527

```text
        self.hist_table.setColumnCount(len(self.hist_columns))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 528

```text
        self.hist_table.setHorizontalHeaderLabels(self.hist_columns)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 529

```text
        self.hist_table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 530

```text
        self.hist_table.horizontalHeader().setStretchLastSection(False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 531

```text
        self.hist_table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 532

```text
        self.hist_table.setAlternatingRowColors(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 533

```text
        self.hist_table.setSortingEnabled(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 535

```text
        table_layout.addWidget(self.hist_table)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 536

```text
        splitter.addWidget(table_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 539

```text
        graph_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 540

```text
        graph_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 541

```text
        graph_widget.setLayout(graph_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 543

```text
        graph_label = QLabel("Historical Data Graph")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 544

```text
        graph_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 545

```text
        graph_label.setStyleSheet("font-weight: bold; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 546

```text
        graph_layout.addWidget(graph_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 549

```text
        self.figure = Figure(figsize=(8, 6), dpi=80)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 550

```text
        self.canvas = FigureCanvas(self.figure)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 551

```text
        self.ax = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 554

```text
        self.toolbar = NavigationToolbar(self.canvas, graph_widget)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 555

```text
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 557

```text
        graph_layout.addWidget(self.toolbar)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 558

```text
        graph_layout.addWidget(self.canvas)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 560

```text
        splitter.addWidget(graph_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 563

```text
        splitter.setSizes([800, 800])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 566

```text
        self.historical_data = []  # All data from API
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 567

```text
        self.filtered_data = []    # Filtered data based on date range
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 569

```text
    def on_date_range_changed(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 570

```text
        """Handle date range changes"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 571

```text
        self.filter_data_by_date_range()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 572

```text
        self.populate_historical_table(self.filtered_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 573

```text
        self.update_graph()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 575

```text
    def filter_data_by_date_range(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 576

```text
        """Filter historical data based on selected date range"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 577

```text
        start_date = self.start_date_edit.date().toPyDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 578

```text
        end_date = self.end_date_edit.date().toPyDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 581

```text
        end_date = end_date + timedelta(days=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 583

```text
        self.filtered_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 585

```text
        for record in self.historical_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 587

```text
            record_datetime = self.extract_timestamp_from_record(record)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 589

```text
            if record_datetime:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 590

```text
                record_date = record_datetime.date()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 591

```text
                if start_date <= record_date < end_date:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 592

```text
                    self.filtered_data.append(record)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 594

```text
    def extract_timestamp_from_record(self, record):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 595

```text
        """Extract datetime object from a record"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 596

```text
        timestamp_value = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 599

```text
        if "timestamp_iso" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 600

```text
            timestamp_value = record["timestamp_iso"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 601

```text
        elif "timestamp" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 602

```text
            timestamp_value = record["timestamp"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 603

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 605

```text
            for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 606

```text
                if isinstance(value, str) and 'T' in value and ':' in value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 607

```text
                    timestamp_value = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 608

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 609

```text
                elif isinstance(key, str) and 'T' in key and ':' in key:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 610

```text
                    timestamp_value = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 611

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 614

```text
            if not timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 615

```text
                for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 616

```text
                    if isinstance(key, str) and key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 617

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 618

```text
                            timestamp_value = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 619

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 620

```text
                        except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 621

```text
                            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 622

```text
                    elif isinstance(value, (int, float, str)) and str(value).replace('.', '').isdigit() and len(str(value)) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 623

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 624

```text
                            timestamp_value = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 625

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 626

```text
                        except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 627

```text
                            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 629

```text
        if timestamp_value is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 630

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 631

```text
                if isinstance(timestamp_value, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 633

```text
                    if 'T' in timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 634

```text
                        return datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 635

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 637

```text
                        return datetime.fromtimestamp(float(timestamp_value))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 638

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 640

```text
                    return datetime.fromtimestamp(float(timestamp_value))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 641

```text
            except (ValueError, TypeError, OSError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 642

```text
                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 644

```text
        return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 646

```text
    def load_historical_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 647

```text
        """Load historical data from the API"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 648

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 650

```text
            url = f"{self.api_url}?room_name={self.room_name}&sensor_number={self.sensor_number}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 651

```text
            response = requests.get(url, verify=False, timeout=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 652

```text
            response.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 654

```text
            data = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 657

```text
            if data.get("status") == "success" and "historical_data" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 658

```text
                self.historical_data = data["historical_data"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 659

```text
            elif "historical_data" in data:  # Handle response without status field
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 660

```text
                self.historical_data = data["historical_data"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 661

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 662

```text
                QMessageBox.warning(self, "No Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 663

```text
                                   f"No historical data found for {self.room_name}/{self.sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 664

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 667

```text
            self.filter_data_by_date_range()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 668

```text
            self.populate_historical_table(self.filtered_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 669

```text
            self.update_graph()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 671

```text
        except requests.exceptions.ConnectionError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 672

```text
            QMessageBox.critical(self, "Connection Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 673

```text
                               "Could not connect to server. Make sure the server is running.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 674

```text
        except requests.exceptions.RequestException as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 675

```text
            QMessageBox.critical(self, "Request Error", f"Error fetching historical data: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 676

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 677

```text
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 679

```text
    def populate_historical_table(self, historical_data):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 680

```text
        """Populate the historical data table"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 681

```text
        self.hist_table.setRowCount(0)  # Clear existing data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 683

```text
        for record in historical_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 684

```text
            row_position = self.hist_table.rowCount()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 685

```text
            self.hist_table.insertRow(row_position)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 688

```text
            if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 690

```text
                columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 691

```text
                    record.get("timestamp", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 692

```text
                    record.get("timestamp_iso", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 693

```text
                    record.get("mass_pm1", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 694

```text
                    record.get("mass_pm2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 695

```text
                    record.get("mass_pm4", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 696

```text
                    record.get("mass_pm10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 697

```text
                    record.get("num_pm0_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 698

```text
                    record.get("num_pm1", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 699

```text
                    record.get("num_pm2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 700

```text
                    record.get("num_pm4", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 701

```text
                    record.get("num_pm10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 702

```text
                    record.get("typical_particle_size_um", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 703

```text
                    record.get("num_pm0_5_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 704

```text
                    record.get("num_pm1_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 705

```text
                    record.get("num_pm2_5_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 706

```text
                    record.get("num_pm4_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 707

```text
                    record.get("num_pm10_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 708

```text
                    record.get("bin_0_3_to_0_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 709

```text
                    record.get("bin_0_5_to_1_0", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 710

```text
                    record.get("bin_1_0_to_2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 711

```text
                    record.get("bin_2_5_to_4_0", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 712

```text
                    record.get("bin_4_0_to_10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 713

```text
                    record.get("mass_pm1_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 714

```text
                    record.get("mass_pm2_5_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 715

```text
                    record.get("mass_pm4_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 716

```text
                    record.get("mass_pm10_ug_m3", "N/A")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 717

```text
                ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 718

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 721

```text
                timestamp_unix = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 722

```text
                timestamp_iso = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 725

```text
                for key in record.keys():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 726

```text
                    if isinstance(key, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 728

```text
                        if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 729

```text
                            timestamp_iso = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 731

```text
                        elif key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 732

```text
                            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 734

```text
                                ts = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 735

```text
                                if ts > 1000000000:  # After 2001
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 736

```text
                                    timestamp_unix = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 737

```text
                            except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 738

```text
                                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 741

```text
                if not timestamp_unix and not timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 742

```text
                    for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 743

```text
                        if isinstance(value, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 744

```text
                            if 'T' in value and (':' in value or '-' in value) and len(value) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 745

```text
                                timestamp_iso = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 746

```text
                            elif value.replace('.', '').isdigit() and len(value) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 747

```text
                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 748

```text
                                    ts = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 749

```text
                                    if ts > 1000000000:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 750

```text
                                        timestamp_unix = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 751

```text
                                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 752

```text
                                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 754

```text
                columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 755

```text
                    timestamp_unix if timestamp_unix else "N/A",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 756

```text
                    timestamp_iso if timestamp_iso else "N/A"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 757

```text
                ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 761

```text
                particle_measurements = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 762

```text
                for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 763

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 765

```text
                        if key == timestamp_unix or key == timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 766

```text
                            continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 768

```text
                        if key in ['room_name', 'sensor_number']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 769

```text
                            continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 772

```text
                        if isinstance(key, str) and key.replace('.', '').isdigit():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 773

```text
                            size = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 774

```text
                            if 0.1 <= size <= 50.0:  # Reasonable particle size range in micrometers
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 775

```text
                                particle_measurements[size] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 776

```text
                    except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 777

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 780

```text
                sorted_measurements = sorted(particle_measurements.items())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 784

```text
                remaining_cols = len(self.hist_columns) - 2  # Subtract timestamp columns
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 785

```text
                for i in range(remaining_cols):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 786

```text
                    if i < len(sorted_measurements):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 787

```text
                        size, value = sorted_measurements[i]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 788

```text
                        columns_data.append(f"{size}μm: {value}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 789

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 790

```text
                        columns_data.append("N/A")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 793

```text
            for col, value in enumerate(columns_data):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 794

```text
                if col >= len(self.hist_columns):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 795

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 797

```text
                if value is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 798

```text
                    value = "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 799

```text
                elif isinstance(value, float):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 800

```text
                    value = f"{value:.6f}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 801

```text
                self.hist_table.setItem(row_position, col, QTableWidgetItem(str(value)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 804

```text
        if self.hist_table.rowCount() > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 805

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 806

```text
                self.hist_table.sortItems(0, Qt.DescendingOrder)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 807

```text
            except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 809

```text
                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 811

```text
    def update_graph(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 812

```text
        """Update the graph based on selected PM sizes"""
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 813

```text
        if not self.filtered_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 815

```text
            self.ax.clear()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 816

```text
            self.ax.set_title("No Data Available for Selected Date Range")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 817

```text
            self.ax.set_xlabel("Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 818

```text
            self.ax.set_ylabel("Particle Count (ft³)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 819

```text
            self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 820

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 823

```text
        checked_params = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 824

```text
        for data_key, checkbox in self.pm_checkboxes.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 825

```text
            if checkbox.isChecked():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 826

```text
                checked_params.append(data_key)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 828

```text
        if not checked_params:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 830

```text
            self.ax.clear()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 831

```text
            self.ax.set_title("No PM Sizes Selected")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 832

```text
            self.ax.set_xlabel("Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 833

```text
            self.ax.set_ylabel("Particle Count (ft³)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 834

```text
            self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 835

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 838

```text
        color_map = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 839

```text
            "num_pm0_5_ft3": 'blue',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 840

```text
            "num_pm1_ft3": 'red',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 841

```text
            "num_pm2_5_ft3": 'green',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 842

```text
            "num_pm4_ft3": 'orange',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 843

```text
            "num_pm10_ft3": 'purple'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 844

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 847

```text
        self.ax.clear()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 850

```text
        legend_labels = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 851

```text
        for data_key in checked_params:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 852

```text
            timestamps = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 853

```text
            values = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 855

```text
            for record in self.filtered_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 857

```text
                timestamp_value = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 860

```text
                if "timestamp_iso" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 861

```text
                    timestamp_value = record["timestamp_iso"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 862

```text
                elif "timestamp" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 863

```text
                    timestamp_value = record["timestamp"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 864

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 866

```text
                    for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 867

```text
                        if isinstance(value, str) and 'T' in value and ':' in value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 868

```text
                            timestamp_value = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 869

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 870

```text
                        elif isinstance(key, str) and 'T' in key and ':' in key:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 871

```text
                            timestamp_value = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 872

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 875

```text
                    if not timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 876

```text
                        for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 877

```text
                            if isinstance(key, str) and key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 878

```text
                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 879

```text
                                    timestamp_value = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 880

```text
                                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 881

```text
                                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 882

```text
                                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 883

```text
                            elif isinstance(value, (int, float, str)) and str(value).replace('.', '').isdigit() and len(str(value)) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 884

```text
                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 885

```text
                                    timestamp_value = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 886

```text
                                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 887

```text
                                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 888

```text
                                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 891

```text
                param_value = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 893

```text
                if data_key in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 894

```text
                    param_value = record[data_key]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 897

```text
                if timestamp_value is not None and param_value is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 898

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 899

```text
                        if isinstance(timestamp_value, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 901

```text
                            if 'T' in timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 902

```text
                                dt = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 903

```text
                            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 905

```text
                                dt = datetime.fromtimestamp(float(timestamp_value))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 906

```text
                        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 908

```text
                            dt = datetime.fromtimestamp(float(timestamp_value))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 911

```text
                        dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 912

```text
                        timestamps.append(dt_mountain)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 913

```text
                        values.append(float(param_value))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 914

```text
                    except (ValueError, TypeError, OSError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 915

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 918

```text
            if timestamps and values:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 920

```text
                sorted_data = sorted(zip(timestamps, values))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 921

```text
                timestamps, values = zip(*sorted_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 924

```text
                display_name = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 925

```text
                    "num_pm0_5_ft3": "PM0.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 926

```text
                    "num_pm1_ft3": "PM1",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 927

```text
                    "num_pm2_5_ft3": "PM2.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 928

```text
                    "num_pm4_ft3": "PM4",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 929

```text
                    "num_pm10_ft3": "PM10"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 930

```text
                }.get(data_key, data_key)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 933

```text
                color = color_map[data_key]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 934

```text
                self.ax.plot(timestamps, values, color=color, linewidth=2, marker='o',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 935

```text
                           markersize=3, label=display_name, alpha=0.8)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 936

```text
                legend_labels.append(display_name)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 939

```text
        self.ax.set_title("PM Particle Concentrations Over Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 940

```text
        self.ax.set_xlabel("Time (Mountain Time)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 941

```text
        self.ax.set_ylabel("Particle Count (ft³)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 942

```text
        self.ax.grid(True, alpha=0.3)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 945

```text
        if legend_labels:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 946

```text
            self.ax.legend(loc='upper right')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 949

```text
        self.figure.autofmt_xdate()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 952

```text
        self.figure.tight_layout()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 953

```text
        self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 955

```text
    def export_selected_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 956

```text
        """Export currently filtered/displayed data to CSV"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 957

```text
        if not self.filtered_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 958

```text
            QMessageBox.information(self, "No Data", "No data available to export.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 959

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 961

```text
        file_path, _ = QFileDialog.getSaveFileName(
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 962

```text
            self,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 963

```text
            "Export Selected Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 964

```text
            f"particle_data_{self.room_name}_{self.sensor_number}_selected.csv",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 965

```text
            "CSV Files (*.csv)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 966

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 968

```text
        if file_path:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 969

```text
            self._export_to_csv(self.filtered_data, file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 971

```text
    def export_all_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 972

```text
        """Export all historical data to CSV"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 973

```text
        if not self.historical_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 974

```text
            QMessageBox.information(self, "No Data", "No data available to export.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 975

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 977

```text
        file_path, _ = QFileDialog.getSaveFileName(
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 978

```text
            self,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 979

```text
            "Export All Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 980

```text
            f"particle_data_{self.room_name}_{self.sensor_number}_all.csv",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 981

```text
            "CSV Files (*.csv)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 982

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 984

```text
        if file_path:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 985

```text
            self._export_to_csv(self.historical_data, file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 987

```text
    def _export_to_csv(self, data, file_path):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 988

```text
        """Helper method to write data to CSV file"""
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 989

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 990

```text
            with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 991

```text
                writer = csv.writer(csvfile)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 994

```text
                writer.writerow(self.hist_columns)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 997

```text
                for record in data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 998

```text
                    row_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1001

```text
                    if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1003

```text
                        columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1004

```text
                            record.get("timestamp", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1005

```text
                            record.get("timestamp_iso", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1006

```text
                            record.get("mass_pm1", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1007

```text
                            record.get("mass_pm2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1008

```text
                            record.get("mass_pm4", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1009

```text
                            record.get("mass_pm10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1010

```text
                            record.get("num_pm0_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1011

```text
                            record.get("num_pm1", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1012

```text
                            record.get("num_pm2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1013

```text
                            record.get("num_pm4", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1014

```text
                            record.get("num_pm10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1015

```text
                            record.get("typical_particle_size_um", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1016

```text
                            record.get("num_pm0_5_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1017

```text
                            record.get("num_pm1_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1018

```text
                            record.get("num_pm2_5_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1019

```text
                            record.get("num_pm4_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1020

```text
                            record.get("num_pm10_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1021

```text
                            record.get("bin_0_3_to_0_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1022

```text
                            record.get("bin_0_5_to_1_0", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1023

```text
                            record.get("bin_1_0_to_2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1024

```text
                            record.get("bin_2_5_to_4_0", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1025

```text
                            record.get("bin_4_0_to_10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1026

```text
                            record.get("mass_pm1_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1027

```text
                            record.get("mass_pm2_5_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1028

```text
                            record.get("mass_pm4_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1029

```text
                            record.get("mass_pm10_ug_m3", "")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1030

```text
                        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1031

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1033

```text
                        timestamp_unix = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1034

```text
                        timestamp_iso = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1037

```text
                        for key in record.keys():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1038

```text
                            if isinstance(key, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1039

```text
                                if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1040

```text
                                    timestamp_iso = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1041

```text
                                elif key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1042

```text
                                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1043

```text
                                        ts = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1044

```text
                                        if ts > 1000000000:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1045

```text
                                            timestamp_unix = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1046

```text
                                    except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1047

```text
                                        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1049

```text
                        columns_data = [timestamp_unix or "", timestamp_iso or ""]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1052

```text
                        particle_measurements = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1053

```text
                        for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1054

```text
                            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1055

```text
                                if key == timestamp_unix or key == timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1056

```text
                                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1057

```text
                                if key in ['room_name', 'sensor_number']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1058

```text
                                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1059

```text
                                if isinstance(key, str) and key.replace('.', '').isdigit():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1060

```text
                                    size = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1061

```text
                                    if 0.1 <= size <= 50.0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1062

```text
                                        particle_measurements[size] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1063

```text
                            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1064

```text
                                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1066

```text
                        sorted_measurements = sorted(particle_measurements.items())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1067

```text
                        remaining_cols = len(self.hist_columns) - 2
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1068

```text
                        for i in range(remaining_cols):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1069

```text
                            if i < len(sorted_measurements):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1070

```text
                                size, value = sorted_measurements[i]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1071

```text
                                columns_data.append(f"{size}μm: {value}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1072

```text
                            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1073

```text
                                columns_data.append("")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1076

```text
                    clean_row = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1077

```text
                    for value in columns_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1078

```text
                        if value is None or value == "N/A":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1079

```text
                            clean_row.append("")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1080

```text
                        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1081

```text
                            clean_row.append(str(value))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1083

```text
                    writer.writerow(clean_row)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1085

```text
            QMessageBox.information(self, "Export Complete", f"Data exported successfully to:\n{file_path}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1087

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1088

```text
            QMessageBox.critical(self, "Export Error", f"Error exporting data to CSV:\n{str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1091

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1092

```text
    app = QApplication(sys.argv)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1093

```text
    viewer = ParticleDataViewer()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1094

```text
    viewer.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1095

```text
    sys.exit(app.exec_())
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1098

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1099

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/particle_data_viewer.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
