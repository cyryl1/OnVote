from flask import Blueprint

bp = Blueprint('routes', __name__)

from app.routes import auth
from app.routes import admin
from app.routes import voter
