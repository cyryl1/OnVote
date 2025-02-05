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
    admin_id = data.get('admin_id')
    title = data.get('title')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    election = admin.create_election(admin_id, title, start_date, end_date)
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
        return jsonify(elections), 500
    return jsonify(elections), 200

@bp.get('/get_election/<election_id>')
def get_election(election_id):
    election = admin.get_election(election_id)
    if election['status'] == 'error':
        return jsonify(election), 404
    elif election['status'] == 'exception':
        return jsonify(election), 500
    else:
        return jsonify(election), 200


@bp.put('/election/<election_id>/general_settings')
@jwt_required()
def election_general_settings(election_id):
    data = request.get_json()
    new_title = data.get('title')
    description = data.get('description')

    response = admin.election_general_settings(election_id, new_title, description)
    if response['status'] == 'error':
        return jsonify(response), 404
    elif response['status'] == 'exception':
        return jsonify(response), 500
    else:
        return jsonify(response), 201
    
@bp.put('/election/<election_id>/election_dates')
@jwt_required()
def election_dates(election_id):
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    response = admin.election_dates(election_id, start_date, end_date)
    if response['status'] == 'error':
        return (response), 404
    elif response['status'] == 'exception':
        return (response), 500
    else:
        return jsonify(response), 201

@bp.delete('/election/<election_id>/delete')
@jwt_required()
def delete_election(election_id):
    response = admin.delete_election(election_id)

    if response['status'] == 'error':
        return jsonify(response), 404
    elif response['status'] == 'exception':
        return jsonify(response), 500
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
        return jsonify(active_url), 500
    return jsonify(active_url), 200

@bp.post('/election/<election_id>/create_ballot')
# @jwt_required()
def create_ballot(election_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    ballot = admin.create_ballot(title, election_id, description)
    if ballot['status'] == 'error':
        return jsonify(ballot), 404
    elif ballot['status'] == 'exception':
        return jsonify(ballot), 500
    elif ballot['status'] == 'exists':
        return jsonify(ballot), 400
    else:
        return jsonify(ballot), 201
    
@bp.get('/election/<election_id>/get_ballots')
def get_ballots(election_id):
    ballots = admin.get_all_ballots(election_id)
    if ballots['status'] == 'error':
        return jsonify(ballots), 404
    elif ballots['status'] == 'exeption':
        return jsonify(ballots), 500
    else:
        return jsonify(ballots), 200
    
@bp.put('/election/<election_id>/update_ballot')
# @jwt_required()
def update_ballot(election_id):
    data = request.get_json()
    ballot_id = data.get('ballot_id')
    title = data.get('title')
    description = data.get('description')

    ballot = admin.update_ballot(election_id, ballot_id, title, description)
    if ballot['status'] == 'error':
        return jsonify(ballot), 404
    elif ballot['status'] == 'exception':
        return jsonify(ballot), 500
    else:
        return jsonify(ballot), 201
    
@bp.delete('election/<election_id>/delete_ballot/<ballot_number>')
# @jwt_required()
def delete_ballot(election_id, ballot_number):
    ballot = admin.delete_ballot(election_id, ballot_number)
    if ballot['status'] == 'error':
        return jsonify(ballot), 404
    elif ballot['status'] == 'exception':
        return jsonify(ballot), 500
    else:
        return jsonify(ballot), 200

@bp.delete('/election/<election_id>/delete_ballots')
# @jwt_required()
def delete_ballots(election_id):
    ballots = admin.delete_all_ballot(election_id)
    if ballots['status'] == 'error':
        return jsonify(ballots), 404
    elif ballots['status'] == 'exception':
        return jsonify(ballots), 500
    else:
        return jsonify(ballots), 200
    

@bp.post('/election/<election_id>/ballot/candidate')
# @jwt_required()
def add_candidate(election_id):
    data = request.get_json()
    ballot_id = data.get('ballot_id')
    title = data.get('title')
    description = data.get('description')

    candidate = admin.add_candidate(election_id, ballot_id, title, description)
    if candidate['status'] == 'error':
        return jsonify(candidate), 404
    elif candidate['status'] == 'exception':
        return jsonify(candidate), 500
    else:
        return jsonify(candidate), 201
    
@bp.get('/election/<election_id>/ballot/<ballot_id>/get_candidates')
# @jwt_required()
def get_candidates(election_id, ballot_id):
    candidates = admin.get_candidates(election_id, ballot_id)

    if candidates['status'] == 'error':
        return jsonify(candidates), 404
    elif candidates['status'] == 'exception':
        return jsonify(candidates), 500
    else:
        return jsonify(candidates), 200
    
@bp.put('/election/<election_id>/ballot/<ballot_id>/update_candidate')
# @jwt_required()
def update_candidate(election_id, ballot_id):
    data = request.get_json()
    candidate_id = data.get('candidate_id')
    title = data.get('title')
    bio = data.get('bio')
    candidate = admin.update_candidate(election_id, ballot_id, candidate_id, title=title, bio=bio)

    if candidate['status'] == 'error':
        return jsonify(candidate), 404
    elif candidate['status'] == 'exception':
        return jsonify(candidate), 500
    else:
        return jsonify(candidate), 201

@bp.delete('/election/<election_id>/ballot/<ballot_id>/delete_candidate')
# @jwt_required()
def delete_candidate(election_id, ballot_id):
    data = request.get_json()
    candidate_id = data.get('candidate_id')

    candidate = admin.delete_candidate(election_id, ballot_id, candidate_id)

    if candidate['status'] == 'error':
        return jsonify(candidate), 404
    elif candidate['status'] == 'exception':
        return jsonify(candidate), 500
    else:
        return jsonify(candidate), 200
    
@bp.delete('/election/<election_id>/ballot/<ballot_id>/delete_candidates')
# @jwt_required()
def delete_cadidates(election_id, ballot_id):
    candidates = admin.delete_candidates(election_id, ballot_id)

    if candidates['status'] == 'error':
        return jsonify(candidates), 404
    elif candidates['status'] == 'exception':
        return jsonify(candidates), 500
    else:
        return jsonify(candidates), 200


@bp.post('/election/<election_id>/add_voter')
# @jwt_required()
def add_voter(election_id):
    data = request.json()
    voter_key = data.get('voter_key')
    voter_password = data.get('voter_password')
    has_voted = data.get('has_voted')

    voter = admin.add_voter(election_id, voter_key, voter_password, has_voted)

    if voter['status'] == 'error':
        return jsonify(voter), 404
    elif voter['status'] == 'exception':
        return jsonify(voter), 500
    else:
        return jsonify(voter), 201
    
@bp.get('/election/<election_id>/get_voters')
# @jwt_required()
def get_voters(election_id):
    voters = admin.get_voters(election_id)

    if voters['status'] == 'error':
        return jsonify(voters), 404
    elif voters['status'] == 'exception':
        return jsonify(voters), 500
    else:
        return jsonify(voters), 200
    
@bp.get('/get_voters_credentials')
def generate_voter_credential():
    voter_credentials = admin.generate_voter_credentials()

    if voter_credentials['status'] == 'exception':
        return jsonify(voter_credentials), 500
    else:
        return jsonify(voter_credentials), 200
