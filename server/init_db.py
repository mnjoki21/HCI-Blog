from app  import create_app, db
from app.models import Post, User
from werkzeug.security import generate_password_hash

app = create_app()


with app.app_context():
    # Drop and create all tables
    db.drop_all()
    db.create_all()

        # Add sample users with properly hashed passwords
    sample_users = [
        User(
            username='njoki123',
            email='njoki@gmail.com'
        ),
        User(
            username='admin',
            email='admin@example.com'
        )
    ]
    
    # Set passwords using the set_password method
    sample_users[0].set_password('njoki123')
    sample_users[1].set_password('admin123')
    
    # Add sample data
    sample_posts = [
        Post(title="FLASK ORMS", 
             content="Mapping database tables into Python objects", 
             author="Mitchelle Njoki"),
        Post(title="SQLAlchemy", 
             content="Powerful SQL toolkit and ORM for Python", 
             author="Mitchelle Becky"),
        Post(title="Web Development", 
             content="Building web applications with Flask and SQLAlchemy", 
             author="John Doe")
    ]
    
    db.session.add_all(sample_posts)
    db.session.add_all(sample_users)

    db.session.commit()
    
    print("✅ Database initialized successfully!")
    print("📊 Sample posts added!")
    print("👥 Sample users added!")
    print(f"📋 Total users: {User.query.count()}")
    print(f"📋 Total posts: {Post.query.count()}")