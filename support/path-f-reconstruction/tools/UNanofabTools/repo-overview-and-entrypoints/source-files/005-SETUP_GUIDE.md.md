

# Source Reconstruction: UNanofabTools/SETUP_GUIDE.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `SETUP_GUIDE.md`
- Lines read: `349`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `f6cf0dac1e5a59c1`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# 🚀 Flask Setup Guide - Step by Step

## ✅ What's Already Done

I've completed the following for you:
- ✅ Created all Flask application files (blueprints, services, models)
- ✅ Updated all HTML templates to use Flask/Jinja2 syntax
- ✅ Copied JavaScript files to `app/static/js/`
- ✅ Created `.env` file from template
- ✅ Set up proper directory structure

## 📋 Setup Steps (Follow These)

### Step 1: Install Python Dependencies

```bash
# Make sure you're in the project directory
cd /Users/phe/code/work/UNanofabTools

# Install all required packages
pip install -r requirements.txt
```

**Expected output:** You'll see packages being installed (Flask, Flask-Login, SQLAlchemy, etc.)

---

### Step 2: Configure Environment Variables

Edit the `.env` file with your settings:

```bash
# Open the .env file in your editor
nano .env
# or
code .env
# or
open -e .env
```

**Required changes:**

1. **SECRET_KEY** - Generate a random key:
   ```bash
   python3 -c 'import secrets; print(secrets.token_hex(32))'
   ```
   Copy the output and paste it in `.env`

2. **DEBUG_MODE** - Set to `True` for testing, `False` for production
   ```
   DEBUG_MODE=True
   ```

3. **HOST** - For development, use localhost:
   ```
   HOST=localhost
   ```

4. **SSL Certificate Paths** - Point to your SSL certificates:
   ```
   SSL_CERT_PATH=/path/to/your/cert.pem
   SSL_KEY_PATH=/path/to/your/key.pem
   ```

5. **Duo Security** - Add your Duo credentials:
   ```
   DUO_IKEY=your-duo-integration-key
   DUO_SKEY=your-duo-secret-key
   DUO_HOST=your-duo-api-host
   ```

**Save the file** when done (Ctrl+X, Y, Enter in nano)

---

### Step 3: Verify Directory Structure

Check that everything is in place:

```bash
# Check application structure
ls -la app/
ls -la app/blueprints/
ls -la app/services/
ls -la app/templates/
ls -la app/static/js/

# Check configuration
ls -la config/
cat .env | grep -v "^#"
```

You should see:
- ✅ `app/` with `__init__.py`, `blueprints/`, `services/`, `models/`, `templates/`, `static/`
- ✅ `config/config.py`
- ✅ `.env` file with your configuration
- ✅ `run.py` entry point

---

### Step 4: Initialize the Database

The Flask app will automatically create database tables on first run, but let's verify your existing databases are accessible:

```bash
# Check if your databases exist
ls -la *.db
```

You should see:
- `signininfo.db` - User accounts
- `sessioninfo.db` - Active sessions (will be recreated)
- `tasks.db` - Task management

**Good news:** The new Flask models are 100% compatible with your existing databases!

---

### Step 5: Run the Application

For development/testing:

```bash
# Set environment to development
export FLASK_ENV=development

# Run the Flask application
python run.py
```

**Expected output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in production.
 * Running on https://localhost:443
```

---

### Step 6: Test the Application

Open your browser and navigate to:
- `https://localhost:443/` - Home page
- `https://localhost:443/login` - Login page
- `https://localhost:443/machines` - Machines page

**Note:** Your browser may show a security warning about the SSL certificate in development mode. This is normal - click "Advanced" and "Proceed" to continue.

---

### Step 7: Test Key Features

1. **Login**
   - Navigate to `/login`
   - Enter your username and password
   - You should be redirected to `/tasks` after successful login

2. **View Machines**
   - Navigate to `/machines`
   - Click on any machine (e.g., ALD)
   - Verify data displays correctly

3. **Task Management**
   - Navigate to `/tasks`
   - Try creating a task if you have permissions
   - Try claiming a task

4. **Admin Panel** (if you're an admin)
   - Navigate to `/adminpanel`
   - Verify user list displays

---

## 🐛 Troubleshooting

### Problem: Import errors or "Module not found"

**Solution:**
```bash
pip install -r requirements.txt
```

### Problem: "Template not found"

**Solution:** Make sure HTML files are in `app/templates/`:
```bash
ls app/templates/
```

### Problem: Static files (JavaScript) not loading

**Solution:** Verify JavaScript files are in `app/static/js/`:
```bash
ls app/static/js/
```

### Problem: Database errors

**Solution:** The Flask app uses SQLAlchemy but is compatible with your existing SQLite databases. If you encounter issues:
```bash
# Backup your databases first
cp signininfo.db signininfo.db.backup
cp tasks.db tasks.db.backup

# Then restart the application - it will recreate sessioninfo.db
python run.py
```

### Problem: SSL certificate errors

**Solution for development:** Set `DEBUG_MODE=True` in `.env` and the app will run with relaxed SSL requirements.

**Solution for production:** Make sure your SSL certificate paths are correct:
```bash
# Check if certificates exist
ls -la /path/to/cert.pem
ls -la /path/to/key.pem
```

### Problem: Port 443 already in use

**Solution:** Change the port in `.env`:
```
PORT=8443
```
Then access the site at `https://localhost:8443`

### Problem: Duo 2FA not working

**Solution for testing:** Set `DEBUG_MODE=True` in `.env` to skip 2FA during development.

**Solution for production:** Verify your Duo credentials in `.env`:
```bash
grep DUO .env
```

---

## 🎯 Next Steps After Setup

Once the application is running successfully:

1. **Test All Features**
   - Login/logout
   - Task management
   - Machine data viewing
   - Admin panel (if admin)
   - Raspberry Pi data collection endpoints

2. **Deploy to Production**
   - Update `.env` with production settings
   - Set `DEBUG_MODE=False`
   - Set `FLASK_ENV=production`
   - Use a production WSGI server (see below)

3. **Use a Production Server**
   ```bash
   # Install Gunicorn
   pip install gunicorn

   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:443 \
     --certfile=/path/to/cert.pem \
     --keyfile=/path/to/key.pem \
     run:app
   ```

---

## 📚 Quick Command Reference

```bash
# Development mode
export FLASK_ENV=development
python run.py

# Production mode
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app

# Check logs
tail -f logs/untools.log  # (in production)

# Install new packages
pip install package-name
pip freeze > requirements.txt  # Update requirements

# Database backup
cp *.db backups/
```

---

## ✨ What Changed from Old Server

| Old (HSCDisplayerServer.py) | New (Flask) |
|------------------------------|-------------|
| One 2660-line file | 14+ organized files |
| Manual routing with if/elif | Flask blueprints with decorators |
| Direct SQLite queries | SQLAlchemy ORM |
| Manual session management | Flask-Login |
| Inline HTML generation | Jinja2 templates |
| Manual SSL setup | Flask/Gunicorn SSL support |

---

## 🎉 Success Checklist

- [ ] All packages installed (`pip install -r requirements.txt`)
- [ ] `.env` file configured with your settings
- [ ] Application starts without errors
- [ ] Can access `/login` page in browser
- [ ] Can log in with existing credentials
- [ ] Can view machines data
- [ ] Can manage tasks
- [ ] JavaScript files load correctly
- [ ] Raspberry Pi endpoints still work

---

## 🆘 Getting Help

If you encounter any issues:

1. Check the error message in the terminal
2. Look at the troubleshooting section above
3. Review `FLASK_MIGRATION.md` for detailed information
4. Check Flask logs for detailed error information

**Common log locations:**
- Terminal output (development mode)
- `logs/untools.log` (production mode)

---

## 🎊 You're Ready!

Your Flask application is now set up and ready to use. The migration from the monolithic server is complete, and you have a modern, maintainable application structure.

**Key improvements:**
- ✅ Organized, modular code
- ✅ Easy to maintain and extend
- ✅ Production-ready
- ✅ All features preserved
- ✅ Better security
- ✅ Better performance potential

Enjoy your refactored application! 🚀
```

## Line-By-Line Reconstruction Notes

### Line 5

```text
I've completed the following for you:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 6

```text
- ✅ Created all Flask application files (blueprints, services, models)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 7

```text
- ✅ Updated all HTML templates to use Flask/Jinja2 syntax
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 8

```text
- ✅ Copied JavaScript files to `app/static/js/`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
- ✅ Created `.env` file from template
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 10

```text
- ✅ Set up proper directory structure
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 16

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 18

```text
cd /Users/phe/code/work/UNanofabTools
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 21

```text
pip install -r requirements.txt
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 26

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 30

```text
Edit the `.env` file with your settings:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 32

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 34

```text
nano .env
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 36

```text
code .env
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
open -e .env
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 43

```text
1. **SECRET_KEY** - Generate a random key:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 44

```text
   ```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 45

```text
   python3 -c 'import secrets; print(secrets.token_hex(32))'
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 46

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
   Copy the output and paste it in `.env`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 49

```text
2. **DEBUG_MODE** - Set to `True` for testing, `False` for production
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 51

```text
   DEBUG_MODE=True
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 52

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 54

```text
3. **HOST** - For development, use localhost:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 55

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 56

```text
   HOST=localhost
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 59

```text
4. **SSL Certificate Paths** - Point to your SSL certificates:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 60

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 61

```text
   SSL_CERT_PATH=/path/to/your/cert.pem
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
   SSL_KEY_PATH=/path/to/your/key.pem
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 65

```text
5. **Duo Security** - Add your Duo credentials:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 66

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
   DUO_IKEY=your-duo-integration-key
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 68

```text
   DUO_SKEY=your-duo-secret-key
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 69

```text
   DUO_HOST=your-duo-api-host
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 70

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 74

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 78

```text
Check that everything is in place:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 80

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 82

```text
ls -la app/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 83

```text
ls -la app/blueprints/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
ls -la app/services/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 85

```text
ls -la app/templates/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 86

```text
ls -la app/static/js/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 89

```text
ls -la config/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 90

```text
cat .env | grep -v "^#"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 91

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 93

```text
You should see:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 94

```text
- ✅ `app/` with `__init__.py`, `blueprints/`, `services/`, `models/`, `templates/`, `static/`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
- ✅ `config/config.py`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 96

```text
- ✅ `.env` file with your configuration
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 97

```text
- ✅ `run.py` entry point
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 103

```text
The Flask app will automatically create database tables on first run, but let's verify your existing databases are accessible:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 105

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 107

```text
ls -la *.db
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 108

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 110

```text
You should see:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 111

```text
- `signininfo.db` - User accounts
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 112

```text
- `sessioninfo.db` - Active sessions (will be recreated)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 113

```text
- `tasks.db` - Task management
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 117

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 121

```text
For development/testing:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 123

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 125

```text
export FLASK_ENV=development
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 128

```text
python run.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 129

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 132

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 135

```text
WARNING: This is a development server. Do not use it in production.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 137

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 139

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 143

```text
Open your browser and navigate to:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 144

```text
- `https://localhost:443/` - Home page
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 145

```text
- `https://localhost:443/login` - Login page
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 146

```text
- `https://localhost:443/machines` - Machines page
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 150

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 154

```text
1. **Login**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 155

```text
   - Navigate to `/login`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 156

```text
   - Enter your username and password
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 157

```text
   - You should be redirected to `/tasks` after successful login
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 159

```text
2. **View Machines**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 160

```text
   - Navigate to `/machines`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 161

```text
   - Click on any machine (e.g., ALD)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 162

```text
   - Verify data displays correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 164

```text
3. **Task Management**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 165

```text
   - Navigate to `/tasks`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 166

```text
   - Try creating a task if you have permissions
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 167

```text
   - Try claiming a task
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 169

```text
4. **Admin Panel** (if you're an admin)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 170

```text
   - Navigate to `/adminpanel`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 171

```text
   - Verify user list displays
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 173

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 180

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 181

```text
pip install -r requirements.txt
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 182

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 187

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 188

```text
ls app/templates/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 189

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 194

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 195

```text
ls app/static/js/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 196

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 201

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 203

```text
cp signininfo.db signininfo.db.backup
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 204

```text
cp tasks.db tasks.db.backup
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 207

```text
python run.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 208

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 215

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 217

```text
ls -la /path/to/cert.pem
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 218

```text
ls -la /path/to/key.pem
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 219

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 224

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 225

```text
PORT=8443
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 226

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 227

```text
Then access the site at `https://localhost:8443`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 234

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 235

```text
grep DUO .env
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 236

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 238

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 242

```text
Once the application is running successfully:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 244

```text
1. **Test All Features**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 245

```text
   - Login/logout
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 246

```text
   - Task management
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 247

```text
   - Machine data viewing
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 248

```text
   - Admin panel (if admin)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 249

```text
   - Raspberry Pi data collection endpoints
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 251

```text
2. **Deploy to Production**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 252

```text
   - Update `.env` with production settings
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 253

```text
   - Set `DEBUG_MODE=False`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 254

```text
   - Set `FLASK_ENV=production`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 255

```text
   - Use a production WSGI server (see below)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 257

```text
3. **Use a Production Server**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 258

```text
   ```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 260

```text
   pip install gunicorn
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 263

```text
   gunicorn -w 4 -b 0.0.0.0:443 \
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 264

```text
     --certfile=/path/to/cert.pem \
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 265

```text
     --keyfile=/path/to/key.pem \
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 266

```text
     run:app
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 267

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 269

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 273

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 275

```text
export FLASK_ENV=development
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 276

```text
python run.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 279

```text
export FLASK_ENV=production
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 280

```text
gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 283

```text
tail -f logs/untools.log  # (in production)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 286

```text
pip install package-name
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 287

```text
pip freeze > requirements.txt  # Update requirements
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 290

```text
cp *.db backups/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 291

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 293

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 297

```text
| Old (HSCDisplayerServer.py) | New (Flask) |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 298

```text
|------------------------------|-------------|
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 299

```text
| One 2660-line file | 14+ organized files |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 300

```text
| Manual routing with if/elif | Flask blueprints with decorators |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 301

```text
| Direct SQLite queries | SQLAlchemy ORM |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 302

```text
| Manual session management | Flask-Login |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 303

```text
| Inline HTML generation | Jinja2 templates |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 304

```text
| Manual SSL setup | Flask/Gunicorn SSL support |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 306

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 310

```text
- [ ] All packages installed (`pip install -r requirements.txt`)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 311

```text
- [ ] `.env` file configured with your settings
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 312

```text
- [ ] Application starts without errors
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 313

```text
- [ ] Can access `/login` page in browser
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 314

```text
- [ ] Can log in with existing credentials
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 315

```text
- [ ] Can view machines data
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 316

```text
- [ ] Can manage tasks
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 317

```text
- [ ] JavaScript files load correctly
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 318

```text
- [ ] Raspberry Pi endpoints still work
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 320

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 324

```text
If you encounter any issues:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 326

```text
1. Check the error message in the terminal
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 327

```text
2. Look at the troubleshooting section above
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 328

```text
3. Review `FLASK_MIGRATION.md` for detailed information
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 329

```text
4. Check Flask logs for detailed error information
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 332

```text
- Terminal output (development mode)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 333

```text
- `logs/untools.log` (production mode)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 335

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 339

```text
Your Flask application is now set up and ready to use. The migration from the monolithic server is complete, and you have a modern, maintainable application structure.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 342

```text
- ✅ Organized, modular code
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 343

```text
- ✅ Easy to maintain and extend
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 344

```text
- ✅ Production-ready
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 345

```text
- ✅ All features preserved
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 346

```text
- ✅ Better security
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 347

```text
- ✅ Better performance potential
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 349

```text
Enjoy your refactored application! 🚀
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/SETUP_GUIDE.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
