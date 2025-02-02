from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    elections = db.relationship('Election', backref='admin', lazy=True)

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
