

# Source Reconstruction: NanofabToolkit/README.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `NanofabToolkit`
- Relative path: `README.md`
- Lines read: `148`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `d877d1eacdd55500`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
## NanofabToolKit

Below are some tools developed by Phe Hobbs for the University of Utah's Nanofab department.
Information about us can be found at nanofab.utah.edu


# ALDPeakCounter

The ALDpeakcounter takes a csv file from and graphs the file while also providing a numerical count of local maximums.
This graph is zoomable and allows for multiple charts in order for users to draw comparisons, which can performed using the x-axis translation tool.
Additionally, by adjusting the peak detection parameters, it is possible to make the counting more or less sensitive allowing for quick reads of the number of peaks in the provided csv.

# DentonDecoder

The Denton Decoder program loads in one or more .dat file from the Denton635 machine and converts it to a (much) more readable csv.
After conversion, it then allows a user to graph any of the columns produced.
As with the ALD peak counter, this program allows users to translate their graphs left and right for ease of comparisons.

# PreciousMetalReader

The Precious Metal Reader allows users to automatically and easily download the total usage for four precious metals.
This downloads the information from cores.utah.edu and automatically converts it to a csv split by users alongside their personal usage of the metals per tool.
These metals are Iridium, Gold, Platinum, and Palladium and the tools are the Denton16, Denton635, and TMV.
A module named "auth.py" with the authentication code must be provided.

## Project Structure

```
NanofabToolKit
├── .git                            # Git Information
├── .gitignore                      # Ignored files
├── ALDPeakCounter                  # Counts peaks in csv
│   ├── src
│   │   ├── assets
│   │   │   ├── icon.ico                # Contains the icon for the ALDPeakCounter
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
│   │   ├── gui.py                      # Defines the GUI of the ALDPeakCounter
│   │   └── peakcounter.py              # Backend of the peakcounter, actually does the counting
│   ├── main.py                         # Entry Point of the ALDPeakCounter program
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program
├── DentonDecoder                   # Decodes DAT files and displays them
│   ├── src
│   │   ├── assets
│   │   │   ├── icon.ico                # Contains the icon for the decoder
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
│   │   ├── gui.py                      # Defines the GUI of the DentonDecoder
│   │   ├── DentonDecoder.py            # Decodes .dat files into a more readable csv
│   │   └── DentonGrapher.py            # Graphs out the resulting csv
│   ├── main.py                         # Entry Point of the DentonDecoder program
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program
├── PreciousMetalReader             # Downloads the list of precious metals from the U's cores website
│   ├── src
│   │   ├── assets
│   │   │   ├── icon.ico                # Contains the icon for the metal downloader tool
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
│   │   ├── gui.py                      # Defines the GUI of the PreciousMetalReader
│   │   ├── RetrieveMonthlyMetals.py    # Downloads the information from the cores website
│   │   └── auth.py                     # MUST BE ADDED BY USER. CODE CONTAINS API ENDPOINT CODE IN ORDER TO DOWNLOAD FROM SITE
│   ├── main.py                         # Entry Point of the PreciousMetalReader program
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program (none in this case)
├── ParalyneReader                  # Downloads and graphs the log files of the paralyne machine
│   ├── src
│   │   ├── assets
│   │   │   ├── icon.ico                # Contains the icon for the paralyne tool
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
│   │   ├── gui.py                      # Defines the GUI of the ParalyneReader
│   │   └── ParalyneReader.py           # Backend for the tool, downloads files from the server
│   ├── main.py                         # Entry Point of the PreciousMetalReader program
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program (none in this case)
├── LICENSE                         #MIT LICENSE
└── README.MD                       #README definining how this program works (this file you're reading now)
```

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:phelanhobbs/NanofabToolKit.git
   cd NanofabToolKit
   ```

2. Install the required dependencies:
   ```
   pip install -r /[toolname]/requirements.txt
   ```

3. (RetrieveMonthlyMetals only) Add the auth.py file to the program (you will need to ask for this)
    ```
    echo "HSCCode = '[code]'" > /RetrieveMonthlyMetals/src/auth.py
    ```

## Usage

1. Run the application:
   ```
   python /[toolname]/main.py
   ```

2. Working with the application:

# ALDPeakCounter

- Add data files using the file selection dialog
- Set peak detection parameters (height, prominence, distance, width)
- Process the files to detect peaks
- Apply offsets to adjust data as needed
- View results in both text format and interactive plots
- Reset offsets if necessary

# DentonDecoder

- Add data files using the file selection dialog
- Set graphing parameters (column to graph, log scale)
- Hit Generate Graph to generate the graphing
- Use the time alignment section to move data left and right
- Reset offsets if necessary

# PreciousMetalReader

- First authentication data must be added manually
- Download useage per month to month basis of 4 different precious metals
- Precious Metal usage is denoted by both user and tools
- Downloads information from the cores website without needing to sign in

# ParalyneReader

- Gathers log files from the server without needing to sing in
- allows users to disable smoothing or alter the algorithm being used
- allows users to denote when and how long it takes to pump down the paralyne machine
- has horizontal bar at y=15 as that is what is considered "pumped down"
- having multiple runs allows users to compare runs

## Building an Executable

To build a standalone executable, after creating a spec file:

   ```
   pip install pyinstaller
   pyinstaller ./[toolname]/[name].spec
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
```

## Line-By-Line Reconstruction Notes

### Line 3

```text
Below are some tools developed by Phe Hobbs for the University of Utah's Nanofab department.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 4

```text
Information about us can be found at nanofab.utah.edu
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
The ALDpeakcounter takes a csv file from and graphs the file while also providing a numerical count of local maximums.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 10

```text
This graph is zoomable and allows for multiple charts in order for users to draw comparisons, which can performed using the x-axis translation tool.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 11

```text
Additionally, by adjusting the peak detection parameters, it is possible to make the counting more or less sensitive allowing for quick reads of the number of peaks in the provided csv.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 15

```text
The Denton Decoder program loads in one or more .dat file from the Denton635 machine and converts it to a (much) more readable csv.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 16

```text
After conversion, it then allows a user to graph any of the columns produced.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 17

```text
As with the ALD peak counter, this program allows users to translate their graphs left and right for ease of comparisons.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 21

```text
The Precious Metal Reader allows users to automatically and easily download the total usage for four precious metals.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
This downloads the information from cores.utah.edu and automatically converts it to a csv split by users alongside their personal usage of the metals per tool.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 23

```text
These metals are Iridium, Gold, Platinum, and Palladium and the tools are the Denton16, Denton635, and TMV.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 24

```text
A module named "auth.py" with the authentication code must be provided.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 28

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 29

```text
NanofabToolKit
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 30

```text
├── .git                            # Git Information
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 31

```text
├── .gitignore                      # Ignored files
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 32

```text
├── ALDPeakCounter                  # Counts peaks in csv
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 33

```text
│   ├── src
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 34

```text
│   │   ├── assets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 35

```text
│   │   │   ├── icon.ico                # Contains the icon for the ALDPeakCounter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 36

```text
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 37

```text
│   │   ├── gui.py                      # Defines the GUI of the ALDPeakCounter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
│   │   └── peakcounter.py              # Backend of the peakcounter, actually does the counting
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
│   ├── main.py                         # Entry Point of the ALDPeakCounter program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 40

```text
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 41

```text
├── DentonDecoder                   # Decodes DAT files and displays them
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 42

```text
│   ├── src
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 43

```text
│   │   ├── assets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 44

```text
│   │   │   ├── icon.ico                # Contains the icon for the decoder
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 45

```text
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 46

```text
│   │   ├── gui.py                      # Defines the GUI of the DentonDecoder
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
│   │   ├── DentonDecoder.py            # Decodes .dat files into a more readable csv
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 48

```text
│   │   └── DentonGrapher.py            # Graphs out the resulting csv
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 49

```text
│   ├── main.py                         # Entry Point of the DentonDecoder program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 51

```text
├── PreciousMetalReader             # Downloads the list of precious metals from the U's cores website
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 52

```text
│   ├── src
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 53

```text
│   │   ├── assets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 54

```text
│   │   │   ├── icon.ico                # Contains the icon for the metal downloader tool
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 55

```text
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 56

```text
│   │   ├── gui.py                      # Defines the GUI of the PreciousMetalReader
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
│   │   ├── RetrieveMonthlyMetals.py    # Downloads the information from the cores website
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 58

```text
│   │   └── auth.py                     # MUST BE ADDED BY USER. CODE CONTAINS API ENDPOINT CODE IN ORDER TO DOWNLOAD FROM SITE
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 59

```text
│   ├── main.py                         # Entry Point of the PreciousMetalReader program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 60

```text
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program (none in this case)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 61

```text
├── ParalyneReader                  # Downloads and graphs the log files of the paralyne machine
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
│   ├── src
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
│   │   ├── assets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 64

```text
│   │   │   ├── icon.ico                # Contains the icon for the paralyne tool
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 65

```text
│   │   │   └── icon.py                 # Contains code to ensure icon is loaded correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 66

```text
│   │   ├── gui.py                      # Defines the GUI of the ParalyneReader
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
│   │   └── ParalyneReader.py           # Backend for the tool, downloads files from the server
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 68

```text
│   ├── main.py                         # Entry Point of the PreciousMetalReader program
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 69

```text
│   └── requirements.txt                # List of dependencies that needs to be installed to run the program (none in this case)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 70

```text
├── LICENSE                         #MIT LICENSE
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 71

```text
└── README.MD                       #README definining how this program works (this file you're reading now)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 72

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 76

```text
1. Clone the repository:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 77

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 78

```text
   git clone git@github.com:phelanhobbs/NanofabToolKit.git
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 79

```text
   cd NanofabToolKit
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 80

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 82

```text
2. Install the required dependencies:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 83

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
   pip install -r /[toolname]/requirements.txt
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 85

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 87

```text
3. (RetrieveMonthlyMetals only) Add the auth.py file to the program (you will need to ask for this)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 88

```text
    ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 89

```text
    echo "HSCCode = '[code]'" > /RetrieveMonthlyMetals/src/auth.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 90

```text
    ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 94

```text
1. Run the application:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 96

```text
   python /[toolname]/main.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 97

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
2. Working with the application:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 103

```text
- Add data files using the file selection dialog
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 104

```text
- Set peak detection parameters (height, prominence, distance, width)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 105

```text
- Process the files to detect peaks
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 106

```text
- Apply offsets to adjust data as needed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 107

```text
- View results in both text format and interactive plots
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 108

```text
- Reset offsets if necessary
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 112

```text
- Add data files using the file selection dialog
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 113

```text
- Set graphing parameters (column to graph, log scale)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 114

```text
- Hit Generate Graph to generate the graphing
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 115

```text
- Use the time alignment section to move data left and right
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 116

```text
- Reset offsets if necessary
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 120

```text
- First authentication data must be added manually
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 121

```text
- Download useage per month to month basis of 4 different precious metals
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 122

```text
- Precious Metal usage is denoted by both user and tools
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 123

```text
- Downloads information from the cores website without needing to sign in
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 127

```text
- Gathers log files from the server without needing to sing in
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 128

```text
- allows users to disable smoothing or alter the algorithm being used
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 129

```text
- allows users to denote when and how long it takes to pump down the paralyne machine
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 130

```text
- has horizontal bar at y=15 as that is what is considered "pumped down"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 131

```text
- having multiple runs allows users to compare runs
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 135

```text
To build a standalone executable, after creating a spec file:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 137

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 138

```text
   pip install pyinstaller
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 139

```text
   pyinstaller ./[toolname]/[name].spec
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 140

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 144

```text
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 148

```text
This project is licensed under the MIT License. See the LICENSE file for details.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `NanofabToolkit/README.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `NanofabToolkit/README.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `NanofabToolkit/README.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `NanofabToolkit/README.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `NanofabToolkit/README.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `NanofabToolkit/README.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `NanofabToolkit/README.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `NanofabToolkit/README.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `NanofabToolkit/README.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `NanofabToolkit/README.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `NanofabToolkit/README.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `NanofabToolkit/README.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `NanofabToolkit/README.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `NanofabToolkit/README.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `NanofabToolkit/README.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `NanofabToolkit/README.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `NanofabToolkit/README.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `NanofabToolkit/README.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `NanofabToolkit/README.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `NanofabToolkit/README.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `NanofabToolkit/README.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `NanofabToolkit/README.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `NanofabToolkit/README.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `NanofabToolkit/README.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
