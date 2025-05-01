from flask import Blueprint, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import smtplib
import ssl
import string
import random
from email.mime.text import MIMEText

# Initialize DB and Blueprint
db = SQLAlchemy()
auth_bp = Blueprint('auth', __name__)

# ---------- MODELS ----------

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    business_name = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=False)

class PasswordReset(db.Model):
    __tablename__ = 'password_resets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    user = relationship("User", backref="reset_requests")

# ---------- HELPERS ----------

def generate_token(length=32):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def send_reset_email(recipient_email, token):

    sender_email = "justbidittest@gmail.com"
    app_password = "nwatbaohmbwrftnk"  # no spaces
    reset_link = f"http://localhost:3000/reset-password?token={token}"

    try:
        message = MIMEText(f"Click the link to reset your password:\n\n{reset_link}", "plain")
        message['Subject'] = 'Reset Your Password'
        message['From'] = sender_email
        message['To'] = recipient_email

        print("Connecting to Gmail SMTP...")
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            print("Logging in...")
            server.login(sender_email, app_password)
            print("Sending email to:", recipient_email)
            server.sendmail(sender_email, recipient_email, message.as_string())
            print("Email sent successfully.")
    except Exception as e:
        print("Email sending failed:", e)
        raise

# ---------- ROUTES ----------

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

    user = User.query.filter_by(email=email).first()
    # if user and check_password_hash(user.password, password):
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
    account_type = data.get("accountType")
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")
    country = data.get("country")
    full_name = data.get("fullName") if account_type == "personal" else None
    business_name = data.get("businessName") if account_type == "business" else None
    if not email or not username or not password or not confirm_password or not country:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    if password != confirm_password:
        return jsonify({"status": "error", "message": "Passwords do not match"}), 400

    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Email or username already exists"}), 400

    
    new_user = User(
        email=email,
        username=username,
        password=password,
        account_type= account_type,
        full_name=full_name,
        business_name=business_name,
        country=country
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User registered successfully"}), 201

@auth_bp.route("/request-reset", methods=["POST"])
def request_reset():
    data = request.json
    email = data.get("email")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"status": "error", "message": "No account with that email"}), 404

    token = generate_token()
    expiration = datetime.utcnow() + timedelta(minutes=15)

    PasswordReset.query.filter_by(user_id=user.id).delete()
    reset = PasswordReset(user_id=user.id, token=token, expires_at=expiration)
    db.session.add(reset)
    db.session.commit()

    try:
        send_reset_email(user.email, token)
        return jsonify({"status": "success", "message": "Reset link sent"}), 200
    except Exception as e:
        print("Email error:", e)
        return jsonify({"status": "error", "message": "Failed to send email"}), 500

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("newPassword")

    reset_entry = PasswordReset.query.filter_by(token=token).first()
    if not reset_entry or reset_entry.expires_at < datetime.utcnow():
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 400

    user = User.query.get(reset_entry.user_id)
    user.password = generate_password_hash(new_password)
    db.session.delete(reset_entry)
    db.session.commit()

    return jsonify({"status": "success", "message": "Password has been reset"}), 200
