

# Source Reconstruction: NanofabToolkit/ParticleSensor/src/gui.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `NanofabToolkit`
- Relative path: `ParticleSensor/src/gui.py`
- Lines read: `1490`
- Dirty in working tree at generation time: `yes`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `7ad6ab7a0c43d923`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import sys`, `import warnings`, `import requests`, `import json`, `import csv`, `from datetime import datetime, timedelta`, `import pytz`, `import matplotlib.pyplot`, `from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg`, `from matplotlib.backends.backend_qt5agg import NavigationToolbar2QT`, `from matplotlib.figure import Figure`, `from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget, QTableWidgetItem, QFrame, QLabel, QMessageBox, QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog, QAbstractItemView, QScrollArea`, `from PyQt5.QtCore import Qt, QDate`, `from PyQt5.QtGui import QMouseEvent`, `from datetime import datetime`
- Classes: `RoomFrame`, `ParticleDataViewer`, `HistoricalDataWindow`, `ComparisonWindow`
- Functions: `convert_to_mountain`, `main`, `__init__`, `set_color_state`, `set_env_data`, `init_ui`, `refresh_data`, `populate_table`, `_normalize_name`, `update_room_colors`, `on_sensor_double_click`, `on_compare_selected`, `on_date_range_changed`, `filter_data_by_date_range`, `extract_timestamp_from_record`, `load_historical_data`, `populate_historical_table`, `_parse_record_timestamp`, `update_graph`, `export_selected_data`, `export_all_data`, `_export_to_csv`, `_filter_all`, `load_all_data`, `update_graphs`
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
                             QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog,
                             QAbstractItemView, QScrollArea)
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
    """Custom QFrame for room color management with env data sub-boxes"""
    _ENV_YELLOW = "background-color: #FFFF99; border: 0.5px solid #999; border-radius: 1px;"
    _ENV_HAS_DATA = "background-color: #A8D8A8; border: 0.5px solid #999; border-radius: 1px;"

    def __init__(self, parent, room_name, initial_color="#FFFFE0"):
        super().__init__()
        self.parent = parent
        self.room_name = room_name
        self.state = "yellow"
        self.colors = {
            "yellow": "#FFFFE0",
            "red": "#FF6B6B",
            "green": "#4ECDC4"
        }
        self.setFrameStyle(QFrame.Box)
        self.setStyleSheet(f"background-color: {initial_color}; border: 0.5px solid #666;")

        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(1, 1, 1, 1)
        main_layout.setSpacing(1)
        self.setLayout(main_layout)

        # Top env strip — temp (left) and humidity (right)
        env_strip = QWidget()
        env_strip.setStyleSheet("background: transparent; border: none;")
        env_layout = QHBoxLayout()
        env_layout.setContentsMargins(0, 0, 0, 0)
        env_layout.setSpacing(1)
        env_strip.setLayout(env_layout)

        _lbl_style = "font-size: 6px; color: #333; background: transparent; border: none; padding: 0px;"

        self.temp_frame = QFrame()
        self.temp_frame.setFrameStyle(QFrame.Box)
        self.temp_frame.setStyleSheet(self._ENV_YELLOW)
        temp_inner = QVBoxLayout()
        temp_inner.setContentsMargins(1, 0, 1, 0)
        temp_inner.setSpacing(0)
        temp_name = QLabel("Temp")
        temp_name.setAlignment(Qt.AlignCenter)
        temp_name.setStyleSheet(_lbl_style)
        self.temp_label = QLabel("--")
        self.temp_label.setAlignment(Qt.AlignCenter)
        self.temp_label.setStyleSheet(_lbl_style)
        temp_inner.addWidget(temp_name)
        temp_inner.addWidget(self.temp_label)
        self.temp_frame.setLayout(temp_inner)

        self.hum_frame = QFrame()
        self.hum_frame.setFrameStyle(QFrame.Box)
        self.hum_frame.setStyleSheet(self._ENV_YELLOW)
        hum_inner = QVBoxLayout()
        hum_inner.setContentsMargins(1, 0, 1, 0)
        hum_inner.setSpacing(0)
        hum_name = QLabel("Humidity")
        hum_name.setAlignment(Qt.AlignCenter)
        hum_name.setStyleSheet(_lbl_style)
        self.hum_label = QLabel("--")
        self.hum_label.setAlignment(Qt.AlignCenter)
        self.hum_label.setStyleSheet(_lbl_style)
        hum_inner.addWidget(hum_name)
        hum_inner.addWidget(self.hum_label)
        self.hum_frame.setLayout(hum_inner)

        env_layout.addWidget(self.temp_frame, 1)
        env_layout.addWidget(self.hum_frame, 1)

        # Room name label
        room_label = QLabel(room_name)
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

        # env strip = 1 part, label = 4 parts  → 20% / 80%
        main_layout.addWidget(env_strip, 1)
        main_layout.addWidget(room_label, 4)

    def set_color_state(self, state):
        """Set the color state programmatically"""
        if state in self.colors:
            self.state = state
            new_color = self.colors[self.state]
            self.setStyleSheet(f"background-color: {new_color}; border: 0.5px solid #666;")

    def set_env_data(self, temperature_c, humidity_pct):
        """Update the temperature and humidity sub-boxes"""
        if temperature_c is not None:
            try:
                self.temp_label.setText(f"{float(temperature_c):.1f}°C")
                self.temp_frame.setStyleSheet(self._ENV_HAS_DATA)
            except (ValueError, TypeError):
                self.temp_label.setText("--")
                self.temp_frame.setStyleSheet(self._ENV_YELLOW)
        else:
            self.temp_label.setText("--")
            self.temp_frame.setStyleSheet(self._ENV_YELLOW)

        if humidity_pct is not None:
            try:
                self.hum_label.setText(f"{float(humidity_pct):.1f}%")
                self.hum_frame.setStyleSheet(self._ENV_HAS_DATA)
            except (ValueError, TypeError):
                self.hum_label.setText("--")
                self.hum_frame.setStyleSheet(self._ENV_YELLOW)
        else:
            self.hum_label.setText("--")
            self.hum_frame.setStyleSheet(self._ENV_YELLOW)


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
            self.room_frames[room['name']] = room_frame
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

        # Information label about double-click and multi-select compare
        info_label = QLabel("💡 Double-click a row for one sensor's history; Ctrl/Shift+click to select multiple, then Compare")
        info_label.setAlignment(Qt.AlignCenter)
        info_label.setStyleSheet("color: #666; font-style: italic; margin: 5px; font-size: 12px;")
        info_label.setWordWrap(True)
        right_layout.addWidget(info_label)

        # Compare Selected button — opens a multi-sensor comparison window
        self.compare_button = QPushButton("Compare Selected")
        self.compare_button.clicked.connect(self.on_compare_selected)
        self.compare_button.setMaximumWidth(180)
        right_layout.addWidget(self.compare_button, alignment=Qt.AlignCenter)

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
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.ExtendedSelection)
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
            room_frame.set_env_data(None, None)

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

            room_frame.set_env_data(record.get('temperature_c'), record.get('humidity_pct'))

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

    def on_compare_selected(self):
        """Open a comparison window for all currently selected sensor rows."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.information(
                self, "No Selection",
                "Select one or more sensor rows (Ctrl/Shift+click) before comparing."
            )
            return

        sensors = []
        seen = set()
        for index in sorted(selected_rows, key=lambda x: x.row()):
            row = index.row()
            room_item = self.table.item(row, 0)
            sensor_item = self.table.item(row, 1)
            if not (room_item and sensor_item):
                continue
            key = (room_item.text(), sensor_item.text())
            if key in seen:
                continue
            seen.add(key)
            sensors.append(key)

        if not sensors:
            return

        self.comparison_window = ComparisonWindow(sensors, self.api_url)
        self.comparison_window.show()


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

        # Graph checkboxes — PM sizes + environment
        pm_label = QLabel("Graph:")
        control_layout.addWidget(pm_label)

        checkbox_widget = QWidget()
        checkbox_layout = QHBoxLayout()
        checkbox_layout.setContentsMargins(0, 0, 0, 0)
        checkbox_widget.setLayout(checkbox_layout)

        self.pm_checkboxes = {}
        graph_options = [
            ("PM0.5", "num_pm0_5_ft3", True),
            ("PM1",   "num_pm1_ft3",   True),
            ("PM2.5", "num_pm2_5_ft3", True),
            ("PM4",   "num_pm4_ft3",   True),
            ("PM10",  "num_pm10_ft3",  True),
            ("Temp °C",    "temperature_c", False),
            ("Humidity %", "humidity_pct",  False),
        ]

        for display_name, data_key, default_checked in graph_options:
            checkbox = QCheckBox(display_name)
            checkbox.setChecked(default_checked)
            checkbox.stateChanged.connect(self.update_graph)
            self.pm_checkboxes[data_key] = checkbox
            checkbox_layout.addWidget(checkbox)

        control_layout.addWidget(checkbox_widget)

        control_layout.addStretch()
        main_layout.addLayout(control_layout, 0)  # Fixed size - don't expand

        # Create horizontal splitter for table and graph
        splitter = QSplitter(Qt.Horizontal)
        main_layout.addWidget(splitter, 1)  # Expandable - takes all extra space

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
            "Temp (°C)", "Humidity (%)",
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
        graph_layout.addWidget(graph_label, 0)  # Fixed size

        # Create matplotlib figure and canvas
        self.figure = Figure(figsize=(8, 6), dpi=80)
        self.canvas = FigureCanvas(self.figure)
        self.ax = self.figure.add_subplot(111)

        # Add navigation toolbar for zoom, pan, and reset functionality
        self.toolbar = NavigationToolbar(self.canvas, graph_widget)
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")

        graph_layout.addWidget(self.toolbar, 0)  # Fixed size
        graph_layout.addWidget(self.canvas, 1)   # Expandable - takes all extra space

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
        """Load historical data from the API, merging env data when available"""
        try:
            # Fetch particle data
            url = f"{self.api_url}?room_name={self.room_name}&sensor_number={self.sensor_number}"
            response = requests.get(url, verify=False, timeout=10)
            response.raise_for_status()

            data = response.json()

            if data.get("status") == "success" and "historical_data" in data:
                self.historical_data = data["historical_data"]
            elif "historical_data" in data:
                self.historical_data = data["historical_data"]
            else:
                QMessageBox.warning(self, "No Data",
                                    f"No historical data found for {self.room_name}/{self.sensor_number}")
                return

            # Try to fetch env (temperature/humidity) data and merge by timestamp
            try:
                base_url = self.api_url.rsplit('/', 1)[0]
                env_url = f"{base_url}/env-data?room_name={self.room_name}&sensor_number={self.sensor_number}"
                env_resp = requests.get(env_url, verify=False, timeout=10)
                if env_resp.status_code == 200:
                    env_json = env_resp.json()
                    if env_json.get('status') == 'success' and 'data' in env_json:
                        env_lookup = {}
                        for row in env_json['data']:
                            ts = row.get('timestamp_iso', '')
                            if ts:
                                env_lookup[ts] = row
                        for record in self.historical_data:
                            ts = record.get('timestamp_iso', '')
                            if ts in env_lookup:
                                record['temperature_c'] = env_lookup[ts].get('temperature_c', '')
                                record['humidity_pct'] = env_lookup[ts].get('humidity_pct', '')
            except Exception:
                pass  # Env data is optional — not all sensors have it

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
                    record.get("temperature_c", "N/A"),
                    record.get("humidity_pct", "N/A"),
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

    def _parse_record_timestamp(self, record):
        """Return a Mountain Time datetime from a record, or None."""
        ts = record.get("timestamp_iso") or record.get("timestamp")
        if ts is None:
            return None
        try:
            if isinstance(ts, str):
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00')) if 'T' in ts \
                     else datetime.fromtimestamp(float(ts))
            else:
                dt = datetime.fromtimestamp(float(ts))
            return convert_to_mountain(dt)
        except (ValueError, TypeError, OSError):
            return None

    def update_graph(self):
        """Update the graph based on selected parameters."""
        self.figure.clear()

        if not self.filtered_data:
            ax = self.figure.add_subplot(111)
            ax.set_title("No Data Available for Selected Date Range")
            ax.set_xlabel("Time")
            ax.set_ylabel("Particle Count (ft³)")
            self.canvas.draw()
            return

        checked_params = [k for k, cb in self.pm_checkboxes.items() if cb.isChecked()]

        if not checked_params:
            ax = self.figure.add_subplot(111)
            ax.set_title("No Parameters Selected")
            ax.set_xlabel("Time")
            self.canvas.draw()
            return

        env_keys = {"temperature_c", "humidity_pct"}
        pm_params  = [k for k in checked_params if k not in env_keys]
        env_params = [k for k in checked_params if k in env_keys]

        # Use one axis if only PM or only env selected; two axes if both
        use_twin = bool(pm_params and env_params)
        ax1 = self.figure.add_subplot(111)
        ax2 = ax1.twinx() if use_twin else None

        color_map = {
            "num_pm0_5_ft3": "blue",
            "num_pm1_ft3":   "red",
            "num_pm2_5_ft3": "green",
            "num_pm4_ft3":   "orange",
            "num_pm10_ft3":  "purple",
            "temperature_c": "firebrick",
            "humidity_pct":  "steelblue",
        }
        display_names = {
            "num_pm0_5_ft3": "PM0.5",
            "num_pm1_ft3":   "PM1",
            "num_pm2_5_ft3": "PM2.5",
            "num_pm4_ft3":   "PM4",
            "num_pm10_ft3":  "PM10",
            "temperature_c": "Temp (°C)",
            "humidity_pct":  "Humidity (%)",
        }

        all_lines, all_labels = [], []

        for data_key in checked_params:
            ax = ax2 if (ax2 is not None and data_key in env_keys) else ax1
            timestamps, values = [], []

            for record in self.filtered_data:
                dt = self._parse_record_timestamp(record)
                raw_val = record.get(data_key)
                if dt is None or raw_val in (None, '', 'N/A'):
                    continue
                try:
                    timestamps.append(dt)
                    values.append(float(raw_val))
                except (ValueError, TypeError):
                    continue

            if timestamps and values:
                pts = sorted(zip(timestamps, values))
                ts_sorted, v_sorted = zip(*pts)
                line, = ax.plot(ts_sorted, v_sorted,
                                color=color_map.get(data_key, 'black'),
                                linewidth=2, marker='o', markersize=3,
                                label=display_names.get(data_key, data_key),
                                alpha=0.8)
                all_lines.append(line)
                all_labels.append(display_names.get(data_key, data_key))

        ax1.set_title("Sensor Data Over Time")
        ax1.set_xlabel("Time (Mountain Time)")
        ax1.set_ylabel("Particle Count (ft³)" if pm_params else
                        ("Temp (°C) / Humidity (%)" if not use_twin else ""))
        ax1.grid(True, alpha=0.3)

        if ax2 is not None:
            ax2.set_ylabel("Temp (°C) / Humidity (%)")

        if all_lines:
            ax1.legend(all_lines, all_labels, loc='upper right')

        self.figure.autofmt_xdate()
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
                            record.get("temperature_c", ""),
                            record.get("humidity_pct", ""),
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


class ComparisonWindow(QMainWindow):
    """Side-by-side comparison of historical data from multiple sensors.

    Shows one stacked subplot per sensor, sharing the time axis so trends
    line up vertically. Y-axis can optionally be shared across sensors for
    direct magnitude comparison.
    """

    def __init__(self, sensors, api_url):
        super().__init__()
        self.sensors = sensors  # list of (room_name, sensor_number) tuples
        self.api_url = api_url
        self.sensor_data = {s: [] for s in sensors}
        self.filtered_data = {s: [] for s in sensors}
        self.init_ui()
        self.load_all_data()

    def init_ui(self):
        n = len(self.sensors)
        self.setWindowTitle(f"Sensor Comparison ({n} sensor{'s' if n != 1 else ''})")
        self.setGeometry(180, 180, 1300, 850)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)

        # Title with the list of sensors being compared
        names = ", ".join(f"{r}/{s}" for r, s in self.sensors)
        title_label = QLabel(f"Comparing: {names}")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("font-size: 14px; font-weight: bold; margin: 8px;")
        title_label.setWordWrap(True)
        main_layout.addWidget(title_label)

        # Control panel: date range + metric checkboxes + axis options
        control_layout = QHBoxLayout()

        control_layout.addWidget(QLabel("Date Range:"))
        control_layout.addWidget(QLabel("Start:"))

        default_start = QDate.currentDate().addDays(-7)
        self.start_date_edit = QDateEdit(default_start)
        self.start_date_edit.setCalendarPopup(True)
        self.start_date_edit.setMaximumWidth(120)
        self.start_date_edit.dateChanged.connect(self.on_date_range_changed)
        control_layout.addWidget(self.start_date_edit)

        control_layout.addWidget(QLabel("End:"))
        self.end_date_edit = QDateEdit(QDate.currentDate())
        self.end_date_edit.setCalendarPopup(True)
        self.end_date_edit.setMaximumWidth(120)
        self.end_date_edit.dateChanged.connect(self.on_date_range_changed)
        control_layout.addWidget(self.end_date_edit)

        control_layout.addWidget(QLabel("  "))
        control_layout.addWidget(QLabel("Graph:"))

        self.pm_checkboxes = {}
        graph_options = [
            ("PM0.5", "num_pm0_5_ft3", True),
            ("PM1",   "num_pm1_ft3",   True),
            ("PM2.5", "num_pm2_5_ft3", True),
            ("PM4",   "num_pm4_ft3",   True),
            ("PM10",  "num_pm10_ft3",  True),
            ("Temp °C",    "temperature_c", False),
            ("Humidity %", "humidity_pct",  False),
        ]
        for display_name, data_key, default_checked in graph_options:
            cb = QCheckBox(display_name)
            cb.setChecked(default_checked)
            cb.stateChanged.connect(self.update_graphs)
            self.pm_checkboxes[data_key] = cb
            control_layout.addWidget(cb)

        control_layout.addWidget(QLabel("  "))
        # Sharing the y-axis lets you compare absolute magnitudes between rooms;
        # leaving it independent prevents a noisy room from squashing a clean one to zero.
        self.shared_y_checkbox = QCheckBox("Shared Y-axis")
        self.shared_y_checkbox.setChecked(False)
        self.shared_y_checkbox.stateChanged.connect(self.update_graphs)
        control_layout.addWidget(self.shared_y_checkbox)

        control_layout.addStretch()
        main_layout.addLayout(control_layout, 0)

        # Figure goes inside a QScrollArea so many sensors stay legible
        self.figure = Figure(figsize=(10, 4), dpi=80)
        self.canvas = FigureCanvas(self.figure)
        self.toolbar = NavigationToolbar(self.canvas, central_widget)
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")

        scroll = QScrollArea()
        scroll.setWidget(self.canvas)
        scroll.setWidgetResizable(True)

        main_layout.addWidget(self.toolbar, 0)
        main_layout.addWidget(scroll, 1)

    def on_date_range_changed(self):
        self._filter_all()
        self.update_graphs()

    def _filter_all(self):
        """Re-filter every sensor's records against the current date range."""
        start_date = self.start_date_edit.date().toPyDate()
        end_date = self.end_date_edit.date().toPyDate() + timedelta(days=1)

        for sensor_key, records in self.sensor_data.items():
            filtered = []
            for rec in records:
                dt = self._parse_record_timestamp(rec)
                if dt is not None and start_date <= dt.date() < end_date:
                    filtered.append(rec)
            self.filtered_data[sensor_key] = filtered

    def _parse_record_timestamp(self, record):
        """Return a Mountain Time datetime from a record, or None."""
        ts = record.get("timestamp_iso") or record.get("timestamp")
        if ts is None:
            return None
        try:
            if isinstance(ts, str):
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00')) if 'T' in ts \
                     else datetime.fromtimestamp(float(ts))
            else:
                dt = datetime.fromtimestamp(float(ts))
            return convert_to_mountain(dt)
        except (ValueError, TypeError, OSError):
            return None

    def load_all_data(self):
        """Fetch historical (and optional env) data for every selected sensor."""
        failed = []
        for sensor_key in self.sensors:
            room_name, sensor_number = sensor_key
            try:
                url = f"{self.api_url}?room_name={room_name}&sensor_number={sensor_number}"
                resp = requests.get(url, verify=False, timeout=10)
                resp.raise_for_status()
                data = resp.json()
                if "historical_data" in data:
                    self.sensor_data[sensor_key] = data["historical_data"]

                # Env data is optional — not all sensors have it, fail silently
                try:
                    base_url = self.api_url.rsplit('/', 1)[0]
                    env_url = f"{base_url}/env-data?room_name={room_name}&sensor_number={sensor_number}"
                    env_resp = requests.get(env_url, verify=False, timeout=10)
                    if env_resp.status_code == 200:
                        env_json = env_resp.json()
                        if env_json.get('status') == 'success' and 'data' in env_json:
                            env_lookup = {row.get('timestamp_iso', ''): row
                                          for row in env_json['data']
                                          if row.get('timestamp_iso')}
                            for record in self.sensor_data[sensor_key]:
                                ts = record.get('timestamp_iso', '')
                                if ts in env_lookup:
                                    record['temperature_c'] = env_lookup[ts].get('temperature_c', '')
                                    record['humidity_pct'] = env_lookup[ts].get('humidity_pct', '')
                except Exception:
                    pass
            except Exception as e:
                failed.append(f"{room_name}/{sensor_number}: {e}")

        if failed:
            QMessageBox.warning(
                self, "Some Data Failed to Load",
                "Failed to load data for:\n\n" + "\n".join(failed)
            )

        self._filter_all()
        self.update_graphs()

    def update_graphs(self):
        """Redraw the stacked subplots based on selected metrics and date range."""
        self.figure.clear()

        checked = [k for k, cb in self.pm_checkboxes.items() if cb.isChecked()]

        if not checked:
            ax = self.figure.add_subplot(111)
            ax.set_title("No Parameters Selected")
            self.canvas.draw()
            return

        n = len(self.sensors)

        # Resize the figure so each sensor's subplot has enough vertical room
        height_per_sensor = 3.0
        total_h = max(4.0, height_per_sensor * n)
        self.figure.set_size_inches(10.0, total_h)

        sharey = self.shared_y_checkbox.isChecked()

        if n == 1:
            axes = [self.figure.add_subplot(111)]
        else:
            ax_array = self.figure.subplots(n, 1, sharex=True, sharey=sharey)
            axes = list(ax_array)

        color_map = {
            "num_pm0_5_ft3": "blue",
            "num_pm1_ft3":   "red",
            "num_pm2_5_ft3": "green",
            "num_pm4_ft3":   "orange",
            "num_pm10_ft3":  "purple",
            "temperature_c": "firebrick",
            "humidity_pct":  "steelblue",
        }
        display_names = {
            "num_pm0_5_ft3": "PM0.5",
            "num_pm1_ft3":   "PM1",
            "num_pm2_5_ft3": "PM2.5",
            "num_pm4_ft3":   "PM4",
            "num_pm10_ft3":  "PM10",
            "temperature_c": "Temp (°C)",
            "humidity_pct":  "Humidity (%)",
        }
        env_keys = {"temperature_c", "humidity_pct"}
        pm_params = [k for k in checked if k not in env_keys]
        env_params = [k for k in checked if k in env_keys]
        use_twin = bool(pm_params and env_params)

        for i, sensor_key in enumerate(self.sensors):
            room_name, sensor_number = sensor_key
            ax1 = axes[i]
            records = self.filtered_data.get(sensor_key, [])

            ax2 = ax1.twinx() if use_twin else None
            all_lines, all_labels = [], []

            for data_key in checked:
                target_ax = ax2 if (ax2 is not None and data_key in env_keys) else ax1
                timestamps, values = [], []
                for record in records:
                    dt = self._parse_record_timestamp(record)
                    raw = record.get(data_key)
                    if dt is None or raw in (None, '', 'N/A'):
                        continue
                    try:
                        timestamps.append(dt)
                        values.append(float(raw))
                    except (ValueError, TypeError):
                        continue

                if timestamps and values:
                    pts = sorted(zip(timestamps, values))
                    ts_s, v_s = zip(*pts)
                    line, = target_ax.plot(
                        ts_s, v_s,
                        color=color_map.get(data_key, 'black'),
                        linewidth=1.5, marker='o', markersize=2,
                        label=display_names.get(data_key, data_key),
                        alpha=0.85,
                    )
                    all_lines.append(line)
                    all_labels.append(display_names.get(data_key, data_key))

            ax1.set_title(f"{room_name} / {sensor_number}", fontsize=10, fontweight='bold')
            ax1.grid(True, alpha=0.3)
            ax1.set_ylabel("Count (ft³)" if pm_params else "Temp / Humidity")
            if ax2 is not None:
                ax2.set_ylabel("Temp (°C) / Hum (%)")
            if all_lines:
                ax1.legend(all_lines, all_labels, loc='upper right', fontsize=8)

            if not records:
                ax1.text(
                    0.5, 0.5, "No data in selected range",
                    transform=ax1.transAxes, ha='center', va='center',
                    fontsize=11, color='gray', style='italic',
                )

        if axes:
            axes[-1].set_xlabel("Time (Mountain Time)")

        self.figure.autofmt_xdate()
        self.figure.tight_layout()

        # Match canvas pixel height to the figure size so the QScrollArea
        # gives us scrollbars when the stack of subplots exceeds the viewport.
        dpi = self.figure.get_dpi()
        self.canvas.setMinimumHeight(int(total_h * dpi))
        self.canvas.draw()


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
                             QHeaderView, QComboBox, QSplitter, QCheckBox, QGridLayout, QDateEdit, QFileDialog,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 22

```text
                             QAbstractItemView, QScrollArea)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 23

```text
from PyQt5.QtCore import Qt, QDate
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 24

```text
from PyQt5.QtGui import QMouseEvent
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 27

```text
warnings.filterwarnings('ignore', message='Unverified HTTPS request')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 30

```text
MOUNTAIN_TZ = pytz.timezone('US/Mountain')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 32

```text
def convert_to_mountain(dt):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 33

```text
    """Convert datetime to Mountain Time, adding offset to fix API time discrepancy"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 35

```text
    corrected_dt = dt + timedelta(hours=7)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 37

```text
    if corrected_dt.tzinfo is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 39

```text
        return MOUNTAIN_TZ.localize(corrected_dt)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 40

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 42

```text
        return corrected_dt.astimezone(MOUNTAIN_TZ)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 45

```text
class RoomFrame(QFrame):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 46

```text
    """Custom QFrame for room color management with env data sub-boxes"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 47

```text
    _ENV_YELLOW = "background-color: #FFFF99; border: 0.5px solid #999; border-radius: 1px;"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 48

```text
    _ENV_HAS_DATA = "background-color: #A8D8A8; border: 0.5px solid #999; border-radius: 1px;"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 50

```text
    def __init__(self, parent, room_name, initial_color="#FFFFE0"):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 51

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 52

```text
        self.parent = parent
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 53

```text
        self.room_name = room_name
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 54

```text
        self.state = "yellow"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 55

```text
        self.colors = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 56

```text
            "yellow": "#FFFFE0",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 57

```text
            "red": "#FF6B6B",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 58

```text
            "green": "#4ECDC4"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 59

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 60

```text
        self.setFrameStyle(QFrame.Box)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 61

```text
        self.setStyleSheet(f"background-color: {initial_color}; border: 0.5px solid #666;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 63

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 64

```text
        main_layout.setContentsMargins(1, 1, 1, 1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 65

```text
        main_layout.setSpacing(1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 66

```text
        self.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
        env_strip = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 70

```text
        env_strip.setStyleSheet("background: transparent; border: none;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 71

```text
        env_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 72

```text
        env_layout.setContentsMargins(0, 0, 0, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 73

```text
        env_layout.setSpacing(1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 74

```text
        env_strip.setLayout(env_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 76

```text
        _lbl_style = "font-size: 6px; color: #333; background: transparent; border: none; padding: 0px;"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 78

```text
        self.temp_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 79

```text
        self.temp_frame.setFrameStyle(QFrame.Box)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 80

```text
        self.temp_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 81

```text
        temp_inner = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 82

```text
        temp_inner.setContentsMargins(1, 0, 1, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 83

```text
        temp_inner.setSpacing(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 84

```text
        temp_name = QLabel("Temp")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 85

```text
        temp_name.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 86

```text
        temp_name.setStyleSheet(_lbl_style)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 87

```text
        self.temp_label = QLabel("--")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 88

```text
        self.temp_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 89

```text
        self.temp_label.setStyleSheet(_lbl_style)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 90

```text
        temp_inner.addWidget(temp_name)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 91

```text
        temp_inner.addWidget(self.temp_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 92

```text
        self.temp_frame.setLayout(temp_inner)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 94

```text
        self.hum_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 95

```text
        self.hum_frame.setFrameStyle(QFrame.Box)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 96

```text
        self.hum_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 97

```text
        hum_inner = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 98

```text
        hum_inner.setContentsMargins(1, 0, 1, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 99

```text
        hum_inner.setSpacing(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 100

```text
        hum_name = QLabel("Humidity")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 101

```text
        hum_name.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 102

```text
        hum_name.setStyleSheet(_lbl_style)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 103

```text
        self.hum_label = QLabel("--")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 104

```text
        self.hum_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 105

```text
        self.hum_label.setStyleSheet(_lbl_style)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 106

```text
        hum_inner.addWidget(hum_name)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 107

```text
        hum_inner.addWidget(self.hum_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 108

```text
        self.hum_frame.setLayout(hum_inner)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 110

```text
        env_layout.addWidget(self.temp_frame, 1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 111

```text
        env_layout.addWidget(self.hum_frame, 1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 114

```text
        room_label = QLabel(room_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 115

```text
        room_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 116

```text
        room_label.setStyleSheet("""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 117

```text
            font-size: 8px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 118

```text
            font-weight: bold;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 119

```text
            padding: 2px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 120

```text
            color: white;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 121

```text
            background-color: rgba(0, 0, 0, 180);
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 122

```text
            border-radius: 3px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 123

```text
            margin: 2px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 124

```text
        """)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 127

```text
        main_layout.addWidget(env_strip, 1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 128

```text
        main_layout.addWidget(room_label, 4)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 130

```text
    def set_color_state(self, state):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 131

```text
        """Set the color state programmatically"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 132

```text
        if state in self.colors:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 133

```text
            self.state = state
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 134

```text
            new_color = self.colors[self.state]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 135

```text
            self.setStyleSheet(f"background-color: {new_color}; border: 0.5px solid #666;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 137

```text
    def set_env_data(self, temperature_c, humidity_pct):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 138

```text
        """Update the temperature and humidity sub-boxes"""
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 139

```text
        if temperature_c is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 140

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 141

```text
                self.temp_label.setText(f"{float(temperature_c):.1f}°C")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 142

```text
                self.temp_frame.setStyleSheet(self._ENV_HAS_DATA)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 143

```text
            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 144

```text
                self.temp_label.setText("--")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 145

```text
                self.temp_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 146

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 147

```text
            self.temp_label.setText("--")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 148

```text
            self.temp_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 150

```text
        if humidity_pct is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 151

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 152

```text
                self.hum_label.setText(f"{float(humidity_pct):.1f}%")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 153

```text
                self.hum_frame.setStyleSheet(self._ENV_HAS_DATA)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 154

```text
            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 155

```text
                self.hum_label.setText("--")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 156

```text
                self.hum_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 157

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 158

```text
            self.hum_label.setText("--")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 159

```text
            self.hum_frame.setStyleSheet(self._ENV_YELLOW)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 162

```text
class ParticleDataViewer(QMainWindow):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 163

```text
    def __init__(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 164

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 165

```text
        self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 166

```text
        self.room_frames = {}  # Track room frames for state management
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 167

```text
        self.init_ui()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 169

```text
    def init_ui(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 170

```text
        """Initialize the user interface"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 171

```text
        self.setWindowTitle("Particle Data Viewer")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 172

```text
        self.setGeometry(100, 100, 1200, 700)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 175

```text
        central_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 176

```text
        self.setCentralWidget(central_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 179

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 180

```text
        central_widget.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 183

```text
        self.refresh_button = QPushButton("Refresh")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 184

```text
        self.refresh_button.clicked.connect(self.refresh_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 185

```text
        self.refresh_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 186

```text
        main_layout.addWidget(self.refresh_button, alignment=Qt.AlignCenter)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 189

```text
        content_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 190

```text
        main_layout.addLayout(content_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 193

```text
        left_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 194

```text
        left_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 195

```text
        left_frame.setLineWidth(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 196

```text
        left_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 197

```text
        left_frame.setLayout(left_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
        map_title = QLabel("Cleanroom Layout")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 201

```text
        map_title.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 202

```text
        map_title.setStyleSheet("font-weight: bold; font-size: 14px; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 203

```text
        left_layout.addWidget(map_title)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
        room_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 207

```text
        room_layout = QGridLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 208

```text
        room_widget.setLayout(room_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 211

```text
        rooms = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 213

```text
            {"name": "Gas/Chem\nStorage", "row": 0, "col": 1, "rowspan": 1, "colspan": 2, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 214

```text
            {"name": "Chase", "row": 0, "col": 3, "rowspan": 1, "colspan": 6, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 217

```text
            {"name": "Lab C\n2010N", "row": 1, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 220

```text
            {"name": "Bay A\n2025N", "row": 2, "col": 1, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 221

```text
            {"name": "Bay B\n2022N", "row": 2, "col": 2, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 222

```text
            {"name": "Bay C\n2020N", "row": 2, "col": 3, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 223

```text
            {"name": "Bay D\n2018N", "row": 2, "col": 4, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 224

```text
            {"name": "Bay E\n2016N", "row": 2, "col": 5, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 225

```text
            {"name": "Bay F\n2014N", "row": 2, "col": 6, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 226

```text
            {"name": "Bay G\n2012N", "row": 2, "col": 7, "rowspan": 2, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 229

```text
            {"name": "Lab B\n2008N", "row": 2, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 230

```text
            {"name": "Lab A\n2006N", "row": 3, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 233

```text
            {"name": "Bay M\nMetrology\n2026N", "row": 4, "col": 1, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 234

```text
            {"name": "Clean Conf\n2002N", "row": 4, "col": 2, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 235

```text
            {"name": "Hallway", "row": 4, "col": 3, "rowspan": 1, "colspan": 5, "color": "#FFFFE0"},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 236

```text
            {"name": "Gowning\nRoom\n2221", "row": 4, "col": 8, "rowspan": 1, "colspan": 1, "color": "#FFFFE0"}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 237

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 240

```text
        for room in rooms:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 241

```text
            room_frame = RoomFrame(self, room['name'], room['color'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 242

```text
            self.room_frames[room['name']] = room_frame
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 243

```text
            room_frame.setMinimumSize(40, 30)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 244

```text
            room_layout.addWidget(room_frame, room['row'], room['col'],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 245

```text
                                  room['rowspan'], room['colspan'])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 248

```text
        room_layout.setSpacing(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 249

```text
        room_layout.setContentsMargins(5, 5, 5, 5)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 251

```text
        left_layout.addWidget(room_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 252

```text
        content_layout.addWidget(left_frame, 1)  # stretch factor of 1
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 255

```text
        right_frame = QFrame()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 256

```text
        right_frame.setFrameStyle(QFrame.Box | QFrame.Raised)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 257

```text
        right_frame.setLineWidth(2)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 258

```text
        right_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 259

```text
        right_frame.setLayout(right_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 261

```text
        right_label = QLabel("Particle Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 262

```text
        right_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 263

```text
        right_layout.addWidget(right_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 266

```text
        info_label = QLabel("💡 Double-click a row for one sensor's history; Ctrl/Shift+click to select multiple, then Compare")
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 267

```text
        info_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 268

```text
        info_label.setStyleSheet("color: #666; font-style: italic; margin: 5px; font-size: 12px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 269

```text
        info_label.setWordWrap(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 270

```text
        right_layout.addWidget(info_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 273

```text
        self.compare_button = QPushButton("Compare Selected")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 274

```text
        self.compare_button.clicked.connect(self.on_compare_selected)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 275

```text
        self.compare_button.setMaximumWidth(180)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 276

```text
        right_layout.addWidget(self.compare_button, alignment=Qt.AlignCenter)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 279

```text
        self.table = QTableWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 281

```text
        self.columns = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 282

```text
            "Room Name", "Sensor Number", "Timestamp",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 283

```text
            "pm0_5 (ft³)", "pm1 (ft³)", "pm2_5 (ft³)", "pm4 (ft³)", "pm10 (ft³)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 284

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 285

```text
        self.table.setColumnCount(len(self.columns))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 286

```text
        self.table.setHorizontalHeaderLabels(self.columns)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 287

```text
        self.table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 288

```text
        self.table.horizontalHeader().setStretchLastSection(False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 289

```text
        self.table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 290

```text
        self.table.setAlternatingRowColors(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 291

```text
        self.table.setSelectionBehavior(QAbstractItemView.SelectRows)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 292

```text
        self.table.setSelectionMode(QAbstractItemView.ExtendedSelection)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 293

```text
        self.table.itemDoubleClicked.connect(self.on_sensor_double_click)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 294

```text
        right_layout.addWidget(self.table)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 296

```text
        content_layout.addWidget(right_frame, 1)  # stretch factor of 1
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 298

```text
    def refresh_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 299

```text
        """Fetch data from API and populate the table"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 300

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 302

```text
            response = requests.get(self.api_url, verify=False, timeout=5)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 303

```text
            response.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 306

```text
            data = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 309

```text
            self.table.setRowCount(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 312

```text
            self.populate_table(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 315

```text
            self.update_room_colors(data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 317

```text
        except requests.exceptions.ConnectionError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 318

```text
            QMessageBox.critical(self, "Connection Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 319

```text
                               f"Could not connect to {self.api_url}\nMake sure the server is running.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 320

```text
        except requests.exceptions.Timeout:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 321

```text
            QMessageBox.critical(self, "Timeout Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 322

```text
                               "Request timed out. Server may be unresponsive.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 323

```text
        except requests.exceptions.RequestException as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 324

```text
            QMessageBox.critical(self, "Request Error", f"Error fetching data: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 325

```text
        except json.JSONDecodeError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 326

```text
            QMessageBox.critical(self, "Parse Error", "Invalid JSON response from server.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 327

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 328

```text
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 330

```text
    def populate_table(self, data, prefix=""):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 331

```text
        """Populate the table with particle sensor data"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 333

```text
        if isinstance(data, dict) and "sensors" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 334

```text
            data_list = data["sensors"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 335

```text
        elif isinstance(data, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 336

```text
            data_list = data
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 337

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 338

```text
            data_list = [data]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 340

```text
        for record in data_list:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 341

```text
            row_position = self.table.rowCount()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 342

```text
            self.table.insertRow(row_position)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 345

```text
            room_name = record.get("room_name", "N/A") if isinstance(record, dict) else "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 346

```text
            self.table.setItem(row_position, 0, QTableWidgetItem(str(room_name)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 349

```text
            sensor_number = record.get("sensor_number", "N/A") if isinstance(record, dict) else "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 350

```text
            self.table.setItem(row_position, 1, QTableWidgetItem(str(sensor_number)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 353

```text
            timestamp = record.get("timestamp") if isinstance(record, dict) else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 354

```text
            if timestamp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 355

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 357

```text
                    if isinstance(timestamp, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 358

```text
                        from datetime import datetime
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 359

```text
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 361

```text
                        dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 362

```text
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 363

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 364

```text
                        dt = datetime.fromtimestamp(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 366

```text
                        dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 367

```text
                        timestamp_str = dt_mountain.strftime('%Y-%m-%d %H:%M:%S %Z')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 368

```text
                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 369

```text
                    timestamp_str = str(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 370

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 371

```text
                timestamp_str = "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 372

```text
            self.table.setItem(row_position, 2, QTableWidgetItem(timestamp_str))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 375

```text
            converted = record.get("converted_values", {}) if isinstance(record, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 378

```text
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 379

```text
            self.table.setItem(row_position, 3, QTableWidgetItem(str(num_conc.get("pm0_5", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 380

```text
            self.table.setItem(row_position, 4, QTableWidgetItem(str(num_conc.get("pm1", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 381

```text
            self.table.setItem(row_position, 5, QTableWidgetItem(str(num_conc.get("pm2_5", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 382

```text
            self.table.setItem(row_position, 6, QTableWidgetItem(str(num_conc.get("pm4", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 383

```text
            self.table.setItem(row_position, 7, QTableWidgetItem(str(num_conc.get("pm10", "N/A"))))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 385

```text
    def _normalize_name(self, name):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 386

```text
        """Normalize a room name for matching: take first line, remove spaces, lowercase"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 387

```text
        first_line = name.split('\n')[0].strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 388

```text
        return first_line.replace(' ', '').lower()
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 390

```text
    def update_room_colors(self, data):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 391

```text
        """Update room frame colors based on particle data freshness and values.
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 393

```text
        Yellow = no matching sensor data or stale data (>30 min old)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 394

```text
        Green  = fresh data with all particle counts at 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 395

```text
        Red    = fresh data with any particle count > 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 396

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 398

```text
        for room_frame in self.room_frames.values():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 399

```text
            room_frame.set_color_state("yellow")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 400

```text
            room_frame.set_env_data(None, None)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 403

```text
        if isinstance(data, dict) and "sensors" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 404

```text
            data_list = data["sensors"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 405

```text
        elif isinstance(data, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 406

```text
            data_list = data
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 407

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 408

```text
            data_list = [data]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 411

```text
        api_rooms = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 412

```text
        for record in data_list:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 413

```text
            if isinstance(record, dict):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 414

```text
                room_name = record.get("room_name", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 415

```text
                normalized = room_name.replace(' ', '').lower()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 416

```text
                api_rooms[normalized] = record
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 418

```text
        now = datetime.now(MOUNTAIN_TZ)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 420

```text
        for layout_name, room_frame in self.room_frames.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 421

```text
            normalized_layout = self._normalize_name(layout_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 423

```text
            if normalized_layout not in api_rooms:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 424

```text
                continue  # No matching sensor data – stays yellow
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 426

```text
            record = api_rooms[normalized_layout]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 429

```text
            timestamp = record.get("timestamp")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 430

```text
            if not timestamp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 431

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 433

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 434

```text
                if isinstance(timestamp, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 435

```text
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 436

```text
                    dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 437

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 438

```text
                    dt = datetime.fromtimestamp(timestamp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 439

```text
                    dt_mountain = convert_to_mountain(dt)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 440

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 441

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 444

```text
            age = now - dt_mountain
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 445

```text
            if age > timedelta(minutes=30):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 446

```text
                continue  # Stale data – stays yellow
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 449

```text
            converted = record.get("converted_values", {})
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 450

```text
            num_conc = converted.get("number_concentrations_ft3", {}) if isinstance(converted, dict) else {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 452

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 453

```text
                pm0_5 = float(num_conc.get("pm0_5", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 454

```text
                pm1   = float(num_conc.get("pm1", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 455

```text
                pm4   = float(num_conc.get("pm4", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 456

```text
                pm10  = float(num_conc.get("pm10", 0) or 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 457

```text
            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 458

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 460

```text
            if pm0_5 == 0 and pm1 == 0 and pm4 == 0 and pm10 == 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 461

```text
                room_frame.set_color_state("green")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 462

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 463

```text
                room_frame.set_color_state("red")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 465

```text
            room_frame.set_env_data(record.get('temperature_c'), record.get('humidity_pct'))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 467

```text
    def on_sensor_double_click(self, item):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 468

```text
        """Handle double-click on sensor table item"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 469

```text
        row = item.row()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 470

```text
        room_name_item = self.table.item(row, 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 471

```text
        sensor_number_item = self.table.item(row, 1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 473

```text
        if room_name_item and sensor_number_item:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 474

```text
            room_name = room_name_item.text()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 475

```text
            sensor_number = sensor_number_item.text()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 478

```text
            self.historical_window = HistoricalDataWindow(room_name, sensor_number, self.api_url)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 479

```text
            self.historical_window.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 481

```text
    def on_compare_selected(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 482

```text
        """Open a comparison window for all currently selected sensor rows."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 483

```text
        selected_rows = self.table.selectionModel().selectedRows()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 484

```text
        if not selected_rows:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 485

```text
            QMessageBox.information(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 486

```text
                self, "No Selection",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 487

```text
                "Select one or more sensor rows (Ctrl/Shift+click) before comparing."
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 488

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 489

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 491

```text
        sensors = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 492

```text
        seen = set()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 493

```text
        for index in sorted(selected_rows, key=lambda x: x.row()):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 494

```text
            row = index.row()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 495

```text
            room_item = self.table.item(row, 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 496

```text
            sensor_item = self.table.item(row, 1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 497

```text
            if not (room_item and sensor_item):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 498

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 499

```text
            key = (room_item.text(), sensor_item.text())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 500

```text
            if key in seen:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 501

```text
                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 502

```text
            seen.add(key)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 503

```text
            sensors.append(key)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 505

```text
        if not sensors:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 506

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 508

```text
        self.comparison_window = ComparisonWindow(sensors, self.api_url)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 509

```text
        self.comparison_window.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 512

```text
class HistoricalDataWindow(QMainWindow):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 513

```text
    def __init__(self, room_name, sensor_number, api_url):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 514

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 515

```text
        self.room_name = room_name
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 516

```text
        self.sensor_number = sensor_number
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 517

```text
        self.api_url = api_url
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 518

```text
        self.init_ui()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
        self.load_historical_data()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 521

```text
    def init_ui(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 522

```text
        """Initialize the historical data window UI"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 523

```text
        self.setWindowTitle(f"Historical Data - {self.room_name}/{self.sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 524

```text
        self.setGeometry(150, 150, 1600, 900)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 527

```text
        central_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 528

```text
        self.setCentralWidget(central_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 531

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 532

```text
        central_widget.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 535

```text
        title_label = QLabel(f"Historical Data for {self.room_name} - {self.sensor_number}")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 536

```text
        title_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 537

```text
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; margin: 10px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 538

```text
        main_layout.addWidget(title_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 541

```text
        control_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 544

```text
        date_label = QLabel("Date Range:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 545

```text
        control_layout.addWidget(date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 547

```text
        start_date_label = QLabel("Start:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 548

```text
        control_layout.addWidget(start_date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 551

```text
        default_start_date = QDate.currentDate().addDays(-7)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 552

```text
        self.start_date_edit = QDateEdit(default_start_date)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 553

```text
        self.start_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 554

```text
        self.start_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 555

```text
        self.start_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 556

```text
        control_layout.addWidget(self.start_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 558

```text
        end_date_label = QLabel("End:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 559

```text
        control_layout.addWidget(end_date_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 562

```text
        default_end_date = QDate.currentDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 563

```text
        self.end_date_edit = QDateEdit(default_end_date)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 564

```text
        self.end_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 565

```text
        self.end_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 566

```text
        self.end_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 567

```text
        control_layout.addWidget(self.end_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 570

```text
        control_layout.addWidget(QLabel("  "))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 573

```text
        export_selected_button = QPushButton("Export Selected Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 574

```text
        export_selected_button.clicked.connect(self.export_selected_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 575

```text
        export_selected_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 576

```text
        control_layout.addWidget(export_selected_button)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 578

```text
        export_all_button = QPushButton("Export All Data")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 579

```text
        export_all_button.clicked.connect(self.export_all_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 580

```text
        export_all_button.setMaximumWidth(150)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 581

```text
        control_layout.addWidget(export_all_button)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 584

```text
        pm_label = QLabel("Graph:")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 585

```text
        control_layout.addWidget(pm_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 587

```text
        checkbox_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 588

```text
        checkbox_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 589

```text
        checkbox_layout.setContentsMargins(0, 0, 0, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 590

```text
        checkbox_widget.setLayout(checkbox_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 592

```text
        self.pm_checkboxes = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 593

```text
        graph_options = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 594

```text
            ("PM0.5", "num_pm0_5_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 595

```text
            ("PM1",   "num_pm1_ft3",   True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 596

```text
            ("PM2.5", "num_pm2_5_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 597

```text
            ("PM4",   "num_pm4_ft3",   True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 598

```text
            ("PM10",  "num_pm10_ft3",  True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 599

```text
            ("Temp °C",    "temperature_c", False),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 600

```text
            ("Humidity %", "humidity_pct",  False),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 601

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 603

```text
        for display_name, data_key, default_checked in graph_options:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 604

```text
            checkbox = QCheckBox(display_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 605

```text
            checkbox.setChecked(default_checked)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 606

```text
            checkbox.stateChanged.connect(self.update_graph)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 607

```text
            self.pm_checkboxes[data_key] = checkbox
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 608

```text
            checkbox_layout.addWidget(checkbox)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 610

```text
        control_layout.addWidget(checkbox_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 612

```text
        control_layout.addStretch()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 613

```text
        main_layout.addLayout(control_layout, 0)  # Fixed size - don't expand
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 616

```text
        splitter = QSplitter(Qt.Horizontal)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 617

```text
        main_layout.addWidget(splitter, 1)  # Expandable - takes all extra space
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 620

```text
        table_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 621

```text
        table_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 622

```text
        table_widget.setLayout(table_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 624

```text
        table_label = QLabel("Historical Data Table")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 625

```text
        table_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 626

```text
        table_label.setStyleSheet("font-weight: bold; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 627

```text
        table_layout.addWidget(table_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 629

```text
        self.hist_table = QTableWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 632

```text
        self.hist_columns = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 633

```text
            "Timestamp", "ISO Timestamp",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 634

```text
            "Temp (°C)", "Humidity (%)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 635

```text
            "PM1 Mass", "PM2.5 Mass", "PM4 Mass", "PM10 Mass",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 636

```text
            "PM0.5 Count", "PM1 Count", "PM2.5 Count", "PM4 Count", "PM10 Count",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 637

```text
            "Particle Size (μm)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 638

```text
            "PM0.5 (ft³)", "PM1 (ft³)", "PM2.5 (ft³)", "PM4 (ft³)", "PM10 (ft³)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 639

```text
            "Bin 0.3-0.5", "Bin 0.5-1.0", "Bin 1.0-2.5", "Bin 2.5-4.0", "Bin 4.0-10",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 640

```text
            "PM1 (μg/m³)", "PM2.5 (μg/m³)", "PM4 (μg/m³)", "PM10 (μg/m³)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 641

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 643

```text
        self.hist_table.setColumnCount(len(self.hist_columns))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 644

```text
        self.hist_table.setHorizontalHeaderLabels(self.hist_columns)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 645

```text
        self.hist_table.horizontalHeader().setSectionResizeMode(QHeaderView.Interactive)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 646

```text
        self.hist_table.horizontalHeader().setStretchLastSection(False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 647

```text
        self.hist_table.setHorizontalScrollMode(QTableWidget.ScrollPerPixel)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 648

```text
        self.hist_table.setAlternatingRowColors(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 649

```text
        self.hist_table.setSortingEnabled(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 651

```text
        table_layout.addWidget(self.hist_table)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 652

```text
        splitter.addWidget(table_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 655

```text
        graph_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 656

```text
        graph_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 657

```text
        graph_widget.setLayout(graph_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 659

```text
        graph_label = QLabel("Historical Data Graph")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 660

```text
        graph_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 661

```text
        graph_label.setStyleSheet("font-weight: bold; margin: 5px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 662

```text
        graph_layout.addWidget(graph_label, 0)  # Fixed size
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 665

```text
        self.figure = Figure(figsize=(8, 6), dpi=80)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 666

```text
        self.canvas = FigureCanvas(self.figure)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 667

```text
        self.ax = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 670

```text
        self.toolbar = NavigationToolbar(self.canvas, graph_widget)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 671

```text
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 673

```text
        graph_layout.addWidget(self.toolbar, 0)  # Fixed size
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 674

```text
        graph_layout.addWidget(self.canvas, 1)   # Expandable - takes all extra space
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 676

```text
        splitter.addWidget(graph_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 679

```text
        splitter.setSizes([800, 800])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 682

```text
        self.historical_data = []  # All data from API
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 683

```text
        self.filtered_data = []    # Filtered data based on date range
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 685

```text
    def on_date_range_changed(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 686

```text
        """Handle date range changes"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 687

```text
        self.filter_data_by_date_range()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 688

```text
        self.populate_historical_table(self.filtered_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 689

```text
        self.update_graph()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 691

```text
    def filter_data_by_date_range(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 692

```text
        """Filter historical data based on selected date range"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 693

```text
        start_date = self.start_date_edit.date().toPyDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 694

```text
        end_date = self.end_date_edit.date().toPyDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 697

```text
        end_date = end_date + timedelta(days=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 699

```text
        self.filtered_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 701

```text
        for record in self.historical_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 703

```text
            record_datetime = self.extract_timestamp_from_record(record)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 705

```text
            if record_datetime:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 706

```text
                record_date = record_datetime.date()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 707

```text
                if start_date <= record_date < end_date:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 708

```text
                    self.filtered_data.append(record)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 710

```text
    def extract_timestamp_from_record(self, record):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 711

```text
        """Extract datetime object from a record"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 712

```text
        timestamp_value = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 715

```text
        if "timestamp_iso" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 716

```text
            timestamp_value = record["timestamp_iso"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 717

```text
        elif "timestamp" in record:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 718

```text
            timestamp_value = record["timestamp"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 719

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 721

```text
            for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 722

```text
                if isinstance(value, str) and 'T' in value and ':' in value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 723

```text
                    timestamp_value = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 724

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 725

```text
                elif isinstance(key, str) and 'T' in key and ':' in key:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 726

```text
                    timestamp_value = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 727

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 730

```text
            if not timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 731

```text
                for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 732

```text
                    if isinstance(key, str) and key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 733

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 734

```text
                            timestamp_value = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 735

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 736

```text
                        except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 737

```text
                            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 738

```text
                    elif isinstance(value, (int, float, str)) and str(value).replace('.', '').isdigit() and len(str(value)) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 739

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 740

```text
                            timestamp_value = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 741

```text
                            break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 742

```text
                        except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 743

```text
                            pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 745

```text
        if timestamp_value is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 746

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 747

```text
                if isinstance(timestamp_value, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 749

```text
                    if 'T' in timestamp_value:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 750

```text
                        return datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 751

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 753

```text
                        return datetime.fromtimestamp(float(timestamp_value))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 754

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 756

```text
                    return datetime.fromtimestamp(float(timestamp_value))
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 757

```text
            except (ValueError, TypeError, OSError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 758

```text
                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 760

```text
        return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 762

```text
    def load_historical_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 763

```text
        """Load historical data from the API, merging env data when available"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 764

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 766

```text
            url = f"{self.api_url}?room_name={self.room_name}&sensor_number={self.sensor_number}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 767

```text
            response = requests.get(url, verify=False, timeout=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 768

```text
            response.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 770

```text
            data = response.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 772

```text
            if data.get("status") == "success" and "historical_data" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 773

```text
                self.historical_data = data["historical_data"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 774

```text
            elif "historical_data" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 775

```text
                self.historical_data = data["historical_data"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 776

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 777

```text
                QMessageBox.warning(self, "No Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 778

```text
                                    f"No historical data found for {self.room_name}/{self.sensor_number}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 779

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 782

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 783

```text
                base_url = self.api_url.rsplit('/', 1)[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 784

```text
                env_url = f"{base_url}/env-data?room_name={self.room_name}&sensor_number={self.sensor_number}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 785

```text
                env_resp = requests.get(env_url, verify=False, timeout=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 786

```text
                if env_resp.status_code == 200:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 787

```text
                    env_json = env_resp.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 788

```text
                    if env_json.get('status') == 'success' and 'data' in env_json:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 789

```text
                        env_lookup = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 790

```text
                        for row in env_json['data']:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 791

```text
                            ts = row.get('timestamp_iso', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 792

```text
                            if ts:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 793

```text
                                env_lookup[ts] = row
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 794

```text
                        for record in self.historical_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 795

```text
                            ts = record.get('timestamp_iso', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 796

```text
                            if ts in env_lookup:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 797

```text
                                record['temperature_c'] = env_lookup[ts].get('temperature_c', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 798

```text
                                record['humidity_pct'] = env_lookup[ts].get('humidity_pct', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 799

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 800

```text
                pass  # Env data is optional — not all sensors have it
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 803

```text
            self.filter_data_by_date_range()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 804

```text
            self.populate_historical_table(self.filtered_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 805

```text
            self.update_graph()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 807

```text
        except requests.exceptions.ConnectionError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 808

```text
            QMessageBox.critical(self, "Connection Error",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 809

```text
                                 "Could not connect to server. Make sure the server is running.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 810

```text
        except requests.exceptions.RequestException as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 811

```text
            QMessageBox.critical(self, "Request Error", f"Error fetching historical data: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 812

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 813

```text
            QMessageBox.critical(self, "Error", f"Unexpected error: {str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 815

```text
    def populate_historical_table(self, historical_data):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 816

```text
        """Populate the historical data table"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 817

```text
        self.hist_table.setRowCount(0)  # Clear existing data
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 819

```text
        for record in historical_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 820

```text
            row_position = self.hist_table.rowCount()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 821

```text
            self.hist_table.insertRow(row_position)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 824

```text
            if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 826

```text
                columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 827

```text
                    record.get("timestamp", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 828

```text
                    record.get("timestamp_iso", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 829

```text
                    record.get("temperature_c", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 830

```text
                    record.get("humidity_pct", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 831

```text
                    record.get("mass_pm1", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 832

```text
                    record.get("mass_pm2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 833

```text
                    record.get("mass_pm4", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 834

```text
                    record.get("mass_pm10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 835

```text
                    record.get("num_pm0_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 836

```text
                    record.get("num_pm1", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 837

```text
                    record.get("num_pm2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 838

```text
                    record.get("num_pm4", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 839

```text
                    record.get("num_pm10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 840

```text
                    record.get("typical_particle_size_um", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 841

```text
                    record.get("num_pm0_5_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 842

```text
                    record.get("num_pm1_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 843

```text
                    record.get("num_pm2_5_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 844

```text
                    record.get("num_pm4_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 845

```text
                    record.get("num_pm10_ft3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 846

```text
                    record.get("bin_0_3_to_0_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 847

```text
                    record.get("bin_0_5_to_1_0", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 848

```text
                    record.get("bin_1_0_to_2_5", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 849

```text
                    record.get("bin_2_5_to_4_0", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 850

```text
                    record.get("bin_4_0_to_10", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 851

```text
                    record.get("mass_pm1_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 852

```text
                    record.get("mass_pm2_5_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 853

```text
                    record.get("mass_pm4_ug_m3", "N/A"),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 854

```text
                    record.get("mass_pm10_ug_m3", "N/A")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 855

```text
                ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 856

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 859

```text
                timestamp_unix = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 860

```text
                timestamp_iso = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 863

```text
                for key in record.keys():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 864

```text
                    if isinstance(key, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 866

```text
                        if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 867

```text
                            timestamp_iso = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 869

```text
                        elif key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 870

```text
                            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 872

```text
                                ts = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 873

```text
                                if ts > 1000000000:  # After 2001
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 874

```text
                                    timestamp_unix = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 875

```text
                            except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 876

```text
                                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 879

```text
                if not timestamp_unix and not timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 880

```text
                    for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 881

```text
                        if isinstance(value, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 882

```text
                            if 'T' in value and (':' in value or '-' in value) and len(value) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 883

```text
                                timestamp_iso = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 884

```text
                            elif value.replace('.', '').isdigit() and len(value) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 885

```text
                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 886

```text
                                    ts = float(value)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 887

```text
                                    if ts > 1000000000:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 888

```text
                                        timestamp_unix = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 889

```text
                                except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 890

```text
                                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 892

```text
                columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 893

```text
                    timestamp_unix if timestamp_unix else "N/A",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 894

```text
                    timestamp_iso if timestamp_iso else "N/A"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 895

```text
                ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 899

```text
                particle_measurements = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 900

```text
                for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 901

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 903

```text
                        if key == timestamp_unix or key == timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 904

```text
                            continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 906

```text
                        if key in ['room_name', 'sensor_number']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 907

```text
                            continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 910

```text
                        if isinstance(key, str) and key.replace('.', '').isdigit():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 911

```text
                            size = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 912

```text
                            if 0.1 <= size <= 50.0:  # Reasonable particle size range in micrometers
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 913

```text
                                particle_measurements[size] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 914

```text
                    except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 915

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 918

```text
                sorted_measurements = sorted(particle_measurements.items())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 922

```text
                remaining_cols = len(self.hist_columns) - 2  # Subtract timestamp columns
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 923

```text
                for i in range(remaining_cols):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 924

```text
                    if i < len(sorted_measurements):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 925

```text
                        size, value = sorted_measurements[i]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 926

```text
                        columns_data.append(f"{size}μm: {value}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 927

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 928

```text
                        columns_data.append("N/A")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 931

```text
            for col, value in enumerate(columns_data):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 932

```text
                if col >= len(self.hist_columns):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 933

```text
                    break
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 935

```text
                if value is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 936

```text
                    value = "N/A"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 937

```text
                elif isinstance(value, float):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 938

```text
                    value = f"{value:.6f}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 939

```text
                self.hist_table.setItem(row_position, col, QTableWidgetItem(str(value)))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 942

```text
        if self.hist_table.rowCount() > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 943

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 944

```text
                self.hist_table.sortItems(0, Qt.DescendingOrder)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 945

```text
            except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 947

```text
                pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 949

```text
    def _parse_record_timestamp(self, record):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 950

```text
        """Return a Mountain Time datetime from a record, or None."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 951

```text
        ts = record.get("timestamp_iso") or record.get("timestamp")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 952

```text
        if ts is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 953

```text
            return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 954

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 955

```text
            if isinstance(ts, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 956

```text
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00')) if 'T' in ts \
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 957

```text
                     else datetime.fromtimestamp(float(ts))
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 958

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 959

```text
                dt = datetime.fromtimestamp(float(ts))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 960

```text
            return convert_to_mountain(dt)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 961

```text
        except (ValueError, TypeError, OSError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 962

```text
            return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 964

```text
    def update_graph(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 965

```text
        """Update the graph based on selected parameters."""
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 966

```text
        self.figure.clear()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 968

```text
        if not self.filtered_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 969

```text
            ax = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 970

```text
            ax.set_title("No Data Available for Selected Date Range")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 971

```text
            ax.set_xlabel("Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 972

```text
            ax.set_ylabel("Particle Count (ft³)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 973

```text
            self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 974

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 976

```text
        checked_params = [k for k, cb in self.pm_checkboxes.items() if cb.isChecked()]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 978

```text
        if not checked_params:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 979

```text
            ax = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 980

```text
            ax.set_title("No Parameters Selected")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 981

```text
            ax.set_xlabel("Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 982

```text
            self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 983

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 985

```text
        env_keys = {"temperature_c", "humidity_pct"}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 986

```text
        pm_params  = [k for k in checked_params if k not in env_keys]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 987

```text
        env_params = [k for k in checked_params if k in env_keys]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 990

```text
        use_twin = bool(pm_params and env_params)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 991

```text
        ax1 = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 992

```text
        ax2 = ax1.twinx() if use_twin else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 994

```text
        color_map = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 995

```text
            "num_pm0_5_ft3": "blue",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 996

```text
            "num_pm1_ft3":   "red",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 997

```text
            "num_pm2_5_ft3": "green",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 998

```text
            "num_pm4_ft3":   "orange",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 999

```text
            "num_pm10_ft3":  "purple",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1000

```text
            "temperature_c": "firebrick",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1001

```text
            "humidity_pct":  "steelblue",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1002

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1003

```text
        display_names = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1004

```text
            "num_pm0_5_ft3": "PM0.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1005

```text
            "num_pm1_ft3":   "PM1",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1006

```text
            "num_pm2_5_ft3": "PM2.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1007

```text
            "num_pm4_ft3":   "PM4",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1008

```text
            "num_pm10_ft3":  "PM10",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1009

```text
            "temperature_c": "Temp (°C)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1010

```text
            "humidity_pct":  "Humidity (%)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1011

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1013

```text
        all_lines, all_labels = [], []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1015

```text
        for data_key in checked_params:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1016

```text
            ax = ax2 if (ax2 is not None and data_key in env_keys) else ax1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1017

```text
            timestamps, values = [], []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1019

```text
            for record in self.filtered_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1020

```text
                dt = self._parse_record_timestamp(record)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1021

```text
                raw_val = record.get(data_key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1022

```text
                if dt is None or raw_val in (None, '', 'N/A'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1023

```text
                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1024

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1025

```text
                    timestamps.append(dt)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1026

```text
                    values.append(float(raw_val))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1027

```text
                except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1028

```text
                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1030

```text
            if timestamps and values:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1031

```text
                pts = sorted(zip(timestamps, values))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1032

```text
                ts_sorted, v_sorted = zip(*pts)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1033

```text
                line, = ax.plot(ts_sorted, v_sorted,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1034

```text
                                color=color_map.get(data_key, 'black'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1035

```text
                                linewidth=2, marker='o', markersize=3,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1036

```text
                                label=display_names.get(data_key, data_key),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1037

```text
                                alpha=0.8)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1038

```text
                all_lines.append(line)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1039

```text
                all_labels.append(display_names.get(data_key, data_key))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1041

```text
        ax1.set_title("Sensor Data Over Time")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1042

```text
        ax1.set_xlabel("Time (Mountain Time)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1043

```text
        ax1.set_ylabel("Particle Count (ft³)" if pm_params else
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1044

```text
                        ("Temp (°C) / Humidity (%)" if not use_twin else ""))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1045

```text
        ax1.grid(True, alpha=0.3)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1047

```text
        if ax2 is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1048

```text
            ax2.set_ylabel("Temp (°C) / Humidity (%)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1050

```text
        if all_lines:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1051

```text
            ax1.legend(all_lines, all_labels, loc='upper right')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1053

```text
        self.figure.autofmt_xdate()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1054

```text
        self.figure.tight_layout()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1055

```text
        self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1057

```text
    def export_selected_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1058

```text
        """Export currently filtered/displayed data to CSV"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1059

```text
        if not self.filtered_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1060

```text
            QMessageBox.information(self, "No Data", "No data available to export.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1061

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1063

```text
        file_path, _ = QFileDialog.getSaveFileName(
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1064

```text
            self,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1065

```text
            "Export Selected Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1066

```text
            f"particle_data_{self.room_name}_{self.sensor_number}_selected.csv",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1067

```text
            "CSV Files (*.csv)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1068

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1070

```text
        if file_path:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1071

```text
            self._export_to_csv(self.filtered_data, file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1073

```text
    def export_all_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1074

```text
        """Export all historical data to CSV"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1075

```text
        if not self.historical_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1076

```text
            QMessageBox.information(self, "No Data", "No data available to export.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1077

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1079

```text
        file_path, _ = QFileDialog.getSaveFileName(
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1080

```text
            self,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1081

```text
            "Export All Data",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1082

```text
            f"particle_data_{self.room_name}_{self.sensor_number}_all.csv",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1083

```text
            "CSV Files (*.csv)"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1084

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1086

```text
        if file_path:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1087

```text
            self._export_to_csv(self.historical_data, file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1089

```text
    def _export_to_csv(self, data, file_path):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1090

```text
        """Helper method to write data to CSV file"""
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1091

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1092

```text
            with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1093

```text
                writer = csv.writer(csvfile)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1096

```text
                writer.writerow(self.hist_columns)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1099

```text
                for record in data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1100

```text
                    row_data = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1103

```text
                    if any(key in record for key in ['timestamp', 'timestamp_iso', 'num_pm0_5_ft3', 'mass_pm1']):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1105

```text
                        columns_data = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1106

```text
                            record.get("timestamp", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1107

```text
                            record.get("timestamp_iso", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1108

```text
                            record.get("temperature_c", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1109

```text
                            record.get("humidity_pct", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1110

```text
                            record.get("mass_pm1", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1111

```text
                            record.get("mass_pm2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1112

```text
                            record.get("mass_pm4", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1113

```text
                            record.get("mass_pm10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1114

```text
                            record.get("num_pm0_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1115

```text
                            record.get("num_pm1", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1116

```text
                            record.get("num_pm2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1117

```text
                            record.get("num_pm4", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1118

```text
                            record.get("num_pm10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1119

```text
                            record.get("typical_particle_size_um", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1120

```text
                            record.get("num_pm0_5_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1121

```text
                            record.get("num_pm1_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1122

```text
                            record.get("num_pm2_5_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1123

```text
                            record.get("num_pm4_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1124

```text
                            record.get("num_pm10_ft3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1125

```text
                            record.get("bin_0_3_to_0_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1126

```text
                            record.get("bin_0_5_to_1_0", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1127

```text
                            record.get("bin_1_0_to_2_5", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1128

```text
                            record.get("bin_2_5_to_4_0", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1129

```text
                            record.get("bin_4_0_to_10", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1130

```text
                            record.get("mass_pm1_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1131

```text
                            record.get("mass_pm2_5_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1132

```text
                            record.get("mass_pm4_ug_m3", ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1133

```text
                            record.get("mass_pm10_ug_m3", "")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1134

```text
                        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1135

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1137

```text
                        timestamp_unix = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1138

```text
                        timestamp_iso = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1141

```text
                        for key in record.keys():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1142

```text
                            if isinstance(key, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1143

```text
                                if 'T' in key and (':' in key or '-' in key) and len(key) > 15:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1144

```text
                                    timestamp_iso = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1145

```text
                                elif key.replace('.', '').isdigit() and len(key) >= 10:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1146

```text
                                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1147

```text
                                        ts = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1148

```text
                                        if ts > 1000000000:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1149

```text
                                            timestamp_unix = key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1150

```text
                                    except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1151

```text
                                        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1153

```text
                        columns_data = [timestamp_unix or "", timestamp_iso or ""]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1156

```text
                        particle_measurements = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1157

```text
                        for key, value in record.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1158

```text
                            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1159

```text
                                if key == timestamp_unix or key == timestamp_iso:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1160

```text
                                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1161

```text
                                if key in ['room_name', 'sensor_number']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1162

```text
                                    continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1163

```text
                                if isinstance(key, str) and key.replace('.', '').isdigit():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1164

```text
                                    size = float(key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1165

```text
                                    if 0.1 <= size <= 50.0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1166

```text
                                        particle_measurements[size] = value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1167

```text
                            except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1168

```text
                                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1170

```text
                        sorted_measurements = sorted(particle_measurements.items())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1171

```text
                        remaining_cols = len(self.hist_columns) - 2
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1172

```text
                        for i in range(remaining_cols):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1173

```text
                            if i < len(sorted_measurements):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1174

```text
                                size, value = sorted_measurements[i]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1175

```text
                                columns_data.append(f"{size}μm: {value}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1176

```text
                            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1177

```text
                                columns_data.append("")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1180

```text
                    clean_row = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1181

```text
                    for value in columns_data:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1182

```text
                        if value is None or value == "N/A":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1183

```text
                            clean_row.append("")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1184

```text
                        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1185

```text
                            clean_row.append(str(value))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1187

```text
                    writer.writerow(clean_row)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1189

```text
            QMessageBox.information(self, "Export Complete", f"Data exported successfully to:\n{file_path}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1191

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1192

```text
            QMessageBox.critical(self, "Export Error", f"Error exporting data to CSV:\n{str(e)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1195

```text
class ComparisonWindow(QMainWindow):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 1196

```text
    """Side-by-side comparison of historical data from multiple sensors.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1198

```text
    Shows one stacked subplot per sensor, sharing the time axis so trends
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1199

```text
    line up vertically. Y-axis can optionally be shared across sensors for
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1200

```text
    direct magnitude comparison.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1201

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1203

```text
    def __init__(self, sensors, api_url):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1204

```text
        super().__init__()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1205

```text
        self.sensors = sensors  # list of (room_name, sensor_number) tuples
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1206

```text
        self.api_url = api_url
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1207

```text
        self.sensor_data = {s: [] for s in sensors}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1208

```text
        self.filtered_data = {s: [] for s in sensors}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1209

```text
        self.init_ui()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1210

```text
        self.load_all_data()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1212

```text
    def init_ui(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1213

```text
        n = len(self.sensors)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1214

```text
        self.setWindowTitle(f"Sensor Comparison ({n} sensor{'s' if n != 1 else ''})")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1215

```text
        self.setGeometry(180, 180, 1300, 850)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1217

```text
        central_widget = QWidget()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1218

```text
        self.setCentralWidget(central_widget)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1219

```text
        main_layout = QVBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1220

```text
        central_widget.setLayout(main_layout)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1223

```text
        names = ", ".join(f"{r}/{s}" for r, s in self.sensors)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1224

```text
        title_label = QLabel(f"Comparing: {names}")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1225

```text
        title_label.setAlignment(Qt.AlignCenter)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1226

```text
        title_label.setStyleSheet("font-size: 14px; font-weight: bold; margin: 8px;")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1227

```text
        title_label.setWordWrap(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1228

```text
        main_layout.addWidget(title_label)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1231

```text
        control_layout = QHBoxLayout()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1233

```text
        control_layout.addWidget(QLabel("Date Range:"))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1234

```text
        control_layout.addWidget(QLabel("Start:"))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1236

```text
        default_start = QDate.currentDate().addDays(-7)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1237

```text
        self.start_date_edit = QDateEdit(default_start)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1238

```text
        self.start_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1239

```text
        self.start_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1240

```text
        self.start_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1241

```text
        control_layout.addWidget(self.start_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1243

```text
        control_layout.addWidget(QLabel("End:"))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1244

```text
        self.end_date_edit = QDateEdit(QDate.currentDate())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1245

```text
        self.end_date_edit.setCalendarPopup(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1246

```text
        self.end_date_edit.setMaximumWidth(120)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1247

```text
        self.end_date_edit.dateChanged.connect(self.on_date_range_changed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1248

```text
        control_layout.addWidget(self.end_date_edit)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1250

```text
        control_layout.addWidget(QLabel("  "))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1251

```text
        control_layout.addWidget(QLabel("Graph:"))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1253

```text
        self.pm_checkboxes = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1254

```text
        graph_options = [
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1255

```text
            ("PM0.5", "num_pm0_5_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1256

```text
            ("PM1",   "num_pm1_ft3",   True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1257

```text
            ("PM2.5", "num_pm2_5_ft3", True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1258

```text
            ("PM4",   "num_pm4_ft3",   True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1259

```text
            ("PM10",  "num_pm10_ft3",  True),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1260

```text
            ("Temp °C",    "temperature_c", False),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1261

```text
            ("Humidity %", "humidity_pct",  False),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1262

```text
        ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1263

```text
        for display_name, data_key, default_checked in graph_options:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1264

```text
            cb = QCheckBox(display_name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1265

```text
            cb.setChecked(default_checked)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1266

```text
            cb.stateChanged.connect(self.update_graphs)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1267

```text
            self.pm_checkboxes[data_key] = cb
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1268

```text
            control_layout.addWidget(cb)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1270

```text
        control_layout.addWidget(QLabel("  "))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1273

```text
        self.shared_y_checkbox = QCheckBox("Shared Y-axis")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1274

```text
        self.shared_y_checkbox.setChecked(False)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1275

```text
        self.shared_y_checkbox.stateChanged.connect(self.update_graphs)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1276

```text
        control_layout.addWidget(self.shared_y_checkbox)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1278

```text
        control_layout.addStretch()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1279

```text
        main_layout.addLayout(control_layout, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1282

```text
        self.figure = Figure(figsize=(10, 4), dpi=80)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1283

```text
        self.canvas = FigureCanvas(self.figure)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1284

```text
        self.toolbar = NavigationToolbar(self.canvas, central_widget)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1285

```text
        self.toolbar.setStyleSheet("QToolBar QToolButton { background-color: white; }")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1287

```text
        scroll = QScrollArea()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1288

```text
        scroll.setWidget(self.canvas)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1289

```text
        scroll.setWidgetResizable(True)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1291

```text
        main_layout.addWidget(self.toolbar, 0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1292

```text
        main_layout.addWidget(scroll, 1)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1294

```text
    def on_date_range_changed(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1295

```text
        self._filter_all()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1296

```text
        self.update_graphs()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1298

```text
    def _filter_all(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1299

```text
        """Re-filter every sensor's records against the current date range."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1300

```text
        start_date = self.start_date_edit.date().toPyDate()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1301

```text
        end_date = self.end_date_edit.date().toPyDate() + timedelta(days=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1303

```text
        for sensor_key, records in self.sensor_data.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1304

```text
            filtered = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1305

```text
            for rec in records:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1306

```text
                dt = self._parse_record_timestamp(rec)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1307

```text
                if dt is not None and start_date <= dt.date() < end_date:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1308

```text
                    filtered.append(rec)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1309

```text
            self.filtered_data[sensor_key] = filtered
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1311

```text
    def _parse_record_timestamp(self, record):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1312

```text
        """Return a Mountain Time datetime from a record, or None."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1313

```text
        ts = record.get("timestamp_iso") or record.get("timestamp")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1314

```text
        if ts is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1315

```text
            return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 1316

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1317

```text
            if isinstance(ts, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1318

```text
                dt = datetime.fromisoformat(ts.replace('Z', '+00:00')) if 'T' in ts \
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1319

```text
                     else datetime.fromtimestamp(float(ts))
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1320

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1321

```text
                dt = datetime.fromtimestamp(float(ts))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1322

```text
            return convert_to_mountain(dt)
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 1323

```text
        except (ValueError, TypeError, OSError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1324

```text
            return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 1326

```text
    def load_all_data(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1327

```text
        """Fetch historical (and optional env) data for every selected sensor."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1328

```text
        failed = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1329

```text
        for sensor_key in self.sensors:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1330

```text
            room_name, sensor_number = sensor_key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1331

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1332

```text
                url = f"{self.api_url}?room_name={room_name}&sensor_number={sensor_number}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1333

```text
                resp = requests.get(url, verify=False, timeout=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1334

```text
                resp.raise_for_status()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1335

```text
                data = resp.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1336

```text
                if "historical_data" in data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1337

```text
                    self.sensor_data[sensor_key] = data["historical_data"]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1340

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1341

```text
                    base_url = self.api_url.rsplit('/', 1)[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1342

```text
                    env_url = f"{base_url}/env-data?room_name={room_name}&sensor_number={sensor_number}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1343

```text
                    env_resp = requests.get(env_url, verify=False, timeout=10)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1344

```text
                    if env_resp.status_code == 200:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1345

```text
                        env_json = env_resp.json()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1346

```text
                        if env_json.get('status') == 'success' and 'data' in env_json:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1347

```text
                            env_lookup = {row.get('timestamp_iso', ''): row
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1348

```text
                                          for row in env_json['data']
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1349

```text
                                          if row.get('timestamp_iso')}
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1350

```text
                            for record in self.sensor_data[sensor_key]:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1351

```text
                                ts = record.get('timestamp_iso', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1352

```text
                                if ts in env_lookup:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1353

```text
                                    record['temperature_c'] = env_lookup[ts].get('temperature_c', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1354

```text
                                    record['humidity_pct'] = env_lookup[ts].get('humidity_pct', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1355

```text
                except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1356

```text
                    pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1357

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1358

```text
                failed.append(f"{room_name}/{sensor_number}: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1360

```text
        if failed:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1361

```text
            QMessageBox.warning(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1362

```text
                self, "Some Data Failed to Load",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1363

```text
                "Failed to load data for:\n\n" + "\n".join(failed)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1364

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1366

```text
        self._filter_all()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1367

```text
        self.update_graphs()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1369

```text
    def update_graphs(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1370

```text
        """Redraw the stacked subplots based on selected metrics and date range."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1371

```text
        self.figure.clear()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1373

```text
        checked = [k for k, cb in self.pm_checkboxes.items() if cb.isChecked()]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1375

```text
        if not checked:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1376

```text
            ax = self.figure.add_subplot(111)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1377

```text
            ax.set_title("No Parameters Selected")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1378

```text
            self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1379

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1381

```text
        n = len(self.sensors)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1384

```text
        height_per_sensor = 3.0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1385

```text
        total_h = max(4.0, height_per_sensor * n)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1386

```text
        self.figure.set_size_inches(10.0, total_h)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1388

```text
        sharey = self.shared_y_checkbox.isChecked()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1390

```text
        if n == 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1391

```text
            axes = [self.figure.add_subplot(111)]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1392

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1393

```text
            ax_array = self.figure.subplots(n, 1, sharex=True, sharey=sharey)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1394

```text
            axes = list(ax_array)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1396

```text
        color_map = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1397

```text
            "num_pm0_5_ft3": "blue",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1398

```text
            "num_pm1_ft3":   "red",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1399

```text
            "num_pm2_5_ft3": "green",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1400

```text
            "num_pm4_ft3":   "orange",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1401

```text
            "num_pm10_ft3":  "purple",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1402

```text
            "temperature_c": "firebrick",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1403

```text
            "humidity_pct":  "steelblue",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1404

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1405

```text
        display_names = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1406

```text
            "num_pm0_5_ft3": "PM0.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1407

```text
            "num_pm1_ft3":   "PM1",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1408

```text
            "num_pm2_5_ft3": "PM2.5",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1409

```text
            "num_pm4_ft3":   "PM4",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1410

```text
            "num_pm10_ft3":  "PM10",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1411

```text
            "temperature_c": "Temp (°C)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1412

```text
            "humidity_pct":  "Humidity (%)",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1413

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1414

```text
        env_keys = {"temperature_c", "humidity_pct"}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1415

```text
        pm_params = [k for k in checked if k not in env_keys]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1416

```text
        env_params = [k for k in checked if k in env_keys]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1417

```text
        use_twin = bool(pm_params and env_params)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1419

```text
        for i, sensor_key in enumerate(self.sensors):
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1420

```text
            room_name, sensor_number = sensor_key
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1421

```text
            ax1 = axes[i]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1422

```text
            records = self.filtered_data.get(sensor_key, [])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1424

```text
            ax2 = ax1.twinx() if use_twin else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1425

```text
            all_lines, all_labels = [], []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1427

```text
            for data_key in checked:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1428

```text
                target_ax = ax2 if (ax2 is not None and data_key in env_keys) else ax1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1429

```text
                timestamps, values = [], []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1430

```text
                for record in records:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1431

```text
                    dt = self._parse_record_timestamp(record)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1432

```text
                    raw = record.get(data_key)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1433

```text
                    if dt is None or raw in (None, '', 'N/A'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1434

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1435

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1436

```text
                        timestamps.append(dt)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1437

```text
                        values.append(float(raw))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1438

```text
                    except (ValueError, TypeError):
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1439

```text
                        continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1441

```text
                if timestamps and values:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1442

```text
                    pts = sorted(zip(timestamps, values))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1443

```text
                    ts_s, v_s = zip(*pts)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1444

```text
                    line, = target_ax.plot(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1445

```text
                        ts_s, v_s,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1446

```text
                        color=color_map.get(data_key, 'black'),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1447

```text
                        linewidth=1.5, marker='o', markersize=2,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1448

```text
                        label=display_names.get(data_key, data_key),
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1449

```text
                        alpha=0.85,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1450

```text
                    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1451

```text
                    all_lines.append(line)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1452

```text
                    all_labels.append(display_names.get(data_key, data_key))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1454

```text
            ax1.set_title(f"{room_name} / {sensor_number}", fontsize=10, fontweight='bold')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1455

```text
            ax1.grid(True, alpha=0.3)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1456

```text
            ax1.set_ylabel("Count (ft³)" if pm_params else "Temp / Humidity")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1457

```text
            if ax2 is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1458

```text
                ax2.set_ylabel("Temp (°C) / Hum (%)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1459

```text
            if all_lines:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1460

```text
                ax1.legend(all_lines, all_labels, loc='upper right', fontsize=8)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1462

```text
            if not records:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1463

```text
                ax1.text(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1464

```text
                    0.5, 0.5, "No data in selected range",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1465

```text
                    transform=ax1.transAxes, ha='center', va='center',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1466

```text
                    fontsize=11, color='gray', style='italic',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1467

```text
                )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1469

```text
        if axes:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1470

```text
            axes[-1].set_xlabel("Time (Mountain Time)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1472

```text
        self.figure.autofmt_xdate()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1473

```text
        self.figure.tight_layout()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1477

```text
        dpi = self.figure.get_dpi()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1478

```text
        self.canvas.setMinimumHeight(int(total_h * dpi))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1479

```text
        self.canvas.draw()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1482

```text
def main():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1483

```text
    app = QApplication(sys.argv)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1484

```text
    viewer = ParticleDataViewer()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1485

```text
    viewer.show()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1486

```text
    sys.exit(app.exec_())
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1489

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1490

```text
    main()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/ParticleSensor/src/gui.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
