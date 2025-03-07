from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.routes import vote
from app.services.vote_service import Vote_service
from app import db

vote_bp = Blueprint('voter', __name__)
vote_service = Vote_service(db)

@vote_bp.post('/election/<int:election_id>/validate_voter')
def validate_voter(election_id):
    data = request.get_json()
    voter_key = data.get('voter_key')
    voter_password = data.get('voter_password')

    voter = vote_service.validate_voter(election_id, voter_key, voter_password)

    if voter['status'] == 'error':
        return jsonify(voter), 404
    else:
        return jsonify(voter), 201

@vote_bp.post('/election/<int:election_id>/cast_vote')
def cast_vote(election_id):   
    data = request.get_json()
    voter_id = data.get('voter_id')
    ballot_id = data.get('ballot_id')
    candidate_id = data.get('candidate_id')
    
    vote = vote_service.cast_vote(voter_id, candidate_id, ballot_id, election_id)

    if vote['status'] == 'error':
        return jsonify(vote), 404
    elif vote['status'] == 'exception':
        return jsonify(vote), 500
    else:
        return jsonify(vote), 200

@vote_bp.get('/election/<int:election_id>/total_votes')
def get_election_total_votes(election_id):
    total_votes = vote_service.get_election_total_votes(election_id)

    if total_votes['status'] == 'error':
        return jsonify(total_votes), 404
    return jsonify(total_votes), 200

@vote_bp.get('/election/<int:election_id>/candidate_votes')
def get_election_candidate_votes(election_id):
    candidate_votes = vote_service.get_election_candidate_votes(election_id)

    if candidate_votes['status'] == 'error':
        return jsonify(candidate_votes), 404
    return jsonify(candidate_votes), 200

@vote_bp.get('/election/<election_id>/vote/get_ballots')
def get_ballots(election_id):
    ballots = vote_service.get_all_ballots(election_id)
    if ballots['status'] == 'error':
        return jsonify(ballots), 404
    elif ballots['status'] == 'exeption':
        return jsonify(ballots), 500
    else:
        return jsonify(ballots), 200

@vote_bp.get('/election/<election_id>/ballot/<ballot_id>/vote/get_candidates')
def get_candidates(election_id, ballot_id):
    candidates = vote_service.get_candidates(election_id, ballot_id)

    if candidates['status'] == 'error':
        return jsonify(candidates), 404
    elif candidates['status'] == 'exception':
        return jsonify(candidates), 500
    else:
        return jsonify(candidates), 200
  