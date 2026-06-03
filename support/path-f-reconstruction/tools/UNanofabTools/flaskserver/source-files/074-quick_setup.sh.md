

# Source Reconstruction: UNanofabTools/quick_setup.sh

- Repository: `UNanofabTools`
- Relative path: `quick_setup.sh`
- Lines read: `142`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `1a8b492b7583802f`
- Code fence language: `sh`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```sh
#!/bin/bash

# Flask Application Quick Setup Script
# This automates most of the setup process

set -e  # Exit on error

echo "╔════════════════════════════════════════════════╗"
echo "║   UNanofabTools Flask Setup Script           ║"
echo "║   Automating your migration to Flask          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "run.py" ]; then
    echo -e "${RED}❌ Error: run.py not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found project root${NC}"
echo ""

# Step 1: Check Python
echo "Step 1: Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "Please install Python 3 and try again"
    exit 1
fi
echo -e "${GREEN}✅ Python found: $(python3 --version)${NC}"
echo ""

# Step 2: Install dependencies
echo "Step 2: Installing Python dependencies..."
echo "This may take a few minutes..."
pip3 install -r requirements.txt > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Some dependencies may have failed. Check manually with: pip3 install -r requirements.txt${NC}"
fi
echo ""

# Step 3: Check .env file
echo "Step 3: Checking configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found, creating from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: You must edit .env with your settings!${NC}"
    NEEDS_ENV_EDIT=true
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Step 4: Create necessary directories
echo "Step 4: Creating directories..."
mkdir -p app/static/js app/static/css
mkdir -p uploads
mkdir -p HSCDATA
mkdir -p LogData/{ALD/{RF,Pressure},Paralyne/analog,denton18/pumpdata}
mkdir -p logs
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 5: Check JavaScript files
echo "Step 5: Checking static files..."
if [ -d "HSCDATA/js" ] && [ "$(ls -A HSCDATA/js)" ]; then
    echo "Copying JavaScript files..."
    cp HSCDATA/js/* app/static/js/ 2>/dev/null || true
    echo -e "${GREEN}✅ JavaScript files copied${NC}"
else
    echo -e "${YELLOW}⚠️  HSCDATA/js directory is empty or doesn't exist${NC}"
    echo "   Static files should be placed in app/static/js/"
fi
echo ""

# Step 6: Check databases
echo "Step 6: Checking databases..."
DB_COUNT=0
for db in signininfo.db sessioninfo.db tasks.db; do
    if [ -f "$db" ]; then
        echo -e "  ${GREEN}✅ Found $db${NC}"
        ((DB_COUNT++))
    else
        echo -e "  ${YELLOW}⚠️  $db not found (will be created on first run)${NC}"
    fi
done
echo ""

# Summary
echo "╔════════════════════════════════════════════════╗"
echo "║            Setup Complete Summary              ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Project structure is ready${NC}"
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

if [ "$NEEDS_ENV_EDIT" = true ]; then
    echo -e "${YELLOW}⚠️  NEXT STEP REQUIRED:${NC}"
    echo "   1. Edit .env file with your configuration:"
    echo "      - SECRET_KEY (generate with: python3 -c 'import secrets; print(secrets.token_hex(32))')"
    echo "      - DEBUG_MODE=True (for development)"
    echo "      - HOST=localhost (for development)"
    echo "      - SSL certificate paths"
    echo "      - Duo credentials"
    echo ""
    echo "   2. Then run the application:"
    echo "      export FLASK_ENV=development"
    echo "      python3 run.py"
else
    echo -e "${GREEN}You can now start the application:${NC}"
    echo "   export FLASK_ENV=development"
    echo "   python3 run.py"
fi
echo ""

echo "📚 Documentation:"
echo "   - SETUP_GUIDE.md - Detailed setup instructions"
echo "   - FLASK_MIGRATION.md - Migration guide"
echo "   - QUICK_START.md - Quick reference"
echo ""

# Check if SECRET_KEY needs to be updated
if grep -q "your-secret-key-here" .env 2>/dev/null; then
    echo -e "${YELLOW}🔑 Generate a SECRET_KEY:${NC}"
    echo "   Run this command and paste the output into .env:"
    echo "   python3 -c 'import secrets; print(secrets.token_hex(32))'"
    echo ""
fi

echo -e "${GREEN}✨ Setup complete!${NC}"
echo "For detailed instructions, see SETUP_GUIDE.md"
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
#!/bin/bash
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
# Flask Application Quick Setup Script
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# This automates most of the setup process
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 5 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
set -e  # Exit on error
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 6 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 7 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
echo "╔════════════════════════════════════════════════╗"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 8 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
echo "║   UNanofabTools Flask Setup Script           ║"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 9 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
echo "║   Automating your migration to Flask          ║"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 10 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
echo "╚════════════════════════════════════════════════╝"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 11 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 12 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
# Colors for output
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 14 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
RED='\033[0;31m'
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 15 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
GREEN='\033[0;32m'
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 16 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
YELLOW='\033[1;33m'
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 17 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
NC='\033[0m' # No Color
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 18 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 19 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
# Check if we're in the right directory
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 20 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
if [ ! -f "run.py" ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 21 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    echo -e "${RED}❌ Error: run.py not found. Please run this script from the project root.${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 22 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
    exit 1
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 23 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 24 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 25 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
echo -e "${GREEN}✅ Found project root${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 26 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 27 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 28 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
# Step 1: Check Python
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 29 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
echo "Step 1: Checking Python installation..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 30 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
if ! command -v python3 &> /dev/null; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 31 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    echo -e "${RED}❌ Python 3 is not installed${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 32 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    echo "Please install Python 3 and try again"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 33 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    exit 1
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 34 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 35 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
echo -e "${GREEN}✅ Python found: $(python3 --version)${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 37 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
# Step 2: Install dependencies
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 39 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
echo "Step 2: Installing Python dependencies..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 40 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
echo "This may take a few minutes..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 41 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
pip3 install -r requirements.txt > /dev/null 2>&1
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 42 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
if [ $? -eq 0 ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 43 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    echo -e "${GREEN}✅ Dependencies installed${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
else
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 45 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    echo -e "${YELLOW}⚠️  Some dependencies may have failed. Check manually with: pip3 install -r requirements.txt${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 46 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 47 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 48 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
# Step 3: Check .env file
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 50 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
echo "Step 3: Checking configuration..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 51 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
if [ ! -f ".env" ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 52 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
    echo -e "${YELLOW}⚠️  .env file not found, creating from template...${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 53 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
    cp .env.example .env
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 54 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    echo -e "${GREEN}✅ .env file created${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 55 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
    echo -e "${YELLOW}⚠️  IMPORTANT: You must edit .env with your settings!${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 56 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    NEEDS_ENV_EDIT=true
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 57 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
else
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 58 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    echo -e "${GREEN}✅ .env file exists${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 59 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 60 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 61 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 62 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
# Step 4: Create necessary directories
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 63 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
echo "Step 4: Creating directories..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 64 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
mkdir -p app/static/js app/static/css
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 65 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
mkdir -p uploads
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 66 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
mkdir -p HSCDATA
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 67 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
mkdir -p LogData/{ALD/{RF,Pressure},Paralyne/analog,denton18/pumpdata}
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 68 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
mkdir -p logs
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 69 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
echo -e "${GREEN}✅ Directories created${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 70 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 71 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
# Step 5: Check JavaScript files
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 73 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
echo "Step 5: Checking static files..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 74 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
if [ -d "HSCDATA/js" ] && [ "$(ls -A HSCDATA/js)" ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 75 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
    echo "Copying JavaScript files..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 76 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
    cp HSCDATA/js/* app/static/js/ 2>/dev/null || true
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 77 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
    echo -e "${GREEN}✅ JavaScript files copied${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 78 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
else
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 79 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    echo -e "${YELLOW}⚠️  HSCDATA/js directory is empty or doesn't exist${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 80 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    echo "   Static files should be placed in app/static/js/"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 81 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 82 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 83 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 84 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
# Step 6: Check databases
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 85 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
echo "Step 6: Checking databases..."
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 86 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
DB_COUNT=0
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 87 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
for db in signininfo.db sessioninfo.db tasks.db; do
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 88 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
    if [ -f "$db" ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 89 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        echo -e "  ${GREEN}✅ Found $db${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 90 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
        ((DB_COUNT++))
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 91 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
    else
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 92 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
        echo -e "  ${YELLOW}⚠️  $db not found (will be created on first run)${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 93 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
    fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 94 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
done
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 95 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 96 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 97 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
# Summary
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 98 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
echo "╔════════════════════════════════════════════════╗"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 99 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
echo "║            Setup Complete Summary              ║"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 100 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
echo "╚════════════════════════════════════════════════╝"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 101 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 102 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
echo -e "${GREEN}✅ Project structure is ready${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 103 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
echo -e "${GREEN}✅ Dependencies installed${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 104 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
echo -e "${GREEN}✅ Directories created${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 105 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 106 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 107 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
if [ "$NEEDS_ENV_EDIT" = true ]; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 108 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    echo -e "${YELLOW}⚠️  NEXT STEP REQUIRED:${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 109 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
    echo "   1. Edit .env file with your configuration:"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 110 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
    echo "      - SECRET_KEY (generate with: python3 -c 'import secrets; print(secrets.token_hex(32))')"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 111 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
    echo "      - DEBUG_MODE=True (for development)"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 112 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
    echo "      - HOST=localhost (for development)"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 113 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
    echo "      - SSL certificate paths"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 114 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
    echo "      - Duo credentials"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 115 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
    echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 116 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
    echo "   2. Then run the application:"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 117 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
    echo "      export FLASK_ENV=development"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 118 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
    echo "      python3 run.py"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 119 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
else
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 120 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
    echo -e "${GREEN}You can now start the application:${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 121 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
    echo "   export FLASK_ENV=development"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 122 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
    echo "   python3 run.py"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 123 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 124 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 125 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
echo "📚 Documentation:"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 127 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
echo "   - SETUP_GUIDE.md - Detailed setup instructions"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 128 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
echo "   - FLASK_MIGRATION.md - Migration guide"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 129 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
echo "   - QUICK_START.md - Quick reference"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 130 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 131 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 132 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
# Check if SECRET_KEY needs to be updated
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 133 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
if grep -q "your-secret-key-here" .env 2>/dev/null; then
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 134 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
    echo -e "${YELLOW}🔑 Generate a SECRET_KEY:${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 135 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
    echo "   Run this command and paste the output into .env:"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 136 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
    echo "   python3 -c 'import secrets; print(secrets.token_hex(32))'"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 137 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
    echo ""
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 138 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
fi
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 139 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 140 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
echo -e "${GREEN}✨ Setup complete!${NC}"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 141 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
echo "For detailed instructions, see SETUP_GUIDE.md"
```

Reconstruction rule: in `UNanofabTools/quick_setup.sh`, line 142 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/quick_setup.sh`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/quick_setup.sh`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/quick_setup.sh`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/quick_setup.sh`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/quick_setup.sh`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/quick_setup.sh`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/quick_setup.sh`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/quick_setup.sh`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/quick_setup.sh`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/quick_setup.sh`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/quick_setup.sh`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/quick_setup.sh`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/quick_setup.sh`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/quick_setup.sh`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/quick_setup.sh`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/quick_setup.sh`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/quick_setup.sh`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/quick_setup.sh`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/quick_setup.sh`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/quick_setup.sh`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/quick_setup.sh`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/quick_setup.sh`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/quick_setup.sh`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/quick_setup.sh`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
