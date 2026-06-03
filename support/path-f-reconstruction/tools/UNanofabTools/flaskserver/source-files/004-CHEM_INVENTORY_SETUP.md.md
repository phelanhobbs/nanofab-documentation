

# Source Reconstruction: UNanofabTools/CHEM_INVENTORY_SETUP.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `CHEM_INVENTORY_SETUP.md`
- Lines read: `177`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `3e4decc11508f785`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# Chemical Inventory Quick Setup Guide

This guide will help you quickly set up the chemical inventory system on your Flask server.

## Prerequisites

- PostgreSQL 12 or higher installed
- Python 3.8 or higher
- Your Flask app already running

## Quick Start (5 minutes)

### 1. Install PostgreSQL (if not already installed)

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Run these commands:
CREATE DATABASE cheminventory;
CREATE USER chemadmin WITH PASSWORD 'ChangeThisPassword123';
GRANT ALL PRIVILEGES ON DATABASE cheminventory TO chemadmin;
\q
```

### 3. Configure Environment

Add to your `.env` file (or create it in the project root):

```bash
# Chemical Inventory Database
CHEM_PGHOST=localhost
CHEM_PGPORT=5432
CHEM_POSTGRES_DB=cheminventory
CHEM_POSTGRES_USER=chemadmin
CHEM_POSTGRES_PASSWORD=<redacted-secret-value>
```

### 4. Install Python Dependencies

```bash
pip install psycopg2-binary xlsxwriter
```

Or reinstall all requirements:
```bash
pip install -r requirements.txt
```

### 5. Initialize Database

```bash
python init_chem_db.py
```

You should see:
```
Chemical Inventory Database Initialization
==================================================
Connecting to: localhost:5432/cheminventory
Reading schema...
Executing schema...
✓ Database initialized successfully!
```

### 6. Start Your Flask App

```bash
python run.py
```

### 7. Access Chemical Inventory

Navigate to: `http://localhost:5000/chem/inventory` (or your server URL)

## Testing the Setup

### Add a Test Container

1. Go to `/chem/add`
2. Fill in:
   - Material Name: `Acetone`
   - Vendor: `Fisher Scientific`
   - Size: `500`
   - Unit: `mL`
   - Quantity: `1`
3. Click "Add Container(s)"
4. Go to `/chem/inventory` to see your new container with auto-generated barcode

### View Reports

1. Go to `/chem/report`
2. You should see summary statistics
3. Browse different report tabs

## Troubleshooting

### "Connection refused" or "could not connect to server"

PostgreSQL is not running. Start it:
```bash
brew services start postgresql@15  # macOS
sudo systemctl start postgresql    # Linux
```

### "FATAL: password authentication failed"

Check your password in `.env` matches what you set in step 2.

### "relation does not exist"

Database tables weren't created. Run:
```bash
python init_chem_db.py
```

### "ModuleNotFoundError: No module named 'psycopg2'"

Install dependencies:
```bash
pip install psycopg2-binary
```

### "OperationalError: FATAL: database does not exist"

Create the database (step 2):
```bash
psql postgres -c "CREATE DATABASE cheminventory;"
```

## Using an Existing Database

If you already have a chemical inventory database from the standalone app:

1. Update `.env` with your existing database credentials
2. Skip `init_chem_db.py` (tables already exist)
3. Start your Flask app - it will connect to your existing data

## Next Steps

- Add your existing chemicals
- Set up barcode scanner for inventory cycles
- Configure email notifications for expiring chemicals
- Export reports to Excel/CSV
- Print container labels with barcodes

## Need Help?

Check the full documentation in `FLASK_MIGRATION.md` for:
- Detailed setup instructions
- Database schema explanation
- Usage guide
- Advanced features
- Migration from standalone app

## Security Notes

⚠️ **Change the default password!** The example password `ChangeThisPassword123` is not secure.

⚠️ **Production deployment:** Use environment variables or secure secret management, never commit passwords to git.

⚠️ **Database backups:** Set up regular PostgreSQL backups for your chemical inventory data.
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Chemical Inventory Quick Setup Guide
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
This guide will help you quickly set up the chemical inventory system on your Flask server.
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 3 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
## Prerequisites
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
- PostgreSQL 12 or higher installed
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 7 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
- Python 3.8 or higher
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 8 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
- Your Flask app already running
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 9 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 10 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
## Quick Start (5 minutes)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 11 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 12 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
### 1. Install PostgreSQL (if not already installed)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 13 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
**macOS:**
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 15 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 16 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
brew install postgresql@15
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 17 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
brew services start postgresql@15
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 18 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 19 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
**Ubuntu/Debian:**
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 21 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 22 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
sudo apt-get update
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 23 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
sudo apt-get install postgresql postgresql-contrib
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 24 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
sudo systemctl start postgresql
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 25 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 26 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 27 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
### 2. Create Database
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 28 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 29 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 30 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
# Connect to PostgreSQL
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 31 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
psql postgres
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 32 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 33 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
# Run these commands:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 34 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
CREATE DATABASE cheminventory;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 35 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
CREATE USER chemadmin WITH PASSWORD 'ChangeThisPassword123';
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 36 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
GRANT ALL PRIVILEGES ON DATABASE cheminventory TO chemadmin;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 37 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
\q
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 38 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 39 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
### 3. Configure Environment
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 41 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 42 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
Add to your `.env` file (or create it in the project root):
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 43 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 44 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 45 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
# Chemical Inventory Database
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 46 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
CHEM_PGHOST=localhost
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 47 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
CHEM_PGPORT=5432
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 48 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
CHEM_POSTGRES_DB=cheminventory
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 49 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
CHEM_POSTGRES_USER=chemadmin
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 50 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
CHEM_POSTGRES_PASSWORD=<redacted-secret-value>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 51 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 52 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 53 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
### 4. Install Python Dependencies
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 54 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 55 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 56 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
pip install psycopg2-binary xlsxwriter
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 57 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 58 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
Or reinstall all requirements:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 60 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 61 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
pip install -r requirements.txt
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 62 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 63 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
### 5. Initialize Database
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 65 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 66 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 67 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
python init_chem_db.py
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 68 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 69 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
You should see:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 71 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 72 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
Chemical Inventory Database Initialization
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 73 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
==================================================
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 74 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
Connecting to: localhost:5432/cheminventory
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 75 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
Reading schema...
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 76 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
Executing schema...
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 77 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
✓ Database initialized successfully!
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 78 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 79 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 80 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
### 6. Start Your Flask App
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 81 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 82 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 83 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
python run.py
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 84 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 85 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 86 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
### 7. Access Chemical Inventory
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 87 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 88 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
Navigate to: `http://localhost:5000/chem/inventory` (or your server URL)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 89 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 90 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
## Testing the Setup
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 91 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 92 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
### Add a Test Container
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 93 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 94 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
1. Go to `/chem/add`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 95 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
2. Fill in:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 96 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
   - Material Name: `Acetone`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 97 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
   - Vendor: `Fisher Scientific`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 98 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
   - Size: `500`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 99 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
   - Unit: `mL`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 100 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
   - Quantity: `1`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 101 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
3. Click "Add Container(s)"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 102 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
4. Go to `/chem/inventory` to see your new container with auto-generated barcode
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 103 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 104 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
### View Reports
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 105 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 106 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
1. Go to `/chem/report`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 107 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
2. You should see summary statistics
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 108 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
3. Browse different report tabs
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 109 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 110 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
## Troubleshooting
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 111 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 112 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
### "Connection refused" or "could not connect to server"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 113 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 114 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
PostgreSQL is not running. Start it:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 115 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 116 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
brew services start postgresql@15  # macOS
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 117 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
sudo systemctl start postgresql    # Linux
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 118 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 119 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 120 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
### "FATAL: password authentication failed"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 121 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 122 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
Check your password in `.env` matches what you set in step 2.
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 123 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 124 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
### "relation does not exist"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 125 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
Database tables weren't created. Run:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 127 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 128 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
python init_chem_db.py
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 129 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 130 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 131 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
### "ModuleNotFoundError: No module named 'psycopg2'"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 132 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 133 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
Install dependencies:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 134 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 135 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
pip install psycopg2-binary
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 136 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 137 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 138 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
### "OperationalError: FATAL: database does not exist"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 139 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 140 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
Create the database (step 2):
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 141 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 142 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
psql postgres -c "CREATE DATABASE cheminventory;"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 143 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 144 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 145 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
## Using an Existing Database
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 146 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 147 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
If you already have a chemical inventory database from the standalone app:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 148 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 149 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
1. Update `.env` with your existing database credentials
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 150 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
2. Skip `init_chem_db.py` (tables already exist)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 151 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
3. Start your Flask app - it will connect to your existing data
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 152 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 153 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
## Next Steps
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 154 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 155 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
- Add your existing chemicals
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 156 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
- Set up barcode scanner for inventory cycles
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 157 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
- Configure email notifications for expiring chemicals
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 158 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
- Export reports to Excel/CSV
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 159 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
- Print container labels with barcodes
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 160 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 161 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
## Need Help?
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 162 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 163 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
Check the full documentation in `FLASK_MIGRATION.md` for:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 164 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
- Detailed setup instructions
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 165 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
- Database schema explanation
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 166 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
- Usage guide
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 167 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
- Advanced features
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 168 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
- Migration from standalone app
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 169 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 170 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
## Security Notes
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 171 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 172 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
⚠️ **Change the default password!** The example password `ChangeThisPassword123` is not secure.
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 173 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 174 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
⚠️ **Production deployment:** Use environment variables or secure secret management, never commit passwords to git.
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 175 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 176 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
⚠️ **Database backups:** Set up regular PostgreSQL backups for your chemical inventory data.
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_SETUP.md`, line 177 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/CHEM_INVENTORY_SETUP.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
