from flask import Blueprint, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
auth_bp = Blueprint('auth', __name__)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)  # "personal" or "business"
    full_name = db.Column(db.String(100), nullable=True)  # Only for personal accounts
    business_name = db.Column(db.String(100), nullable=True)  # Only for business accounts
    country = db.Column(db.String(100), nullable=False)

@auth_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = [
        {"id": user.id, "email": user.email, "username": user.username}
        for user in users
    ]
    return jsonify(user_list)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"status": "error", "message": "Missing email or password"}), 400

    user = User.query.filter_by(email=email, password=password).first()

    if user:
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        })
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    account_type = data.get("accountType")  # "personal" or "business"
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    country = data.get("country")
    full_name = data.get("fullName") if account_type == "personal" else None
    business_name = data.get("businessName") if account_type == "business" else None

    print("Received POST to /signup")
    print("Request JSON:", request.json)

    # Validate required fields
    if not email or not username or not password or not confirm_password or not country:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    if password != confirm_password:
        return jsonify({"status": "error", "message": "Passwords do not match"}), 400

    # Check if email or username already exists
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Email or username already exists"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)
    print("SIGNUP DATA:", data)

    # Create a new user
    new_user = User(
    email=email,
    username=username,
    password=hashed_password,
    account_type=account_type,
    full_name=full_name,
    business_name=business_name,
    country=country
)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User registered successfully"}), 201