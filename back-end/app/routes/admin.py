from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.routes import bp
from app.services.admin_service import Admin_service
from flask_cors import cross_origin

admin = Admin_service()

@bp.post('/election/create')
@jwt_required()
def create_election():
    title = request.form.get('title')
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')
    

    election = admin.create_election(title, start_date, end_date)
    if election['status'] == 'error':
        return jsonify(election), 400
    elif election['status'] == 'exception':
        return jsonify(election), 500
    else:
        return jsonify(election), 201

@bp.get('/get_all_elections')
# @jwt_required()
def get_all_elections():
    elections = admin.get_all_elections()
    if elections['status'] == 'error':
        return jsonify(elections), 400
    return jsonify(elections), 200

@bp.get('/get_election/<id>')
def get_election(id):
    election = admin.get_election(id)
    if election['status'] == 'error':
        return jsonify(election), 404
    elif election['status'] == 'exception':
        return jsonify(election), 500
    else:
        return jsonify(election), 200


@bp.put('/election/general_settings/<id>')
@jwt_required()
def election_general_settings(id):
    new_title = request.form.get('title')
    description = request.form.get('description')

    response = admin.election_general_settings(id, new_title, description)
    if response['status'] == 'error':
        return jsonify(response), 404
    elif response['status'] == 'exception':
        return jsonify(response), 400
    else:
        return jsonify(response), 201
    
@bp.put('/election/election_dates/<id>')
@jwt_required()
def election_dates(id):
    start_date = request.form.get('start_date')
    end_date = request.form.get('end_date')

    response = admin.election_dates(id, start_date, end_date)
    if response['status'] == 'error':
        return (response), 404
    elif response['status'] == 'exception':
        return (response), 400
    else:
        return jsonify(response), 201

@bp.delete('/election/delete/<id>')
def delete_election(id):
    response = admin.delete_election(id)

    if response['status'] == 'error':
        return jsonify(response), 404
    elif response['status'] == 'exception':
        return jsonify(response), 400
    else:
        return jsonify(response), 201
