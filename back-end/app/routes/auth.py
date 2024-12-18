from app.routes import bp

@bp.route('/auth')
def auth():
    return '<h2>this is for auth</h2>'