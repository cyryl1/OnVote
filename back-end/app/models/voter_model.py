from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

class Voter(db.Model):
    __tablename__ = 'voters'

    id = db.Column(db.Integer, primary_key=True)
    election_id = db.Column(db.Integer, db.ForeignKey('elections.id'), nullable=False)
    voter_name = db.Column(db.String(150), nullable=False)
    voter_email = db.Column(db.String(150), nullable=False)
    voter_key = db.Column(db.String(150), unique=True, nullable=False)
    voter_password = db.Column(db.String(150), nullable=False)
    has_voted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    votes = db.relationship('Vote', backref='voter', cascade='all, delete-orphan')

    @classmethod
    def generate_credentials(cls):
        voter_key = secrets.token_hex(8).upper()
        voter_password = secrets.token_urlsafe()
        return {
            "voter_key": voter_key,
            "voter_password": voter_password
        }
       
    # def set_voter_password(self, voter_password):
    #     self.voter_password=generate_password_hash(voter_password)
    def to_dict(self):
        return {
            "voter_id": self.id,
            "voter_name": self.voter_name,
            "voter_email": self.voter_email,
            "election_id": self.election_id,
            "voter_key": self.voter_key,
            "voter_password": self.voter_password,
            "has_voted": self.has_voted
        }
    
    def check_voter_password(self, voter_password):
        # return check_password_hash(self.voter_password, voter_password)
        return self.voter_password == voter_password

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()