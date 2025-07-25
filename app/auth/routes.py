from flask import Blueprint , request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user , logout_user , current_user , login_required
from app.models import db, User
from datetime import datetime
from app.utils import validate_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error':'Missing required fields'}), 400
    
    if len(data['username']) < 3:
        return jsonify({'error' : 'Username must be at lesst 3 characters'}), 400
    
    if not validate_email(data['email']):
        return jsonify({'error': 'Inavlid email format'}), 400
    
    if len(data['password']) < 6 :
        return jsonify({'error':'Password must be at lesst 6 characters'}), 400
    
    if User.query.filter_by(username = data ['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'email already exists'}), 409
    
    try:
        new_user = User(
            username = data['username'],
            email=data['email'],
            created_at = datetime.utcnow()
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)

        return jsonify({
            'message':'User created successfully',
            'user':{
                'id' : new_user.id,
                'username': new_user.username, 
                'email':new_user.email
            }
        }) , 201
    except Exception as e :
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(Username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error' : 'Invalid username or password'}), 401
    
    login_user(user)
    return jsonify({
        'message':'Logged in successfully',
        'user': {
            'id':user.id,
            'username':user.username,
            'email':user.email
        }
      })

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message':'Logged out successfully'})

@auth_bp.route('/status' , methods=['GET'])
def status ():
    if current_user.is_authenticated:
        return jsonify({
            'isAuthenicated': True,
            'user':{
                'id':current_user.id,
                'username': current_user.username,
                'email': current_user.email 
            }
        })
    return jsonify({'isAuthenticated': False})
    