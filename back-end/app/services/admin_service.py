from app.models.election_model import Election
from app.models.ballot_model import Ballot
from app.models.option_model import Option
from datetime import datetime, timedelta

class Admin_service:
    def __init__(self):
        pass

    def create_election(self, title, start_date, end_date, description=None):
        election = Election.query.filter_by(title=title).first()
        if election:
            return {
                "status": "error",
                "message": "Election already exists"
            }
        date_format = "%Y/%m/%d %H:%M:%S"
        start = datetime.strptime(start_date, date_format)
        end = datetime.strptime(end_date, date_format)
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
        new_election = Election(title=title, start_date=start, end_date=end, description=description)
        try:
            new_election.save()
            return {
                "status": "created",
                "message": "Election created successfully",
                "id": new_election.id
            }
        except Exception as e:
            return {
                "status": "exception",
                "message": str(e)
            }
        
    def get_all_election(self):
        elections = Election.query.all()
        if elections:
            return {
                "status": "success",
                "message": [election.to_dict() for election in elections]
            }
        return {
            "status": "error",
            "message": "error retrieving elections"
        }
    
    def election_general_settings(self, id, new_title, description):
        election = Election.query.filter_by(id=id).first()
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
        date_format = "%Y/%m/%d %H:%M:%S"
        start = datetime.strptime(start_date, date_format)
        end = datetime.strptime(end_date, date_format)
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
        
    def create_ballot(self, title, election_id, description=None,):
        election = Election.query.filter_by(id=election_id).first()
        if election:
            ballot = Ballot(title=title, description=description, election_id=election_id)
            try:
                ballot.save()

                return {
                    "status": "success",
                    "message": "Ballot created successfully",
                    "ballot_id": ballot.id
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
        
    def delete_ballot(self, ballot_id):
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
        
    def add_option(self, ballot_id, title, description=None, photo=None):
        ballot = Ballot.query.filter_by(id=ballot_id).first()
        if not ballot:
            return {
                "status": "error",
                "message": "Invalid ballot ID"
            }
        option = Option(
            title=title, 
            description=description, 
            # photo=photo,
            ballot_id=ballot_id
        )
        try:
            option.save()

            return {
                "status": "success",
                "message": "Options added"
            }
        except Exception as e:
            return {
                "status": "exception",
                "message": str(e)
            }

        