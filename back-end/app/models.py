from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4


db = SQLAlchemy()

class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Admin {self.id} - {self.name}>'
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Election(db.Model):
    __tablename__ = 'election'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    start_time = db.Column(db.Date, nullable=False, default=datetime.now)
    end_time = db.Column(db.Date, nullable=False, default=datetime.now)


class Ballot(db.Model):
    __tablename__ = 'ballot'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    election = db.relationship('Election', backref='ballot')
    total_votes = db.Column(db.Integer)

class Candidate(db.Model):
    __tablename__ = 'candidate'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    ballot_id = db.Column(db.Integer, db.ForeignKey('ballot.id'), nullable=False)
    ballot = db.relationship('Ballot', backref='candidate')
    vote = db.Column(db.Integer)

# class Vote(db.Model):
#     __tablename__ = 'vote'

#     id = db.Column(db.Integer, primary_key=True)
#     candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
#     candidate = db.relationship('Candidate', backref='vote')

# class Result(db.Model):
#     __tablename__ ='result'

#     id = db.Column(db.Integer, primary_key=True)
#     candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
#     candidate = db.relationship('Candidate', backref='result')

class Voter(db.Model):
    __tablename__ = 'voter'

    id = db.Column(db.Integer, primary_key=True)
    voter_key = db.Column(db.String(150), nullable=False)
    voter_password = db.Column(db.String(150), nullable=False)
