from flask import request, jsonify, Blueprint
from auth import db
from datetime import datetime
from products import Product
bid_bp = Blueprint('bid', __name__)

class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    bid_amount = db.Column(db.Float, nullable=False)
    auto_bid = db.Column(db.Boolean, default=False)
    max_limit = db.Column(db.Float)
    increment = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@bid_bp.route('/api/bid', methods=['POST'])
def place_bid():
    try:
        data = request.json

        new_bid = Bid(
            product_id=data['productId'],
            user_id=data['userId'],
            bid_amount=float(data['bidAmount']),
            auto_bid=data['autoBid'],
            max_limit=float(data['maxLimit']) if data.get('maxLimit') else None,
            increment=float(data['increment']) if data.get('increment') else None
        )
        db.session.add(new_bid)
        db.session.commit()

        handle_bidding(product_id=data['productId'])
        return jsonify({"message": "Bid submitted successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

def handle_bidding(product_id):
    product = Product.query.get(product_id)
    if not product:
        print(f"[ERROR] Product ID {product_id} not found.")
        return

    auto_bids = Bid.query.filter_by(product_id=product_id, auto_bid=True)
    auto_bids = auto_bids.order_by(Bid.max_limit.desc()).limit(2).all()

    top_manual = Bid.query.filter_by(product_id=product_id, auto_bid=False)
    top_manual = top_manual.order_by(Bid.bid_amount.desc()).first()

    if not auto_bids and top_manual:
        product.bid_price = top_manual.bid_amount
        product.user_id = top_manual.user_id
        db.session.commit()
        print(f"[INFO] Manual-only: User {top_manual.user_id} leads product {product_id} @ ${top_manual.bid_amount}")
        return

    if not auto_bids:
        print("[INFO] No auto-bidders. Skipping.")
        return

    top_auto = auto_bids[0]
    current_user_id = top_auto.user_id
    current_price = top_auto.bid_amount
    increment = top_auto.increment or 1
    max_limit = top_auto.max_limit

    if len(auto_bids) > 1:
        second_limit = auto_bids[1].max_limit
        while current_price + increment <= second_limit and current_price + increment <= max_limit:
            current_price += increment

    if top_manual and top_manual.bid_amount > current_price:
        if top_manual.bid_amount < max_limit:
            while current_price + increment <= top_manual.bid_amount and current_price + increment <= max_limit:
                current_price += increment
            current_user_id = top_auto.user_id
        else:
            current_user_id = top_manual.user_id
            current_price = top_manual.bid_amount

    product.bid_price = current_price
    product.user_id = current_user_id 
    db.session.commit()
    print(f"[INFO] Bid processed. Product {product_id} → ${current_price} (Lead: User {current_user_id})")
