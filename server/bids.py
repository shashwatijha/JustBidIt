from flask import request, jsonify, Blueprint
from auth import db
from datetime import datetime

bid_bp = Blueprint('bid', __name__)

class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, nullable=False)
    bid_amount = db.Column(db.Float, nullable=False)
    auto_bid = db.Column(db.Boolean, default=False)
    max_limit = db.Column(db.Float)
    increment = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@bid_bp.route('/api/bid', methods=['POST'])
def create_bid():
    try:
        data = request.json

        bid = Bid(
            product_id=data['productId'],
            bid_amount=data['bidAmount'],
            auto_bid=data['autoBid'],
            max_limit=data.get('maxLimit'),
            increment=data.get('increment')
        )

        db.session.add(bid)
        db.session.commit()

        return jsonify({"message": "Bid submitted successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400