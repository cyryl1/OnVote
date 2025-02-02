from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS

from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    load_dotenv()  # Load environment variables from.env file
    app = Flask(__name__)
    # CORS(app)
    # CORS(app, origins=["http://localhost:5173"])
    CORS(app, resources={r"/onvote/*": {"origins": "http://localhost:5173"}})
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        from app.models import election_model, ballot_model, candidate_model, voter_model, vote_model
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