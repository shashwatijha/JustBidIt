from flask import request, jsonify, Blueprint
from auth import db
from datetime import datetime
from products import Product
from notifications import create_notification
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
    created_at = db.Column(db.DateTime, default=datetime.now())

class BidHistory(db.Model):
    __tablename__ = 'bid_history'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    bid_amount = db.Column(db.Float)
    auto_bid = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.now())


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

    auto_bids = Bid.query.filter_by(product_id=product_id, auto_bid=True).order_by(Bid.max_limit.desc()).limit(2).all()
    top_manual = Bid.query.filter_by(product_id=product_id, auto_bid=False).order_by(Bid.bid_amount.desc()).first()

    current_user_id = None
    current_price = product.bid_price or 0

    if not auto_bids and top_manual:
        current_user_id = top_manual.user_id
        current_price = top_manual.bid_amount
    elif auto_bids:
        top_auto = auto_bids[0]
        current_user_id = top_auto.user_id
        current_price = top_auto.bid_amount
        increment = top_auto.increment or 1
        max_limit = top_auto.max_limit

        if len(auto_bids) > 1:
            second_limit = auto_bids[1].max_limit
            while current_price + increment <= second_limit and current_price + increment <= max_limit:
                current_price += increment

        if top_manual and top_manual.bid_amount >= current_price:
            while current_price + increment <= max_limit and current_price <= top_manual.bid_amount:
                current_price += increment

            if current_price > top_manual.bid_amount:
                current_user_id = top_auto.user_id
            else:
                current_user_id = top_manual.user_id
                current_price = top_manual.bid_amount

    if current_user_id is None:
        return

    # Update product
    product.bid_price = current_price
    product.user_id = current_user_id

    # Add to BidHistory (always for final winning state)
    history_entry = BidHistory(
        product_id=product.id,
        user_id=current_user_id,
        bid_amount=current_price,
        auto_bid=bool(Bid.query.filter_by(product_id=product.id, user_id=current_user_id, auto_bid=True).first()),
        created_at=datetime.now()
    )
    db.session.add(history_entry)

    # Notify other bidders
    previous_bidders = db.session.query(Bid.user_id).filter(
        Bid.product_id == product.id,
        Bid.user_id != current_user_id
    ).distinct().all()

    for (uid,) in previous_bidders:
        if Bid.query.filter_by(product_id=product.id, user_id=uid, auto_bid=True).first():
            create_notification(
                user_id=uid,
                message=f"Your auto bid max limit was exceeded on {product.name}.",
                notif_type='auto_bid_limit_exceeded'
            )
        else:
            create_notification(
                user_id=uid,
                message=f"You were outbid on {product.name}.",
                notif_type='outbid'
            )

    db.session.commit()
    print(f"[INFO] Final Bid: Product {product_id} → ${current_price} (Lead: User {current_user_id})")


@bid_bp.route('/api/bids/user/<int:user_id>', methods=['GET'])
def get_user_bids(user_id):
    bids = db.session.query(Bid, Product).join(Product, Bid.product_id == Product.id, isouter=True).filter(Bid.user_id == user_id).all()
    result = [{
        "product_name": p.name,
        "brand": p.brand,
        "image_url": p.image_filename,
        "bid_amount": b.bid_amount,
        "created_at": b.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "auto_bid": b.auto_bid,
        "max_limit": b.max_limit,
        "increment": b.increment,
        "closing_date": p.closing_date.strftime("%Y-%m-%dT%H:%M:%S") if p.closing_date else None
    } for b, p in bids]
    return jsonify(result), 200

@bid_bp.route('/api/bid-history/<int:product_id>', methods=['GET'])
def get_bid_history(product_id):
    bids = BidHistory.query.filter_by(product_id=product_id).order_by(BidHistory.created_at.asc()).all()
    result = [{
        "user_id": bid.user_id,
        "bid_amount": bid.bid_amount,
        "auto_bid": bid.auto_bid,
        "created_at": bid.created_at.strftime("%Y-%m-%d %H:%M:%S")
    } for bid in bids]
    return jsonify(result), 200
