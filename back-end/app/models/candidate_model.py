from app.models import db

class Candidate(db.Model):
    __tablename__ = 'candidate'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    ballot_id = db.Column(db.Integer, db.ForeignKey('ballot.id'), nullable=False)
    ballot = db.relationship('Ballot', backref='candidate')
    vote = db.Column(db.Integer)