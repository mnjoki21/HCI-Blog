from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS 
import os

db = SQLAlchemy()
login_manager = LoginManager

def create_app():
    app = FLask(__name__)

    app.config.frm_object('app.config.Config')

    db.init_app(app)
    login_manager.init_app
    CORS(app, supports_credentials=True)

    from app.auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    with app.app_context():
        db.create_all()

    return app