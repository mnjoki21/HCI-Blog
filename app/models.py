from app import db 
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime 

post_tags = db.Table('post_tags', 
    db.Column('post_id' , db.Integer , db.ForeignKey('posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer , db.ForeignKey('tags.id'), primary_key=True) 
    )

class User(UserMixin , db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer , primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullabe=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    posts = db.relationship('Post', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)

    def set_password(self,password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    
class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable = False)
    created_at = db.Column(db.Datetime, default=datetime.utcnow)
    updated_at  = db.Column(db.Datetime , onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer , db.ForeignKey('users.id'), nullable=False)

    comments = db.relationship('Comment', backref = 'post', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=post_tags, backref=db.backkref('posts', lazy=True))


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer , primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime , default=datetime.utcnow)
    user_id = db.Column(db.Integer , db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)