

# Source Reconstruction: UNanofabTools/setup.sh

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `setup.sh`
- Lines read: `92`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `ed0af7026e76f521`
- Code fence language: `sh`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```sh
#!/bin/bash

# Quick Start Script for Flask Refactored Application

echo "🚀 UNanofabTools Flask Setup"
echo "=============================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

echo ""
echo "🔄 Activating virtual environment..."
source venv/bin/activate

echo ""
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "⚙️  Checking configuration..."
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env file with your configuration!"
    echo "   - Set your SECRET_KEY"
    echo "   - Configure SSL certificate paths"
    echo "   - Set Duo Security credentials"
    echo "   - Adjust other settings as needed"
    echo ""
    read -p "Press Enter after you've edited .env file..."
else
    echo "✅ .env file exists"
fi

echo ""
echo "📁 Creating required directories..."
mkdir -p app/templates
mkdir -p app/static/js
mkdir -p app/static/css
mkdir -p uploads
mkdir -p HSCDATA
mkdir -p LogData/ALD/RF
mkdir -p LogData/ALD/Pressure
mkdir -p LogData/Paralyne/analog
mkdir -p LogData/denton18/pumpdata
mkdir -p logs

echo "✅ Directories created"

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Move your HTML files to app/templates/"
echo "   $ mv *.html app/templates/"
echo ""
echo "2. Move JavaScript files to app/static/js/"
echo "   $ mv HSCDATA/js/* app/static/js/"
echo ""
echo "3. Update HTML templates to use Flask syntax"
echo "   - See app/templates/base.html for example"
echo "   - See app/templates/login_example.html for example"
echo "   - Replace hardcoded links with url_for()"
echo ""
echo "4. Run the application in development mode:"
echo "   $ export FLASK_ENV=development"
echo "   $ python run.py"
echo ""
echo "5. For production, use:"
echo "   $ export FLASK_ENV=production"
echo "   $ gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app"
echo ""
echo "📚 Documentation:"
echo "   - FLASK_MIGRATION.md - Detailed migration guide"
echo "   - REFACTORING_SUMMARY.md - Overview of changes"
echo ""
echo "✨ Setup complete! Happy coding!"
```

## Line-By-Line Reconstruction Notes

### Line 5

```text
echo "🚀 UNanofabTools Flask Setup"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 6

```text
echo "=============================="
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 7

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 10

```text
if ! command -v python3 &> /dev/null; then
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 11

```text
    echo "❌ Python 3 is not installed. Please install Python 3 first."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 12

```text
    exit 1
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 13

```text
fi
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 15

```text
echo "✅ Python 3 found: $(python3 --version)"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 16

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 19

```text
if [ ! -d "venv" ]; then
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 20

```text
    echo "📦 Creating virtual environment..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 21

```text
    python3 -m venv venv
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 22

```text
    echo "✅ Virtual environment created"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 23

```text
else
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 24

```text
    echo "✅ Virtual environment already exists"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 25

```text
fi
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 27

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 28

```text
echo "🔄 Activating virtual environment..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 29

```text
source venv/bin/activate
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 31

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 32

```text
echo "📥 Installing dependencies..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 33

```text
pip install -r requirements.txt
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 35

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 36

```text
echo "⚙️  Checking configuration..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 37

```text
if [ ! -f ".env" ]; then
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 38

```text
    echo "📝 Creating .env file from template..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 39

```text
    cp .env.example .env
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 40

```text
    echo "⚠️  IMPORTANT: Edit .env file with your configuration!"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 41

```text
    echo "   - Set your SECRET_KEY"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 42

```text
    echo "   - Configure SSL certificate paths"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 43

```text
    echo "   - Set Duo Security credentials"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 44

```text
    echo "   - Adjust other settings as needed"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 45

```text
    echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 46

```text
    read -p "Press Enter after you've edited .env file..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 47

```text
else
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 48

```text
    echo "✅ .env file exists"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 49

```text
fi
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 51

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 52

```text
echo "📁 Creating required directories..."
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 53

```text
mkdir -p app/templates
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 54

```text
mkdir -p app/static/js
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 55

```text
mkdir -p app/static/css
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 56

```text
mkdir -p uploads
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 57

```text
mkdir -p HSCDATA
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 58

```text
mkdir -p LogData/ALD/RF
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 59

```text
mkdir -p LogData/ALD/Pressure
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 60

```text
mkdir -p LogData/Paralyne/analog
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 61

```text
mkdir -p LogData/denton18/pumpdata
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 62

```text
mkdir -p logs
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 64

```text
echo "✅ Directories created"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 66

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 67

```text
echo "📋 Next Steps:"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 68

```text
echo "=============="
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 69

```text
echo "1. Move your HTML files to app/templates/"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 70

```text
echo "   $ mv *.html app/templates/"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 71

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 72

```text
echo "2. Move JavaScript files to app/static/js/"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 73

```text
echo "   $ mv HSCDATA/js/* app/static/js/"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 74

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 75

```text
echo "3. Update HTML templates to use Flask syntax"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 76

```text
echo "   - See app/templates/base.html for example"
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 77

```text
echo "   - See app/templates/login_example.html for example"
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 78

```text
echo "   - Replace hardcoded links with url_for()"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 79

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 80

```text
echo "4. Run the application in development mode:"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 81

```text
echo "   $ export FLASK_ENV=development"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 82

```text
echo "   $ python run.py"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 83

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 84

```text
echo "5. For production, use:"
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 85

```text
echo "   $ export FLASK_ENV=production"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 86

```text
echo "   $ gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 87

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 88

```text
echo "📚 Documentation:"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 89

```text
echo "   - FLASK_MIGRATION.md - Detailed migration guide"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 90

```text
echo "   - REFACTORING_SUMMARY.md - Overview of changes"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 91

```text
echo ""
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 92

```text
echo "✨ Setup complete! Happy coding!"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/setup.sh`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/setup.sh`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/setup.sh`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/setup.sh`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/setup.sh`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/setup.sh`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/setup.sh`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/setup.sh`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/setup.sh`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/setup.sh`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/setup.sh`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/setup.sh`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/setup.sh`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/setup.sh`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/setup.sh`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/setup.sh`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/setup.sh`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/setup.sh`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/setup.sh`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/setup.sh`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/setup.sh`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/setup.sh`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/setup.sh`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/setup.sh`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
