from app.models import db

class Voter(db.Model):
    __tablename__ = 'voter'

    id = db.Column(db.Integer, primary_key=True)
    voter_key = db.Column(db.String(150), nullable=False)
    voter_password = db.Column(db.String(150), nullable=False)