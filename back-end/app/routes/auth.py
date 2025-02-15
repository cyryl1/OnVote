from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.routes import auth
from app.services.auth_service import AuthService
from flask_cors import cross_origin


auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()



@auth_bp.route('/register', methods=['POST'])
@cross_origin()
def register():
    # print(request.form)
    email = request.form.get('email')
    name = request.form.get("name")
    password = request.form.get("password")

    result = auth_service.register_user(name, email, password)

    if result['status'] == 'error':
        return jsonify(result), 400
    return jsonify(result), 201


@auth_bp.post("/login")
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    result = auth_service.validate_user(email, password)

    if result['message'] == 'User not found':
        return jsonify(result), 404
    elif result['message'] == 'Invalid email or password':
        return jsonify(result), 400
    else:
        return jsonify(result), 200
    
@auth_bp.post('/refresh')
@jwt_required(refresh=True)
def refresh_user():
    current_user = get_jwt_identity()
    refresh = auth_service.refresh(current_user)
    if refresh['status'] == 'success':
        return jsonify(refresh), 201
    return jsonify(refresh), 401

@auth_bp.delete('/auth/delete')
@jwt_required()
def delete():
    email = request.get_json().get('email')
    result = auth_service.delete_user(email)
    if result['status'] == 'error':
        return jsonify(result), 404
    return jsonify(result), 200

@auth_bp.put('auth/update_general_profile')
@jwt_required()
def update_general_profile():
    new_email = request.form.get('email')
    new_name = request.form.get('name')

    email = get_jwt_identity()

    result = auth_service.update_general_profile(email, new_email, new_name)

    if result['status'] == 'error':
        return jsonify(result), 404
    return jsonify(result), 201


@auth_bp.put('auth/update_password')
@jwt_required()
def update_password():
    email = get_jwt_identity()
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')

    result = auth_service.update_password(email, current_password, new_password)
    if result['message'] == 'Current password is incorrect':
        return jsonify(result), 400
    elif result['message'] == 'User not found':
        return jsonify(result), 404
    else:
        return jsonify(result), 201

@auth_bp.get('/auth/profile')
@jwt_required()
def check_profile():
    email = get_jwt_identity()

    result = auth_service.check_profile(email)

    if result['status'] == 'error':
        return jsonify(result), 404
    return jsonify(result), 200
