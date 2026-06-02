# 05 — Admin Panel

The admin panel is a tiny module for managing users: viewing the user list, deleting users, and toggling two boolean permissions (`is_admin` and `can_assign`). It is composed of two short files, `app/blueprints/admin.py` and `app/services/admin_service.py`, working together with the User model.

## The `admin_required` gate

Every admin route is protected by **two** decorators. Both must pass before the route handler runs.

```python
def admin_required(f):
    """Decorator to require admin access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth_service.is_user_admin(current_user.username):
            flash('You do not have permission to access this page', 'error')
            return redirect(url_for('tasks.index'))
        return f(*args, **kwargs)
    return decorated_function
```

This is a custom decorator. Decorators in Python are functions that wrap other functions. Reading from the inside out:

- **`decorated_function`** is the new wrapper. When the wrapper is called, it first checks `auth_service.is_user_admin(current_user.username)`. If the user isn't an admin, it flashes an error and redirects them to the tasks page.
- **`@wraps(f)`** copies `f`'s name and docstring onto the wrapper so debugging tools see the original function rather than `decorated_function`.
- **`return f(*args, **kwargs)`** — if the admin check passed, run the original handler with whatever arguments came in.

In practice, each admin route is decorated like this:

```python
@admin_bp.route('/adminpanel')
@login_required
@admin_required
def admin_panel():
    ...
```

Order matters: `@login_required` runs *first* (outermost), so unauthenticated users are bounced before `@admin_required` is even consulted. `@admin_required` then refines that to "logged in **and** admin." This is a common layered-permissions pattern.

## The routes

### `/adminpanel` — show the user list

```python
@admin_bp.route('/adminpanel')
@login_required
@admin_required
def admin_panel():
    """Display admin panel"""
    users = admin_service.get_all_users()
    return render_template('adminpanel.html', users=users)
```

`get_all_users()` returns a list of every `User` row; the template renders them in a table with delete/toggle buttons.

### `/deleteUser` — DELETE-style action

```python
@admin_bp.route('/deleteUser', methods=['POST'])
@login_required
@admin_required
def delete_user():
    """Delete a user"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.delete_user(unid):
        return jsonify({'status': 'success', 'message': 'User deleted'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to delete user'}), 400
```

This route expects a JSON body — i.e., it's called from JavaScript (`fetch`) rather than a normal HTML form. The JS extracts the uNID of the user-to-delete from a table row and POSTs `{"uNID": "u12345"}`. The route delegates to `admin_service.delete_user(unid)` and returns a JSON status.

Note this is `POST /deleteUser` rather than `DELETE /users/<id>`, which would be more RESTful. The current style is fine; it's just slightly less idiomatic.

### `/toggleAdminStatus` and `/toggleAssign`

```python
@admin_bp.route('/toggleAdminStatus', methods=['POST'])
@login_required
@admin_required
def toggle_admin():
    """Toggle user admin status"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.toggle_admin_status(unid):
        return jsonify({'status': 'success', 'message': 'Admin status toggled'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to toggle admin status'}), 400


@admin_bp.route('/toggleAssign', methods=['POST'])
@login_required
@admin_required
def toggle_assign():
    """Toggle user task assignment privilege"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.toggle_assign_privilege(unid):
        return jsonify({'status': 'success', 'message': 'Assign privilege toggled'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to toggle assign privilege'}), 400
```

Same structure as `/deleteUser`, but for flipping the `is_admin` and `can_assign` flags. "Toggle" means: if it's `True`, set it to `False`, and vice-versa.

## The service

`admin_service.py` is even shorter than the blueprint — about 55 lines.

```python
def get_all_users():
    """Get all users"""
    return User.query.all()
```

Returns every row from the User table.

```python
def delete_user(unid):
    """Delete a user by UNID"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting user: {e}")
        return False
```

- Find the user by uNID.
- If found, queue a DELETE, commit, return `True`.
- If not found, return `False`.
- On any DB error, rollback and log.

```python
def toggle_admin_status(unid):
    """Toggle user admin status"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            user.is_admin = not user.is_admin
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error toggling admin status: {e}")
        return False


def toggle_assign_privilege(unid):
    """Toggle user task assignment privilege"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            user.can_assign = not user.can_assign
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error toggling assign privilege: {e}")
        return False
```

These two are near-clones. The key trick: `user.is_admin = not user.is_admin` flips the boolean in place; the next `commit()` makes that change permanent.

## How the table sees it

On the front end (`adminActions.js` in the JS files), the user table's "Delete," "Admin," and "Assign" buttons each call `fetch()` with the row's uNID, then update the row in the DOM based on the response.

This is a clear separation:

- **Server**: enforce the rules, persist changes.
- **Client (JavaScript)**: present buttons and update visuals.

That's it for admin. It is small on purpose — a single page with three actions, each gated behind a double permission check.

Next: `06-Tasks.md`.
