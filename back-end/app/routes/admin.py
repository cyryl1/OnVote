from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.routes import bp
from app.services.admin_service import Admin_service
from flask_cors import cross_origin

admin = Admin_service()

@bp.post('/election/create')
@jwt_required()
def create_election():
    data = request.get_json()
    title = data.get('title')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
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
    data = request.get_json()
    new_title = data.get('title')
    description = data.get('description')

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
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    response = admin.election_dates(id, start_date, end_date)
    if response['status'] == 'error':
        return (response), 404
    elif response['status'] == 'exception':
        return (response), 400
    else:
        return jsonify(response), 201

@bp.delete('/election/delete/<id>')
@jwt_required()
def delete_election(id):
    response = admin.delete_election(id)

    if response['status'] == 'error':
        return jsonify(response), 404
    elif response['status'] == 'exception':
        return jsonify(response), 400
    else:
        return jsonify(response), 201
    
@bp.post('/election_url')
# @jwt_required()
def get_vote_url():
    data = request.get_json()
    id = data.get('id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    # print(id)
    # print(start_date)
    # print(end_date)
    active_url = admin.get_vote_url(id, start_date, end_date)
    if active_url['status'] == 'error':
        return jsonify(active_url), 404
    elif active_url['status'] == 'exception':
        return jsonify(active_url), 400
    return jsonify(active_url), 200

@bp.post('election/create_ballot')
# @jwt_required()
def create_ballot():
    data = request.get_json()
    title = data.get('title')
    election_id = data.get('election_id')
    description = data.get('description')

    ballot = admin.create_ballot(title, election_id, description)
    if ballot['status'] == 'error':
        return jsonify(ballot), 404
    elif ballot['status'] == 'exception':
        return jsonify(ballot), 400
    else:
        return jsonify(ballot), 201
    
@bp.get('election/<election_id>/get_ballots')
def get_ballots(election_id):
    ballots = admin.get_all_ballots(election_id)
    if ballots['status'] == 'error':
        return jsonify(ballots), 400
    else:
        return jsonify(ballots), 200
    
@bp.delete('election/<election_id>/delete_ballot/<id>')
# @jwt_required()
def delete_ballot(election_id, id):
    ballot = admin.delete_ballot(election_id, id)
    if ballot['status'] == 'error':
        return jsonify(ballot), 404
    elif ballot['status'] == 'exception':
        return jsonify(ballot), 400
    else:
        return jsonify(ballot), 200
    

@bp.post('election/ballot/option')
@jwt_required()
def add_option():
    data = request.get_json()
    ballot_id = data.get('ballot_id')
    title = data.get('title')
    description = data.get('description')

    option = admin.add_option(ballot_id, title, description)
    if option['status'] == 'error':
        return jsonify(option), 404
    elif option['status'] == 'exception':
        return jsonify(option), 400
    else:
        return jsonify(option), 201
