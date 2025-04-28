from flask import request, jsonify, Blueprint
from auth import db
from datetime import datetime

bid_bp = Blueprint('bid', __name__)

class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)  # Add this back
    bid_amount = db.Column(db.Float, nullable=False)  # 💵 assume this is USD
    auto_bid = db.Column(db.Boolean, default=False)
    max_limit = db.Column(db.Float)
    increment = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# 1️⃣ Route to place bid
@bid_bp.route('/api/bid', methods=['POST'])
def place_bid():
    try:
        data = request.json

        # Step 1: Save the incoming manual or auto bid
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

        # Step 2: Trigger auto-bidding if applicable
        handle_auto_bidding(new_bid)

        return jsonify({"message": "Bid submitted successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

def handle_auto_bidding(latest_bid):
    """
    After a new bid, check if any active auto-bidders
    can beat the latest bid within their max_limit.
    """
    from sqlalchemy import desc, func
    
    # Get the highest bid for this product
    highest_bid = Bid.query.filter_by(product_id=latest_bid.product_id).order_by(desc(Bid.bid_amount)).first()
    if not highest_bid:
        return
    
    # Find the latest auto-bid for each user (using subquery)
    latest_auto_bids_subq = db.session.query(
        Bid.user_id,
        func.max(Bid.created_at).label('latest_time')
    ).filter(
        Bid.product_id == latest_bid.product_id,
        Bid.auto_bid == True
    ).group_by(Bid.user_id).subquery()
    
    # Join to get the actual bid records
    active_auto_bidders = Bid.query.join(
        latest_auto_bids_subq,
        db.and_(
            Bid.user_id == latest_auto_bids_subq.c.user_id,
            Bid.created_at == latest_auto_bids_subq.c.latest_time
        )
    ).filter(
        Bid.product_id == latest_bid.product_id,
        Bid.auto_bid == True,
        Bid.user_id != highest_bid.user_id  # Skip if this user has the highest bid
    ).all()
    
    for auto_bidder in active_auto_bidders:
        current_bid_amount = auto_bidder.bid_amount

    # Keep increasing by increment
        while current_bid_amount + (auto_bidder.increment or 0) <= (auto_bidder.max_limit or 0):
            current_bid_amount += (auto_bidder.increment or 0)

        # Only place bid if it beats highest bid
            if current_bid_amount > highest_bid.bid_amount:
                new_auto_bid = Bid(
                    product_id=latest_bid.product_id,
                    user_id=auto_bidder.user_id,
                    bid_amount=current_bid_amount,
                    auto_bid=True,
                    max_limit=auto_bidder.max_limit,
                    increment=auto_bidder.increment
                )
                db.session.add(new_auto_bid)
                db.session.commit()

            # Update highest bid
                highest_bid = new_auto_bid

                break  # ✅ Place only one bid per auto-bidder for now