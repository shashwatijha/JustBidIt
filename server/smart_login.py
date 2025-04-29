from flask import Blueprint, request, jsonify
from sqlalchemy import text
import hashlib
from auth import db

smart_login_bp = Blueprint('smart_login', __name__, url_prefix='/admin')


@smart_login_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"status": "error", "message": "Missing username or password"}), 400

    password_hash = hashlib.sha256(password.encode()).hexdigest()
    admin_result = None  # Initialize to avoid UnboundLocalError
    rep_result = None    # Initialize to avoid UnboundLocalError
    print("Trying login for username:", username)
    print("Admin match found:", admin_result)
    print("Customer rep match found:", rep_result)

    try:
        with db.engine.connect() as conn:
            print("Attempting login for:", username)   # DEBUGGING
            # 1. Check Admin
            admin_result = conn.execute(
                text("SELECT * FROM admins WHERE username = :username AND password_hash = :password_hash"),
                {"username": username, "password_hash": password_hash}
            ).fetchone()

            if admin_result:
                print("Logged in as Admin:", username)   # DEBUGGING
                return jsonify({"status": "success", "role": "admin"})

            # 2. Check Customer Rep
            rep_result = conn.execute(
                text("SELECT * FROM customer_reps WHERE username = :username AND password_hash = :password_hash"),
                {"username": username, "password_hash": password_hash}
            ).fetchone()

            if rep_result:
                print("Logged in as Customer Rep:", username)   # DEBUGGING
                return jsonify({"status": "success", "role": "customer_rep"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    # 3. If nothing found
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401
