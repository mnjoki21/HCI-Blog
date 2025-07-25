from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Post, Tag, Comment
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/', methods=['GET'])
def get_posts():
    page = request.args.get('page', 1 ,type=int)
    per_page = request.args.get('per_page', 10, type=int)

    posts = Post.query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page)

    return jsonify ({
        'posts':[{
            'id': post.id,
            'title':post.title,
            'content' :post.content,
            'created_at':post.created_at.isoformart(),
            'author':post.author.username,
            'comment_count':len(post.comments)
        } for post in posts.items],
        'total': posts.total,
        'pages':posts.pages,
        'current_page':posts.page
    })

@posts_bp.route('/<int:pos_id>' , methods=['GET'])
def get_post(post_id):
    post = Post.query.get_or_404(post_id)

    return jsonify({
        'id':post.id, 
        'title': post.title,
        'content':post.content,
        'created_at':post.created_at.isoformat(),
        'updated_at':post.updated_at.isoformat() if post.updated_at else None,
        'author':{
            'id':post.author.id,
            'username':post.author.username 
        },
        'comments':[{
            'id':comment.id,
            'content':comment.content,
            'created_at':comment.created_at.isoformart(),
            'user': {
                'id':comment.user.id,
                'username':comment.user.username
            }
        } for comment in post.comments], 
        'tags':[tag.name for tag in post.tags]
   })

@posts_bp.route('/', methods=['POST'])
@login_required
def create_post():
    data = request.get_json()

    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error':"Missing title or content"}), 400
    
    try:
        post = Post(
            title =data['title'],
            content= data['content'],
            user_id=current_user.id,
            created_at=datetime.utcnow()
        )

        if 'tags' in data and isinstance(data['tags'], list):
            for tag_name in data ['tags'] :
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                   tag = Tag(name= tag_name)
                   db.session.add(tag)
                post.tags.append(tag)

        db.session.add(post)
        db.session.commit()

        return jsonify ({
            'message':'Post created successfully',
            'post':{
                'id':post.id,
                'title':post.title
            }
        }),201
    except SQLAlchemyError as e:
          db.session.rollback()
          return jsonify({'error':str(e)}), 500

@posts_bp.route('/<int:post_id>', method=['PUT'])
@login_required
def update_post(post_id):
    post = Post.query.get_or_404(post_id)

    if post.user_id != current_user.id:
        return jsonify({'error': 'You are not authorised to edit this post'}), 403
    
    data = request.get_json()

    if not data:
        return jsonify({'error':'No data provided'}), 400


    try:
        if 'title' in data:
            post.title = data['title']
        if 'content' in data:
            post.content = data['content']
        post.updated_at = datetime.timezone.utc()

        if 'tags' in data and isinstance(data['tags'] , list):
            for tag_name in data['tags']:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag = Tag(name=tag_name)
                    db.session.add(tag)
                post.tags.append(tag)
      
        db.session.commit()

        return jsonify({
            'message': 'Post updated successfully',
            'post':{'id':post.id,
                    'title':post.title
                    }
        }), 
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@posts_bp.route('/<int:post_id>', methods=['DELETE'])
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    
    if post.user_id != current_user.id:
        return jsonify({'error': 'You are not authorized to delete this post'}), 403
    
    try:
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'})
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


    
@posts_bp.route('/<int:post_id>/comments', methods=['POST'])
@login_required
def add_comment(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Comment content is required'}), 400
    
    try:
        comment = Comment(
            content=data['content'],
            user_id=current_user.id,
            post_id=post.id,
            created_at=datetime.utcnow()
        )  

        db.session.add(comment)
        db.session.commit()
        
        return jsonify({
            'message': 'Comment added successfully',
            'comment': {
                'id': comment.id,
                'content': comment.content
            }
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    
        

