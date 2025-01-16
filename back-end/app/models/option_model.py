from app.models import db

class Option(db.Model):
    __tablename__ = 'option'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False)
    description = db.Column(db.Text, nullable=True)
    # photo = db.Column(db.LargeBinary, nullable=True)
    ballot_id = db.Column(db.Integer, db.ForeignKey('ballot.id'), nullable=False)
    ballot = db.relationship('Ballot', backref='option', foreign_keys=[ballot_id])

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()