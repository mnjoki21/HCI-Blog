from flask import Blueprint, request , jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import login_user, logout_user , login_required
from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__ , url_prefix='/auth')

@auth_bp.route('/register', methods=('GET', 'POST'))
def register():

    data = request.get_json()

    if not data: 
        return jsonify({'error': 'No JSON data provided'}), 400
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    error = None

    if not username:
        error = 'Username is required'
    elif not password:
            error = 'Password is required'
    elif User.query.filter_by(username=username).first() is not None:
            error = f'User {username} is already registered'
    elif email and User.query.filter_by(email= email).first() is not None:
          error = f'Email{email} is already registered'

    if error:
       return jsonify({'error': error}), 400
    
    try:
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message':'Registration successful',
            'user':user.to_dict()
        }), 201
    except Exception as e :
         db.session.rollback()
         return jsonify({'error': f'Error creating user: {str(e)}'}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data:
        return jsonify({'error':'No JSON data provided'}), 400
     
    username = data.get('username')
    password = data.get('password')

    error = None
    user = User.query.filter_by(username= username).first()

    if user is None:
        error = 'Incorrect username'
    elif not user.check_password(password):
        erro = "Incorrect password"

    if error:
        return jsonify({'error':error}), 401
    
    login_user(user)

    return jsonify({
        'message':'Logged in successfully',
        'user': user.to_dict()
    }),200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful!'}), 200

@auth_bp.route('/profile', methods=['GET'])
def profile():
    from flask_login import current_user
    return jsonify({'user':current_user.to_dict()}), 200

@auth_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()}), 200

# remove in production 
@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({'users': [user.to_dict() for user in users]}), 200

     
