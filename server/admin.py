from flask import Blueprint, request, render_template, redirect, url_for, session, jsonify
from sqlalchemy import text
import hashlib
from auth import db 
from sqlalchemy.exc import IntegrityError

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Admin dashboard (protected)
@admin_bp.route('/dashboard')
def admin_dashboard():
    if 'admin_id' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    return jsonify({"status": "success", "message": "Welcome to Admin Dashboard!"})

# Create Customer Rep
@admin_bp.route('/create-customer-rep', methods=['POST'])
def create_customer_rep():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Both username and password are required."
        }), 400

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        with db.engine.begin() as conn:  # Automatically handles commit/rollback
            conn.execute(
                text("""
                    INSERT INTO customer_reps (username, password_hash)
                    VALUES (:username, :password_hash)
                """),
                {"username": username, "password_hash": password_hash}
            )

    except IntegrityError as e:
        # Check if it's a duplicate username error
        if 'unique constraint' in str(e).lower() or 'duplicate key' in str(e).lower():
            return jsonify({
                "status": "error",
                "message": f"The username '{username}' is already taken. Please choose another."
            }), 409  # 409 = Conflict
        return jsonify({
            "status": "error",
            "message": "An unexpected database error occurred."
        }), 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Server error: {str(e)}"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Customer Representative created successfully."
    }), 201
# Admin: Generate Sales Report
@admin_bp.route('/generate-sales-report', methods=['GET'])
def generate_sales_report():
    try:
        with db.engine.connect() as conn:
            # Total earnings
            total_earnings_result = conn.execute(text("""
                SELECT SUM(bid_amount) AS total_earnings FROM bids
            """)).fetchone()

            # Earnings by item
            earnings_by_item = conn.execute(text("""
                SELECT p.name AS item_name, SUM(b.bid_amount) AS earnings
                FROM bids b
                JOIN products p ON b.product_id = p.id
                GROUP BY p.id
                ORDER BY earnings DESC
            """)).fetchall()

            # Best-selling items
            best_selling_items = conn.execute(text("""
                SELECT p.name AS item_name, COUNT(b.id) AS total_bids
                FROM bids b
                JOIN products p ON b.product_id = p.id
                GROUP BY p.id
                ORDER BY total_bids DESC
                LIMIT 5
            """)).fetchall()

            # Earnings by brand
            earnings_by_brand = conn.execute(text("""
                SELECT p.brand, SUM(b.bid_amount) AS total
                FROM bids b
                JOIN products p ON b.product_id = p.id
                GROUP BY p.brand
                ORDER BY total DESC
            """)).fetchall()

            report = {
                "total_earnings": total_earnings_result.total_earnings if total_earnings_result else 0,
                "earnings_by_item": [
                    {"item_name": row.item_name, "earnings": row.earnings} for row in earnings_by_item
                ],
                "earnings_by_brand": [
                    {"brand": row.brand, "total": row.total} for row in earnings_by_brand
            ],
                "best_selling_items": [
                    {"item_name": row.item_name, "total_bids": row.total_bids} for row in best_selling_items
                ]
            }
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({"status": "success", "report": report})

# View pending customer rep password reset requests
@admin_bp.route('/reset-requests', methods=['GET'])
def get_reset_requests():

    with db.engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT id, username FROM password_reset_requests WHERE status = 'pending'
        """)).fetchall()

        return jsonify({
            "status": "success",
            "requests": [{"id": r.id, "username": r.username} for r in rows]
        })
# Approve a password reset request
@admin_bp.route('/reset-password', methods=['POST'])
def reset_customer_rep_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('password')

    if not username or not new_password:
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    hashed_pw = hashlib.sha256(new_password.encode()).hexdigest()

    with db.engine.connect() as conn:
        conn.execute(text("""
            UPDATE customer_reps SET password_hash = :pw WHERE username = :uname
        """), {"pw": hashed_pw, "uname": username})

        conn.execute(text("""
            UPDATE password_reset_requests SET status = 'resolved' WHERE username = :uname
        """), {"uname": username})

        conn.commit()

    return jsonify({"status": "success", "message": "Password reset successful"})   

# Admin logout
@admin_bp.route('/logout')
def admin_logout():
    return jsonify({"status": "success", "message": "Logged out."})
