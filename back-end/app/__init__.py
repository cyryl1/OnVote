from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS

from config import Config
from app.models import db

def create_app(config_class=Config):
    load_dotenv()  # Load environment variables from.env file
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()
    jwt = JWTManager()
    jwt.init_app(app)

    #initialize blueprints
    from app.routes import bp
    app.register_blueprint(bp, url_prefix="/onvote")

    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Signature verification failed", "error": "Invalid token"}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Request doesn't contain a valid token", "error": "authorization_header"}), 401

    @app.route('/test/')
    def test():
        return '<h1>Chakra is Shama</h1>'
    
    return app