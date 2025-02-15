from app import db
from datetime import datetime
# import hashlib


class Vote(db.Model):
    __tablename__ = 'votes'

    id = db.Column(db.Integer, primary_key=True)
    voter_id = db.Column(db.String(100), db.ForeignKey('voters.id', ondelete='CASCADE'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id', ondelete='CASCADE'), nullable=False)
    ballot_id = db.Column(db.Integer, db.ForeignKey('ballots.id', ondelete='CASCADE'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint(
            'voter_id', 'ballot_id', 
            name='one_vote_per_ballot'
        ),
    )

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

