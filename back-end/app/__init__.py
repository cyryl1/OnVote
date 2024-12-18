from flask import Flask

from config import Config
from app.extensions import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    #initialize blueprints
    from app.routes import bp
    app.register_blueprint(bp)
    
    # from app.routes import main
    # from app.errors import errors
    # app.register_blueprint(main)
    # app.register_blueprint(errors)

    @app.route('/test/')
    def test():
        return '<h1>Chakra is Shama</h1>'
    
    return app