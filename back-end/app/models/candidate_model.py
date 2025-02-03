from app import db

class Candidate(db.Model):
    __tablename__ = 'candidates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    ballot_id = db.Column(db.Integer, db.ForeignKey('ballots.id', ondelete='CASCADE'), nullable=False)
    bio = db.Column(db.Text)
    # photo_url = db.Column(db.String(255))

    # Relatioships
    votes = db.relationship('Vote', backref='candidate', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'ballot_id': self.ballot_id,
            'bio': self.bio
        }


    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

