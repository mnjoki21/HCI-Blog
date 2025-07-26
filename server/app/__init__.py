from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS 
import os

db = SQLAlchemy()
login_manager = LoginManager()
cors = CORS()

@login_manager.user_loader
def load_user(user_id):
    from app.models import User
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__)

    app.config.from_object('app.config.Config')

    db.init_app(app)

    login_manager.init_app(app)
    login_manager.login_view='auth.login'
    
    CORS(app, supports_credentials=True, resources={
        r"/auth/*":{
            "origins":["http://localhost:3000"],
            "methods":["GET","POST","PUT","DELETE"],
            "allow_headers":['Content-Type', 'Authorization']
        },
        r"/posts/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ['Content-Type', 'Authorization']
    }
    })

    from app.auth.routes import auth_bp
    from app.posts.routes import posts_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(posts_bp, url_prefix='/posts')


    with app.app_context():
        db.create_all()

    return app