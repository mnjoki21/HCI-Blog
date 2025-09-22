from flask import Blueprint, jsonify, request
from . import db
from .models import Post

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return jsonify({'message': 'Blog API'})

@main_bp.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts])

@main_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())

@main_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    
    if not all(key in data for key in ['title', 'content', 'author']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if len(data['content']) > 1000:
        return jsonify({'error': 'Content exceeds 1000 characters'}), 400
    
    post = Post(
        title=data['title'],
        content=data['content'],
        author=data['author']
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify({'message': 'Post created', 'post': post.to_dict()}), 201

@main_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': "Post deleted successfully"}) ,200
