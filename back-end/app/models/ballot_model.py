from app.models import db

class Ballot(db.Model):
    __tablename__ = 'ballot'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    election_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    election = db.relationship('Election', backref='ballot')
    # total_votes = db.Column(db.Integer)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()