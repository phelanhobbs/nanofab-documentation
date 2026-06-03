

# Source Reconstruction: UNanofabTools/QUICK_START.md

- Repository: `UNanofabTools`
- Relative path: `QUICK_START.md`
- Lines read: `206`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `c647e6ba7c6eede5`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# Flask Refactoring Quick Reference

## 🎉 Refactoring Complete!

Your 2660-line `HSCDisplayerServer.py` has been successfully refactored into a modern Flask application.

## 📁 New File Structure

```
app/
├── __init__.py              ← Flask app factory
├── blueprints/              ← Route handlers (5 files)
│   ├── admin.py            ← Admin panel
│   ├── api.py              ← Raspberry Pi APIs
│   ├── auth.py             ← Login/signup/logout
│   ├── machines.py         ← Machine data viewing
│   └── tasks.py            ← Task management
├── models/                  ← Database models
│   └── __init__.py         ← User, Session, Task models
├── services/                ← Business logic (4 files)
│   ├── admin_service.py    ← User management
│   ├── auth_service.py     ← Authentication & Duo
│   ├── data_service.py     ← CSV/graph processing
│   └── task_service.py     ← Task operations
├── templates/               ← HTML templates (Jinja2)
└── static/                  ← CSS, JavaScript, images
    ├── css/
    └── js/
```

## 🚀 Quick Start

```bash
# 1. Run the automated setup
./setup.sh

# 2. Move your HTML files
mv *.html app/templates/

# 3. Move JavaScript files
mv HSCDATA/js/* app/static/js/

# 4. Edit .env with your settings
nano .env

# 5. Run the app
export FLASK_ENV=development
python run.py
```

## 🔧 Configuration (.env file)

Must configure:
- `SECRET_KEY` - Generate a random key
- `SSL_CERT_PATH` - Path to your SSL certificate
- `SSL_KEY_PATH` - Path to your SSL key
- `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST` - Your Duo credentials

## 📝 Template Updates Needed

Update your HTML files with Flask syntax:

| Old | New |
|-----|-----|
| `href="/tasks"` | `href="{{ url_for('tasks.index') }}"` |
| `href="/login"` | `href="{{ url_for('auth.login') }}"` |
| `src="/js/graph.js"` | `src="{{ url_for('static', filename='js/graph.js') }}"` |
| `action="/createtasks"` | `action="{{ url_for('tasks.create_task') }}"` |

See `app/templates/base.html` for a complete example.

## 🗺️ Route Mapping

| Old Path | New Blueprint.Route |
|----------|---------------------|
| `/login` | `auth.login` |
| `/signup` | `auth.signup` |
| `/logout` | `auth.logout` |
| `/tasks` | `tasks.index` |
| `/createtasks` | `tasks.create_task` |
| `/adminpanel` | `admin.admin_panel` |
| `/ald` | `machines.ald` |
| `/ebeam` | `machines.ebeam` |
| `/sdsanalog` | `api.sds_analog` |

## 📦 Dependencies

All required packages are in `requirements.txt`:
- Flask - Web framework
- Flask-Login - User session management
- Flask-SQLAlchemy - Database ORM
- Flask-Bcrypt - Password hashing
- duo-client - Two-factor authentication
- pandas - Data processing

## 🔒 Security Features

✅ Bcrypt password hashing
✅ Session management with Flask-Login
✅ CSRF protection (Flask built-in)
✅ Input sanitization
✅ SSL/HTTPS support
✅ Duo 2FA integration

## 🎯 Benefits

**Before:**
- 2660 lines in one file
- Hard to maintain
- Hard to test
- Hard to scale

**After:**
- ~1200 lines split across 14 files
- Easy to maintain
- Easy to test individual components
- Production-ready with WSGI support

## 🆘 Troubleshooting

**Can't import Flask modules?**
```bash
pip install -r requirements.txt
```

**Templates not found?**
```bash
# Make sure HTML files are in app/templates/
ls app/templates/
```

**Static files not loading?**
```bash
# Make sure JS files are in app/static/js/
ls app/static/js/
```

**Database errors?**
The new models are compatible with your existing SQLite databases. No migration needed!

## 📚 Documentation

- `FLASK_MIGRATION.md` - Detailed step-by-step migration guide
- `REFACTORING_SUMMARY.md` - Complete overview of changes
- `run.py` - Application entry point
- Flask Docs: https://flask.palletsprojects.com/

## ✅ What's Preserved

Every feature from the original server:
- ✅ User authentication with Duo 2FA
- ✅ Task management system
- ✅ Admin panel
- ✅ All machine data viewing
- ✅ CSV processing and graphing
- ✅ Raspberry Pi data collection
- ✅ File uploads/downloads
- ✅ Session management
- ✅ SSL support

## 🎓 Learning Resources

**Flask Basics:**
- Blueprints: https://flask.palletsprojects.com/en/latest/blueprints/
- Templates: https://flask.palletsprojects.com/en/latest/templating/
- SQLAlchemy: https://flask-sqlalchemy.palletsprojects.com/

**Next Steps:**
1. Get familiar with Flask routing
2. Understand Jinja2 templates
3. Learn about Flask blueprints
4. Explore SQLAlchemy ORM

## 💡 Pro Tips

**Development:**
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python run.py
```

**Production:**
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:443 \
  --certfile=cert.pem \
  --keyfile=key.pem \
  run:app
```

**Adding a new route:**
1. Add function to appropriate blueprint
2. Add `@blueprint.route('/path')` decorator
3. Return render_template() or jsonify()

**Adding a new feature:**
1. Add service function in `app/services/`
2. Add route in appropriate blueprint
3. Create/update template if needed

## 🎊 You're Ready!

The refactoring is complete and your application is ready to run. Just follow the Quick Start steps above and refer to the documentation files for detailed guidance.

Good luck! 🚀
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Flask Refactoring Quick Reference
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
## 🎉 Refactoring Complete!
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
Your 2660-line `HSCDisplayerServer.py` has been successfully refactored into a modern Flask application.
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 5 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
## 📁 New File Structure
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 9 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
app/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 10 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
├── __init__.py              ← Flask app factory
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 11 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
├── blueprints/              ← Route handlers (5 files)
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 12 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
│   ├── admin.py            ← Admin panel
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 13 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
│   ├── api.py              ← Raspberry Pi APIs
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 14 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
│   ├── auth.py             ← Login/signup/logout
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 15 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
│   ├── machines.py         ← Machine data viewing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 16 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
│   └── tasks.py            ← Task management
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 17 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
├── models/                  ← Database models
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 18 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
│   └── __init__.py         ← User, Session, Task models
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 19 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
├── services/                ← Business logic (4 files)
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 20 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
│   ├── admin_service.py    ← User management
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 21 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
│   ├── auth_service.py     ← Authentication & Duo
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 22 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
│   ├── data_service.py     ← CSV/graph processing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 23 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
│   └── task_service.py     ← Task operations
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 24 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
├── templates/               ← HTML templates (Jinja2)
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 25 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
└── static/                  ← CSS, JavaScript, images
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 26 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    ├── css/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 27 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    └── js/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 28 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 29 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 30 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
## 🚀 Quick Start
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 31 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 33 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
# 1. Run the automated setup
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 34 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
./setup.sh
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 35 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 36 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
# 2. Move your HTML files
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 37 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
mv *.html app/templates/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 38 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
# 3. Move JavaScript files
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 40 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
mv HSCDATA/js/* app/static/js/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 41 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 42 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
# 4. Edit .env with your settings
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 43 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
nano .env
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 44 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 45 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
# 5. Run the app
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 46 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
export FLASK_ENV=development
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 47 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
python run.py
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 48 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 49 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 50 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
## 🔧 Configuration (.env file)
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 51 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
Must configure:
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 53 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
- `SECRET_KEY` - Generate a random key
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 54 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
- `SSL_CERT_PATH` - Path to your SSL certificate
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 55 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
- `SSL_KEY_PATH` - Path to your SSL key
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 56 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
- `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST` - Your Duo credentials
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 57 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 58 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
## 📝 Template Updates Needed
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 59 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 60 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
Update your HTML files with Flask syntax:
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 61 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 62 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
| Old | New |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 63 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
|-----|-----|
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 64 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
| `href="/tasks"` | `href="{{ url_for('tasks.index') }}"` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 65 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
| `href="/login"` | `href="{{ url_for('auth.login') }}"` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 66 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
| `src="/js/graph.js"` | `src="{{ url_for('static', filename='js/graph.js') }}"` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 67 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
| `action="/createtasks"` | `action="{{ url_for('tasks.create_task') }}"` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 68 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 69 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
See `app/templates/base.html` for a complete example.
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 70 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 71 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
## 🗺️ Route Mapping
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 72 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 73 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
| Old Path | New Blueprint.Route |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 74 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
|----------|---------------------|
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 75 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
| `/login` | `auth.login` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 76 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
| `/signup` | `auth.signup` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 77 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
| `/logout` | `auth.logout` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 78 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
| `/tasks` | `tasks.index` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 79 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
| `/createtasks` | `tasks.create_task` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 80 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
| `/adminpanel` | `admin.admin_panel` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 81 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
| `/ald` | `machines.ald` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 82 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
| `/ebeam` | `machines.ebeam` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 83 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
| `/sdsanalog` | `api.sds_analog` |
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 84 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 85 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
## 📦 Dependencies
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 86 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 87 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
All required packages are in `requirements.txt`:
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 88 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
- Flask - Web framework
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 89 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
- Flask-Login - User session management
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 90 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
- Flask-SQLAlchemy - Database ORM
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 91 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
- Flask-Bcrypt - Password hashing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 92 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
- duo-client - Two-factor authentication
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 93 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
- pandas - Data processing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 94 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 95 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
## 🔒 Security Features
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 96 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 97 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
✅ Bcrypt password hashing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 98 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
✅ Session management with Flask-Login
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 99 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
✅ CSRF protection (Flask built-in)
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 100 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
✅ Input sanitization
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 101 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
✅ SSL/HTTPS support
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 102 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
✅ Duo 2FA integration
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 103 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 104 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
## 🎯 Benefits
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 105 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 106 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
**Before:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 107 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
- 2660 lines in one file
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 108 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
- Hard to maintain
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 109 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
- Hard to test
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 110 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
- Hard to scale
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 111 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 112 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
**After:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 113 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
- ~1200 lines split across 14 files
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 114 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
- Easy to maintain
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 115 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
- Easy to test individual components
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 116 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
- Production-ready with WSGI support
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 117 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 118 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
## 🆘 Troubleshooting
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 119 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 120 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
**Can't import Flask modules?**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 121 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 122 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
pip install -r requirements.txt
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 123 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 124 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 125 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
**Templates not found?**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 126 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 127 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
# Make sure HTML files are in app/templates/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 128 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
ls app/templates/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 129 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 130 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 131 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
**Static files not loading?**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 132 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 133 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
# Make sure JS files are in app/static/js/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 134 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
ls app/static/js/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 135 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 136 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 137 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
**Database errors?**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 138 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
The new models are compatible with your existing SQLite databases. No migration needed!
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 139 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 140 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
## 📚 Documentation
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 141 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 142 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
- `FLASK_MIGRATION.md` - Detailed step-by-step migration guide
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 143 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
- `REFACTORING_SUMMARY.md` - Complete overview of changes
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 144 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
- `run.py` - Application entry point
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 145 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
- Flask Docs: https://flask.palletsprojects.com/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 146 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 147 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
## ✅ What's Preserved
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 148 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 149 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
Every feature from the original server:
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 150 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
- ✅ User authentication with Duo 2FA
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 151 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
- ✅ Task management system
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 152 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
- ✅ Admin panel
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 153 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
- ✅ All machine data viewing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 154 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
- ✅ CSV processing and graphing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 155 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
- ✅ Raspberry Pi data collection
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 156 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
- ✅ File uploads/downloads
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 157 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
- ✅ Session management
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 158 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
- ✅ SSL support
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 159 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 160 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
## 🎓 Learning Resources
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 161 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 162 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
**Flask Basics:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 163 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
- Blueprints: https://flask.palletsprojects.com/en/latest/blueprints/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 164 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
- Templates: https://flask.palletsprojects.com/en/latest/templating/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 165 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
- SQLAlchemy: https://flask-sqlalchemy.palletsprojects.com/
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 166 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 167 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
**Next Steps:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 168 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
1. Get familiar with Flask routing
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 169 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
2. Understand Jinja2 templates
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 170 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
3. Learn about Flask blueprints
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 171 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
4. Explore SQLAlchemy ORM
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 172 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 173 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
## 💡 Pro Tips
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 174 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 175 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
**Development:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 176 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 177 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
export FLASK_ENV=development
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 178 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
export FLASK_DEBUG=1
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 179 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
python run.py
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 180 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 181 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 182 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
**Production:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 183 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
```bash
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 184 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
export FLASK_ENV=production
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 185 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
gunicorn -w 4 -b 0.0.0.0:443 \
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 186 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
  --certfile=cert.pem \
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 187 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
  --keyfile=key.pem \
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 188 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
  run:app
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 189 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
```
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 190 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 191 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
**Adding a new route:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 192 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
1. Add function to appropriate blueprint
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 193 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
2. Add `@blueprint.route('/path')` decorator
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 194 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
3. Return render_template() or jsonify()
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 195 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 196 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
**Adding a new feature:**
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 197 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
1. Add service function in `app/services/`
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 198 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
2. Add route in appropriate blueprint
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 199 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
3. Create/update template if needed
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 200 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 201 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
## 🎊 You're Ready!
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 202 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 203 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
The refactoring is complete and your application is ready to run. Just follow the Quick Start steps above and refer to the documentation files for detailed guidance.
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 204 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 205 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
Good luck! 🚀
```

Reconstruction rule: in `UNanofabTools/QUICK_START.md`, line 206 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/QUICK_START.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/QUICK_START.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/QUICK_START.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/QUICK_START.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/QUICK_START.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/QUICK_START.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/QUICK_START.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/QUICK_START.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/QUICK_START.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/QUICK_START.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/QUICK_START.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/QUICK_START.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/QUICK_START.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/QUICK_START.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/QUICK_START.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/QUICK_START.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/QUICK_START.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/QUICK_START.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/QUICK_START.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/QUICK_START.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/QUICK_START.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/QUICK_START.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/QUICK_START.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/QUICK_START.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
