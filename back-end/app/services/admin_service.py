from app.models.election_model import Election
from app.models.ballot_model import Ballot
from app.models.option_model import Option
from datetime import datetime, timedelta

def is_active(start_time, end_time):
    format = "%Y-%m-%dT%H:%M:%S"
    start_date = datetime.strptime(start_time, format)
    end_date = datetime.strptime(end_time, format)
    current_time = datetime.now()
    return start_date <= current_time <= end_date

class Admin_service:
    def __init__(self):
        pass

    def create_election(self, title, start_date, end_date, description=None):
        election = Election.query.filter_by(title=title).first()
        if election:
            return {
                "status": "ecrror",
                "message": "Election already exists"
            }
        date_format = "%Y-%m-%dT%H:%M"
        try:
            start = datetime.strptime(start_date, date_format)
            end = datetime.strptime(end_date, date_format)
        except ValueError:
            return {
                "status": "error",
                "message": f"Invalid date format. Expected format: {date_format}"
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
        if title is not None and start_date is not None and end_date is not None:
            new_election = Election(title=title, start_date=start, end_date=end, description=description)
        else:
            raise ValueError('title, start_date, end_date is None')
        try:
            new_election.save()
            return {
                "status": "created",
                "message": {
                    "title": new_election.title,
                    "start_date": datetime.strftime(new_election.start_date, date_format),
                    "end_date": datetime.strftime(new_election.end_date, date_format),
                    "description": new_election.description,
                    "options": []  # Return empty list instead of error when no options exist
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
                            '%Y/%m/%d %H:%M:%S'
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
                        "start_date": datetime.strftime(election['start_date'], '%Y/%m/%d %H:%M:%S'),
                        "end_date": datetime.strftime(election['end_date'], '%Y/%m/%d %H:%M:%S'),
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

    def get_vote_url(self, id, start_date, end_date):
        election = Election.query.filter_by(id=id).first()
        if election:
            try:
                if is_active(start_date, end_date):
                    return {
                        "status": "success",
                        "message": f"http://localhost:5000/vote/{start_date}/{end_date}",
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

        