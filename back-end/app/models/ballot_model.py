from app import db
from sqlalchemy import event

class Ballot(db.Model):
    __tablename__ = 'ballots'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    election_id = db.Column(db.Integer, db.ForeignKey('elections.id'), nullable=False)
    description = db.Column(db.Text)

    # Relationships
    candidates = db.relationship('Candidate', backref='ballot', cascade='all, delete-orphan', lazy='dynamic')
    votes = db.relationship('Vote', backref='ballot', cascade='all, delete-orphan')

   
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'election_id': self.election_id,
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
