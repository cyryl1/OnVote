from app.routes import bp

@bp.route('/')
def index():
    return 'This is the Main Blueprint'