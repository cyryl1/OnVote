from app import db
from datetime import datetime
# from sqlalchemy import event

class Election(db.Model):
    __tablename__ = 'elections'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='draft')

    # Relationships
    ballots = db.relationship('Ballot', backref='election', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'title': self.title,
            'description': self.description,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'created_at': self.created_at,
            'status': self.status
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    