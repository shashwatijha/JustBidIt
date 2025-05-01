from flask import Blueprint, request, render_template, redirect, url_for, session, jsonify
from sqlalchemy import text
import hashlib
from auth import db 

support_bp = Blueprint('support', __name__, url_prefix='/api')

# Customer Rep password reset
@support_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400

    try:
        with db.engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM customer_reps WHERE username = :username"),
                {"username": username}
            ).fetchone()

            if not result:
                return jsonify({"status": "fail", "message": "Customer Rep not found"}), 404

            conn.execute(
                text("INSERT INTO password_reset_requests (username) VALUES (:username)"),
                {"username": username}
            )
            conn.commit()

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({"status": "success", "message": "Reset request sent to admin."})

# Customer Rep get users
@support_bp.route('/customer-rep/get-users', methods=['GET'])
def get_users():
    try:
        with db.engine.connect() as conn:
            rows = conn.execute(text("""
                SELECT id, username, email, created_at, account_type, full_name, business_name, country
                FROM users
            """)).fetchall()
            users = [
                {
                    "id": r.id,
                    "username": r.username,
                    "email": r.email,
                    "created_at": r.created_at,
                    "account_type": r.account_type,
                    "full_name": r.full_name,
                    "business_name": r.business_name,
                    "country": r.country
                }
                for r in rows
            ]
            return jsonify({"status": "success", "users": users})
    except Exception as e:
        print("GET USERS ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# Customer Rep edit user
@support_bp.route('/customer-rep/update-user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    try:
        with db.engine.connect() as conn:
            conn.execute(text("""
                UPDATE users SET 
                  username = :username,
                  email = :email,
                  full_name = :full_name,
                  business_name = :business_name,
                  account_type = :account_type,
                  country = :country
                WHERE id = :user_id
            """), {
                "username": data["username"],
                "email": data["email"],
                "full_name": data["full_name"],
                "business_name": data["business_name"],
                "account_type": data["account_type"],
                "country": data["country"],
                "user_id": user_id
            })
            conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print("UPDATE USER ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# Customer Rep Delete Users
@support_bp.route('/customer-rep/delete-user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        with db.engine.connect() as conn:
            conn.execute(text("DELETE FROM users WHERE id = :id"), {"id": user_id})
            conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print("DELETE USER ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# Customer Rep get bids
@support_bp.route('/customer-rep/get-bids', methods=['GET'])
def get_bids():
    try:
        with db.engine.connect() as conn:
            rows = conn.execute(text("""
                SELECT b.id, p.name AS product_name, u.username, b.bid_amount
                FROM bids b
                JOIN products p ON b.product_id = p.id
                JOIN users u ON b.user_id = u.id
            """)).fetchall()
            bids = [{"id": r.id, "product_name": r.product_name, "username": r.username, "bid_amount": r.bid_amount} for r in rows]
            return jsonify({"status": "success", "bids": bids})
    except Exception as e:
        print("GET BIDS ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
    
# Customer Rep delete bid
@support_bp.route('/customer-rep/delete-bid/<int:bid_id>', methods=['DELETE'])
def delete_bid(bid_id):
    try:
        with db.engine.connect() as conn:
            conn.execute(text("DELETE FROM bids WHERE id = :id"), {"id": bid_id})
            conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print("DELETE BID ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
# TEMP FAQ list for testing
faq_list = []

# User create FAQ
@support_bp.route('/faq/create', methods=['POST'])
def create_faq():
    data = request.get_json()
    question = data.get('question')
    user_id = data.get('user_id')

    if not question or not user_id:
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    try:
        with db.engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO faq (user_id, question, answered) 
                VALUES (:user_id, :question, FALSE)
            """), {"user_id": user_id, "question": question})
            conn.commit()
        return jsonify({"status": "success", "message": "FAQ added"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@support_bp.route('/faq', methods=['GET'])
def get_faqs():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("SELECT id, user_id, question, answer, answered FROM faq")).fetchall()
            faqs = [
                {
                    "id": row.id,
                    "user_id": row.user_id,
                    "question": row.question,
                    "answer": row.answer,
                    "answered": row.answered
                } for row in result
            ]
        return jsonify({"status": "success", "faqs": faqs}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@support_bp.route('/faq/unanswered', methods=['GET'])
def get_unanswered_faqs():
    try:
        with db.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT f.id, f.user_id, f.question, u.username
                FROM faq f
                JOIN users u ON f.user_id = u.id
                WHERE f.answered = FALSE
            """)).fetchall()
            faqs = [
                {
                    "id": row.id,
                    "user_id": row.user_id,
                    "question": row.question,
                    "username": row.username
                } for row in result
            ]
        return jsonify({"status": "success", "faqs": faqs}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@support_bp.route('/faq/answer/<int:faq_id>', methods=['PUT'])
def answer_faq(faq_id):
    data = request.get_json()
    answer = data.get('answer')

    if not answer:
        return jsonify({"status": "error", "message": "Answer is required"}), 400

    try:
        with db.engine.connect() as conn:
            conn.execute(text("""
                UPDATE faq SET answer = :answer, answered = TRUE
                WHERE id = :id
            """), {"answer": answer, "id": faq_id})
            conn.commit()
        return jsonify({"status": "success", "message": "FAQ answered"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@support_bp.route('/customer-rep/delete-auction/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        with db.engine.connect() as conn:
            conn.execute(text("DELETE FROM products WHERE id = :id"), {"id": product_id})
            conn.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        print("DELETE PRODUCT ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

    

@support_bp.route('/customer-rep/get-auctions', methods=['GET'])
def get_auctions():
    try:
        with db.engine.connect() as conn:
            rows = conn.execute(text("""
                SELECT p.id, p.name, p.brand, p.price, p.closing_date, u.username AS seller
                FROM products p
                LEFT JOIN users u ON p.user_id = u.id
            """)).fetchall()
            auctions = [
                {
                    "id": r.id,
                    "name": r.name,
                    "brand": r.brand,
                    "price": r.price,
                    "closing_date": r.closing_date,
                    "seller": r.seller or "N/A"
                } for r in rows
            ]
        return jsonify({"status": "success", "auctions": auctions})
    except Exception as e:
        print("GET PRODUCTS ERROR:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
