from app.models.election_model import Election
from app.models.ballot_model import Ballot
from app.models.candidate_model import Candidate
from app.models.auth_model import Admin
from datetime import datetime, timedelta
from app.models.voter_model import Voter

def is_active(start_time, end_time):
    format = "%Y/%m/%d %H:%M:%S"
    start_date = datetime.strptime(start_time, format)
    end_date = datetime.strptime(end_time, format)
    current_time = datetime.now()
    return start_date <= current_time <= end_date

class Admin_service:
    def __init__(self):
        pass

    DATE_FORMAT = "%Y-%m-%dT%H:%M"  # Define date format as a constant

    def create_election(self, email, title, start_date, end_date, description=None):
        if not all([title, start_date, end_date]):
            return {
                "status": "error",
                "message": "title, start_date, ande end_date are required"
            }
        
        admin = Admin.query.filter_by(email=email).first()
        if not admin:
            return {
                "status": "error",
                "message": "Admin not found"
            }
        admin_id = admin.id
        
        election = Election.query.filter_by(title=title).first()
        if election:
            return {
                "status": "ecrror",
                "message": "Election already exists"
            }
        # date_format = "%Y-%m-%dT%H:%M"
        try:
            start = datetime.strptime(start_date, self.DATE_FORMAT)
            end = datetime.strptime(end_date, self.DATE_FORMAT)
        except ValueError:
            return {
                "status": "error",
                "message": f"Invalid date format. Expected format: {self.DATE_FORMAT}"
            }
        print(start)
        print(end)
        time_diff = abs(end - start)

        if end <= start:
            return {
                "status": "error",
                "message": "End date should be greater than start date"
            }

        if time_diff < timedelta(hours=1):
            return {
                "status": "error",
                "message": "The end date should be at least one hour from start date"
            }
        new_election = Election(
            admin_id=admin_id, 
            title=title, 
            start_date=start, 
            end_date=end, 
            description=description
        )
        try:
            new_election.save()
            return {
                "status": "created",
                "message": {
                    "admin_id": new_election.admin_id,
                    "title": new_election.title,
                    "start_date": datetime.strftime(new_election.start_date, self.DATE_FORMAT),
                    "end_date": datetime.strftime(new_election.end_date, self.DATE_FORMAT),
                    "description": new_election.description,
                    "candidates": []  # Return empty list instead of error when no candidates exist
                },
                "id": new_election.id
            }
        except Exception as e:
            return {
                "status": "exception",
                "message": str(e)
            }
        
    def get_all_elections(self):
        try:
            elections = Election.query.all()
            if not elections:
                return {
                    "status": "success",
                    "message": []  # Return empty list instead of error when no elections exist
                }

            result = []
            for election in elections:
                election_dict = election.to_dict()
                # Format dates if they exist
                for date_field in ['start_date', 'end_date']:
                    if election_dict.get(date_field):
                        election_dict[date_field] = datetime.strftime(
                            election_dict[date_field],
                            # '%Y/%m/%d %H:%M:%S'
                            self.DATE_FORMAT
                        )
                result.append(election_dict)

            return {
                "status": "success",
                # "message": [election.to_dict() for election in elections]
                "message": result
            }

        except Exception as e:
            return {
                "status": "error",
                "message": f"Error retrieving elections: {str(e)}"
            }
    
    def get_election(self, id):
        try:
            election = Election.query.filter_by(id=id).first()
            election = election.to_dict()
            if election:
                return {
                    "status": "success",
                    "message": {
                        "id": election.get('id'),
                        "title": election.get('title'),
                        "description": election.get('description'),
                        # "start_date": datetime.strftime(election['start_date'], '%Y/%m/%d %H:%M:%S'),
                        # "end_date": datetime.strftime(election['end_date'], '%Y/%m/%d %H:%M:%S'),
                        "start_date": datetime.strftime(election['start_date'], self.DATE_FORMAT),
                        "end_date": datetime.strftime(election['end_date'], self.DATE_FORMAT),
                    }
                }
            else:
                return {
                    "status": "error",
                    "message": "Election not found"
                }
        except Exception as e:
            return {
                "status": "exception",
                "message": f"Error retrieving election: {str(e)}"
            }
    
    def election_general_settings(self, election_id, new_title, description):
        election = Election.query.filter_by(id=election_id).first()
        print(description)
        if election:
            election.title = new_title
            election.description = description

            try:
                election.save()
                return {
                    "status": "success",
                    "message": "Election has been updated"
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
        
    def election_dates(self, id, start_date, end_date):
        election = Election.query.filter_by(id=id).first()
        # date_format = "%Y-%m-%dT%H:%M"
        start = datetime.strptime(start_date, self.DATE_FORMAT)
        end = datetime.strptime(end_date, self.DATE_FORMAT)
        if election:
            election.start_date = start
            election.end_date = end

            try:
                election.save()

                return {
                    "status": "success",
                    "message": "Election date has been updated successfully"
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
        
    def delete_election(self, id):
        election = Election.query.filter_by(id=id).first()
        if not election:
            return {
                "status": "error",
                "message": "Election not found"
            }
        try:
            election.delete()

            return {
                "status": "success",
                "message": "Election deleted successfully"
            }
        except Exception as e:
            return {
                "status": "exception",
                "message": str(e)
            }
        
    def create_ballot(self, title, election_id, description=None):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            existing_ballot = Ballot.query.filter_by(title=title).first()
            if not existing_ballot:
                ballot = Ballot(
                    title=title, 
                    description=description, 
                    election_id=election_id
                )
                try:
                    ballot.save()

                    return {
                        "status": "success",
                        "message": "Ballot created successfully",
                        "ballot_id": ballot.id,
                        "election_id": ballot.election_id
                    }
                except Exception as e:
                    return {
                        "status": "exception",
                        "message": str(e)
                    }
            elif existing_ballot.election_id != election_id:
                ballot = Ballot(
                    title=title, 
                    description=description, 
                    election_id=election_id
                )
                try:
                    ballot.save()

                    return {
                        "status": "success",
                        "message": "Ballot created successfully",
                        "ballot_id": ballot.id,
                        "election_id": ballot.election_id
                    }
                except Exception as e:
                    return {
                        "status": "exception",
                        "message": str(e)
                    }
            else:
                return {
                    "status": "exists",
                    "message": "Ballot already exists"
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
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

    def update_ballot(self, election_id, ballot_id, title=None, description=None):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            existing_ballot = Ballot.query.filter_by(id=ballot_id).first()
            if existing_ballot:
                existing_ballot.title = title
                existing_ballot.description = description

                try:
                    existing_ballot.save()

                    return {
                        "status": "success",
                        "message": "updated successfully"
                    }
                except Exception as e:
                    return {
                        "status": "exception",
                        "message": str(e)
                    }
            else:
                return {
                    "status": "error",
                    "message": "Ballot not found"
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
            
    
        
    def delete_ballot(self, election_id, ballot_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id).first()
            if not ballot:
                return {
                    "status": "error",
                    "message": "Ballot not found"
                }
            try:
                ballot.delete()

                return {
                    "status": "success",
                    "message": "Ballot deleted successfully"
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
        
    def delete_all_ballot(self, election_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballots = Ballot.query.filter_by(election_id=election_id).all()
            for ballot in ballots:
                try:
                    ballot.delete()
                except Exception as e:
                    return {
                        "status": "exception",
                        "message": str(e)
                    }
            return {
                "status": "success",
                "message": "ballots deleted"
            }
        else:
            return {
                "status": "error",
                "message": "election not found"
            }
        
    def add_candidate(self, election_id, ballot_id, title, description=None):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id, election_id=election_id).first()
            if not ballot:
                return {
                    "status": "error",
                    "message": "Invalid ballot ID"
                }
            candidate = Candidate(
                title=title, 
                bio=description, 
                # photo=photo,
                ballot_id=ballot_id
            )
            try:
                candidate.save()

                return {
                    "status": "success",
                    "message": "candidates added"
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
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
    
    def update_candidate(self, election_id, ballot_id, candidate_id, title=None, bio=None):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id).first()
            if ballot:
                candidate = Candidate.query.filter_by(id=candidate_id).first()
                if candidate:
                    candidate.title = title
                    candidate.bio = bio

                    try:
                        candidate.save()

                        return {
                            "status": "success",
                            "message": "update successful"
                        }
                    except Exception as e:
                        return {
                            "status": "exception",
                            "message": str(e)
                        }
                else:
                    return {
                        "status": "error",
                        "message": "candidate not found"
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
        
    def delete_candidate(self, election_id, ballot_id, candidate_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id).first()
            if ballot:
                candidate = Candidate.query.filter_by(id=candidate_id).first()
                if candidate:
                    try:
                        candidate.delete()

                        return {
                            "status": "success",
                            "message": "candidate deleted"
                        }
                    except Exception as e:
                        return {
                            "status": "exception",
                            "message": str(e)
                        }
                else:
                    return {
                        "status": "error",
                        "message": "candidate not found"
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
        
    def delete_candidates(self, election_id, ballot_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot.query.filter_by(id=ballot_id).first()
            if ballot:
                candidates = Candidate.query.filter_by(ballot_id=ballot_id).all()

                for candidate in candidates:
                    try:
                        candidate.delete()

                    except Exception as e:
                        return {
                            "status": "exeption",
                            "message": str(e)
                        }
                return {
                    "status": "success",
                    "message": "candidates deleted"
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


    def get_vote_url(self, id, start_date, end_date):
        election = Election.query.filter_by(id=id).first()
        if election:
            try:
                if is_active(start_date, end_date):
                    return {
                        "status": "success",
                        "message": f"http://localhost:5000/vote/{id}",
                        "is_active": True
                    }
                return {
                    "status": "error",
                    "message": "Election not active",
                    "is_active": False
                }
            except Exception as e:
                return {
                    'status': 'exception',
                    'message': str(e),
                    "is_active": False
                }
        else:
            return {
                "status": "error",
                "message": "election not found"
            }

    def add_voter(self, election_id, voter_name, voter_email, voter_key, voter_password, has_voted=None):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            voter = Voter(
                election_id=election_id, 
                voter_name=voter_name, 
                voter_email=voter_email, 
                voter_key=voter_key, 
                has_voted=has_voted
            )
            voter.set_voter_password(voter_password)

            try:
                voter.save()

                return {
                    "status": "success",
                    "message": "voter added"
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
        
    def get_voters(self, election_id):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            try:
                voters = Voter.query.filter_by(id=election_id).all()
                if not voters:
                    return {
                        "status": "success",
                        "message": [],
                        "election_title": election.title
                    }
                    
                result = []
                for voter in voters:
                    voter_dict = voter.to_dict()
                    result.append(voter_dict)
                
                return {
                    "status": "success",
                    "message": result,
                    "election_title": election.title
                }
            except Exception as e:
                return {
                    "status": "exception",
                    "message": str(e)
                }
        else:
            return {
                "status": "error",
                "message": "Election not found"
            }
    
    # def update_voter(self, election_id, voter_id, voter_email):
    #     election = Election.query.filter_by(id=election_id).first()
    #     if election:
    #         voter = Voter.query.filter_by(id=voter_id).first()
    #         if voter:
    #             voter.voter_email = voter_email

    #             try:
    #                 voter.save()

    #                 return {
    #                     "status": "success",
    #                     "message": "voter's credentials updated"
    #                 }
    #             except Exception as e:
    #                 return {
    #                     "status": "exception",
    #                     "message": str(e)
    #                 }
    #         else:
    #             return {
    #                 "status": "error",
    #                 "message": " Voter not found"
    #             }
    #     else:
    #         return {
    #             "status": "error",
    #             "message": "election not found"
    #         }


        
    def generate_voter_credentials(self):
        try:
            credentials = Voter.generate_credentials()
            
            return {
                "status": "success",
                "message": {
                    "voter_key": credentials['voter_key'],
                    "voter_password": credentials['voter_password']
                }
            }
        except Exception as e:
            return {
                "status": "success",
                "message": str(e)
            }