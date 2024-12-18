from app.routes import bp

@bp.route('/admin')
def admin():
    return '<h2>This is for admin page<h2>'