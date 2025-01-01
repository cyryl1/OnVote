from flask import request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.routes import bp
from app.services.auth_service import AuthService
from app.models import Admin
from app.models import Election
from datetime import datetime
from flask_cors import cross_origin



@bp.route('/register', methods=['POST'])
@cross_origin()
def register():
    print(request.form)
    # data = request.form

    admin = Admin.query.filter_by(email=request.form.get('email')).first()
    if admin:
        return jsonify({"message": "User already exist, Login instead"}), 403
    
    admin = Admin(
        name=request.form.get('name'),
        email=request.form.get('email')
    )

    admin.set_password(request.form.get('password'))

    admin.save()

    return jsonify({
        "message": "Sign Up successful, now login",
        "id": admin.id
    }), 201

@bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    admin = Admin.query.filter_by(email=email).first()
    if not admin:
        return jsonify({
            "message": "User not found"
        }), 404
    check_password = admin.check_password(password)
    if admin and check_password:
        return jsonify({
            "message": "Logged in",
            "tokens": {
                "access": create_access_token(identity=admin.email),
                "refresh": create_refresh_token(identity=admin.email)
            }
        }), 200
    return jsonify({"message": "Invalid email or password. Try again!"}), 400

@bp.delete('/auth/delete')
@jwt_required()
def delete():
    data = request.get_json()
    email = data.get('email')
    admin = Admin.query.filter_by(email=email).first()
    if not admin:
        return jsonify({"message": "User not found"}), 404
    admin.delete()
    return jsonify({"message": "User deleted"}), 200

@bp.put('auth/update')
@jwt_required()
def update():
    data = request.get_json()

    email = get_jwt_identity()
    admin = Admin.query.filter_by(email=email).first()
    if admin:
        admin.name = data.get('name')
        admin.set_password(data.get('password'))

        admin.save()

        return jsonify({"message": "profile update successfully"}), 201
    return jsonify({"message": "Not authorized"}), 403

@bp.get('/auth/profile')
@jwt_required()
def check_profile():
    email = get_jwt_identity()
    profile = Admin.query.filter_by(email=email).first()
    if profile:
        return jsonify({
            "profile": {
                'name': profile.name,
                'email': profile.email
            },
            "message": "Profile return sucessfully"
        }), 200
    return jsonify({"message": "User not found"}), 404

