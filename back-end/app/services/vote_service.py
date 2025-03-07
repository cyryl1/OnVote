from app.models.voter_model import Voter
from app.models.ballot_model import Ballot
from app.models.candidate_model import Candidate
from app.models.vote_model import Vote
from app.models.election_model import Election
from datetime import datetime
# from app.extensions import db

class Vote_service:
    def __init__(self, db):
        self.db = db


    def validate_voter(self, election_id, voter_key, voter_password):
        election = Election.query.filter_by(id=election_id).first()

        if election:
            voter = Voter.query.filter_by(voter_key=voter_key).first()
            if not voter:
                return {
                    "status": "error",
                    "message": "voter not found"
                }
            if voter.has_voted:
                return {
                    "status": "error",
                    "message": "Already Voted"
                }
            check_password = voter.check_voter_password(voter_password)
            if voter and check_password:
                return {
                    "status": "success",
                    "message": "voter authenticated",
                    "id": voter.id
                }
            else:
                return {
                    "status": "error",
                    "message": "invalid password"
                }
        else: 
            return {
                "status": "error",
                "message": "election not found"
            }
        
    def cast_vote(self, voter_id, candidate_id, ballot_id, election_id):
        # Validate voter, ballot, candidate, and election
        election = Election.query.filter_by(id=election_id).first()
        if not election:
            return {
                "status": "error",
                "message": "Election not found"
            }
        ballot = Ballot.query.filter_by(id=ballot_id, election_id=election_id).first()
        if not ballot:
            # print(f"Debug: Ballot not found for ballot_id={ballot_id}, election_id={election_id}")
            return {
                "status": "error",
                "message": "Ballot not found in this election"
            }
        candidate = Candidate.query.filter_by(id=candidate_id, ballot_id=ballot_id).first()
        if not candidate:
            return {
                "status": "error",
                "message": "Candidate not found in this ballot"
            }
        voter = Voter.query.filter_by(id=voter_id, election_id=election_id).first()
        if not voter:
            return {
                "status": "error",
                "message": "Voter not found in this election"
            }
        
        existing_vote = Vote.query.filter_by(voter_id=voter_id, ballot_id=ballot_id).first()
        if existing_vote:
            return {
                "status": "error",
                "message": 'You have already voted in this ballot'
            }
        
        new_vote = Vote(
            voter_id=voter_id, 
            candidate_id=candidate_id, 
            ballot_id=ballot_id,
            timestamp=datetime.utcnow()
        )

        try:
            new_vote.save()
            voter.has_voted = True
            self.db.session.commit()
            return {
                "status": "success",
                "message": "vote cast"
            }
        except Exception as e:
            self.db.session.rollback()
            return {
                "status": "exception",
                "message": str(e)
            }
        
        
    def get_election_total_votes(self, election_id):
        # Check if the election exists
        election = Election.query.filter_by(id=election_id).first()
        if not election:
            return {
                'status': 'error',
                'message': 'Election not found'
            }

        # Count total votes for the election
        total_votes = (
            self.db.session.query(self.db.func.count(Vote.id))
                .join(Ballot, Vote.ballot_id == Ballot.id)
                .filter(Ballot.election_id == election_id)
                .scalar()
        )

        # Return the result
        return {
            'status': 'success',
            'total_votes': total_votes or 0  # Ensure 0 is returned if no votes are found
        }

    def get_election_candidate_votes(self, election_id):
        election = Election.query.filter_by(id=election_id).first()
        if not election:
            return {
                "status": "error",
                "message": "Election not found"
            }
        results = (
            self.db.session.query(
                Candidate.id,
                Candidate.title.label('candidate_title'),
                Ballot.id.label('ballot_id'),
                Ballot.title.label('ballot_title'),
                self.db.func.count(Vote.id).label('votes')
            ).join(
                Ballot, Candidate.ballot_id == Ballot.id
            ).outerjoin(
                Vote, (Vote.candidate_id == Candidate.id) & (Vote.ballot_id == Ballot.id)
            ).filter(
                Ballot.election_id == election_id
            ).group_by(
                Candidate.id,
                Candidate.title,
                Ballot.id,
                Ballot.title
            ).all()
        )

        organized_results = {}
        for result in results:
            ballot_id = result.ballot_id
            if ballot_id not in organized_results:
                organized_results[ballot_id] = {
                    'ballot_id': ballot_id,
                    'ballot_title': result.ballot_title,
                    'candidates': []
                }

            organized_results[ballot_id]['candidates'].append({
                'candidate_id': result.id,
                'candidate_name': result.candidate_title,
                'votes': result.votes
            })

        return {
            'status': 'success',
            'ballots': list(organized_results.values())
        }

    def get_all_ballots(self, election_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            try:
                ballots = Ballot.query.filter_by(election_id=election_id).all()
                if not ballots:
                    return {
                        "status": "success",
                        "message": [], # Return empty list instead of error when no ballots exist
                        "election_title": election.title
                    }
                
                result = []
                for ballot in ballots:
                    ballot_dict = ballot.to_dict()
                    result.append(ballot_dict)

                return {
                    "status": "success",
                    # "message": [ballot.to_dict() for election in ballots]
                    "message": result,
                    "election_title": election.title
                }

            except Exception as e:
                return {
                    "status": "exception",
                    "message": f"Error retrieving ballots: {str(e)}"
                }
        else: 
            return {
                "status": "error",
                "message": "election not found"
            }
        
    def get_candidates(self, election_id, ballot_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id).first()
            if ballot:
                try:
                    candidates = Candidate.query.filter_by(ballot_id=ballot_id).all()
                    if not candidates:
                        return {
                            "status": "success",
                            "message": []
                        }
                    
                    result = []
                    for candidate in candidates:
                        candidate_dict = candidate.to_dict()
                        result.append(candidate_dict)
                    
                    return {
                        "status": "success",
                        "message": result
                    }
                except Exception as e:
                    return {
                        "status": "exeption",
                        "message": str(e)
                    }
            else:
                return {
                    "status": "error",
                    "message": "ballot not found"
                }
        else: 
            return {
                "status": "error",
                "message": "election not found"
            }
        