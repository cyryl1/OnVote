from app.models import db
from datetime import datetime

class Election(db.Model):
    __tablename__ = 'election'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    start_time = db.Column(db.Date, nullable=False, default=datetime.now)
    end_time = db.Column(db.Date, nullable=False, default=datetime.now)