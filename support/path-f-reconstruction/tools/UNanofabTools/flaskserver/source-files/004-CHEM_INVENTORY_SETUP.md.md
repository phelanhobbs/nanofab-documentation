

# Source Reconstruction: UNanofabTools/CHEM_INVENTORY_SETUP.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

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

### Line 3

```text
This guide will help you quickly set up the chemical inventory system on your Flask server.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 7

```text
- PostgreSQL 12 or higher installed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 8

```text
- Python 3.8 or higher
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
- Your Flask app already running
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 16

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 17

```text
brew install postgresql@15
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 18

```text
brew services start postgresql@15
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 19

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 23

```text
sudo apt-get update
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 24

```text
sudo apt-get install postgresql postgresql-contrib
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 25

```text
sudo systemctl start postgresql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 26

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 30

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 32

```text
psql postgres
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 35

```text
CREATE DATABASE cheminventory;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 36

```text
CREATE USER chemadmin WITH PASSWORD 'ChangeThisPassword123';
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 37

```text
GRANT ALL PRIVILEGES ON DATABASE cheminventory TO chemadmin;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
\q
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 43

```text
Add to your `.env` file (or create it in the project root):
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 45

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
CHEM_PGHOST=localhost
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 48

```text
CHEM_PGPORT=5432
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 49

```text
CHEM_POSTGRES_DB=cheminventory
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
CHEM_POSTGRES_USER=chemadmin
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 51

```text
CHEM_POSTGRES_PASSWORD=<redacted-secret-value>
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 52

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 56

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
pip install psycopg2-binary xlsxwriter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 58

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 60

```text
Or reinstall all requirements:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 61

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
pip install -r requirements.txt
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 68

```text
python init_chem_db.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 69

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 71

```text
You should see:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 72

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 73

```text
Chemical Inventory Database Initialization
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 74

```text
==================================================
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 75

```text
Connecting to: localhost:5432/cheminventory
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 76

```text
Reading schema...
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 77

```text
Executing schema...
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 78

```text
✓ Database initialized successfully!
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 79

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 83

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
python run.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 85

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 89

```text
Navigate to: `http://localhost:5000/chem/inventory` (or your server URL)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
1. Go to `/chem/add`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 96

```text
2. Fill in:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 97

```text
   - Material Name: `Acetone`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 98

```text
   - Vendor: `Fisher Scientific`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
   - Size: `500`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 100

```text
   - Unit: `mL`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 101

```text
   - Quantity: `1`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 102

```text
3. Click "Add Container(s)"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 103

```text
4. Go to `/chem/inventory` to see your new container with auto-generated barcode
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 107

```text
1. Go to `/chem/report`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 108

```text
2. You should see summary statistics
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 109

```text
3. Browse different report tabs
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 115

```text
PostgreSQL is not running. Start it:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 116

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 117

```text
brew services start postgresql@15  # macOS
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 118

```text
sudo systemctl start postgresql    # Linux
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 119

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 123

```text
Check your password in `.env` matches what you set in step 2.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 127

```text
Database tables weren't created. Run:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 128

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 129

```text
python init_chem_db.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 130

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 134

```text
Install dependencies:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 135

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 136

```text
pip install psycopg2-binary
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 137

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 141

```text
Create the database (step 2):
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 142

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 143

```text
psql postgres -c "CREATE DATABASE cheminventory;"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 144

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 148

```text
If you already have a chemical inventory database from the standalone app:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 150

```text
1. Update `.env` with your existing database credentials
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 151

```text
2. Skip `init_chem_db.py` (tables already exist)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 152

```text
3. Start your Flask app - it will connect to your existing data
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 156

```text
- Add your existing chemicals
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 157

```text
- Set up barcode scanner for inventory cycles
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 158

```text
- Configure email notifications for expiring chemicals
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 159

```text
- Export reports to Excel/CSV
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 160

```text
- Print container labels with barcodes
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 164

```text
Check the full documentation in `FLASK_MIGRATION.md` for:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 165

```text
- Detailed setup instructions
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 166

```text
- Database schema explanation
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 167

```text
- Usage guide
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 168

```text
- Advanced features
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 169

```text
- Migration from standalone app
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 173

```text
⚠️ **Change the default password!** The example password `ChangeThisPassword123` is not secure.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 175

```text
⚠️ **Production deployment:** Use environment variables or secure secret management, never commit passwords to git.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 177

```text
⚠️ **Database backups:** Set up regular PostgreSQL backups for your chemical inventory data.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



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
