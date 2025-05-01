from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from auth import db
import os

product_bp = Blueprint('product', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    price = db.Column(db.Float)  # 💵 price stored in USD
    brand = db.Column(db.String(255))
    storage = db.Column(db.String(255))
    ram = db.Column(db.String(255))
    color = db.Column(db.String(100))
    screen_size = db.Column(db.String(100))
    reserve_price = db.Column(db.Float)  # 💵 reserve price in USD
    closing_date = db.Column(db.DateTime)
    image_filename = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default= datetime.now())
    user_id = db.Column(db.Float)
    bid_price = db.Column(db.Float)
    winner_notified = db.Column(db.Boolean, default=False)



@product_bp.route('/api/auctions', methods=['POST'])
def create_product():
    try:
        form = request.form
        image = request.files.get('productImage')
        filename = None

        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(UPLOAD_FOLDER, filename))

        product = Product(
            name=form['name'],
            price=float(form['price']),  # 💵 price in USD
            brand=form['brand'],
            storage=form['storage'],
            ram=form['ram'],
            color=form['color'],
            screen_size=form['screenSize'],
            reserve_price = float(form['reservePrice']) if form.get('reservePrice') not in [None, '', 'null'] else None,

            closing_date=form['closingDate'],
            image_filename=filename
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({"message": "Product added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# 🔵 Get All Products API
@product_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        result = []

        for product in products:
            result.append({
                "id": product.id,
                "name": product.name,
                "price": round(product.price, 2),  # 💵 show two decimals
                "brand": product.brand,
                "storage": product.storage,
                "ram": product.ram,
                "color": product.color,
                "screen_size": product.screen_size,
                "reserve_price": round(product.reserve_price, 2) if product.reserve_price is not None else None,

                "closing_date": product.closing_date.strftime('%Y-%m-%d %H:%M:%S'),
                "image_url": f"http://localhost:8000/uploads/{product.image_filename}"
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🔵 Get Specific Product by ID API
@product_bp.route('/api/product', methods=['GET'])
def get_product_by_id():
    try:
        product_id = request.args.get('id')
        if not product_id:
            return jsonify({"error": "Missing product ID"}), 400

        product = Product.query.get(product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        result = {
            "id": product.id,
            "name": product.name,
            "price": round(product.price, 2),  # 💵 two decimal formatting
            "brand": product.brand,
            "storage": product.storage,
            "ram": product.ram,
            "color": product.color,
            "screen_size": product.screen_size,
            "reserve_price": round(product.reserve_price, 2) if product.reserve_price is not None else None,

            "closing_date": product.closing_date.strftime('%Y-%m-%d %H:%M:%S'),
            "image_url": f"http://localhost:8000/uploads/{product.image_filename}"
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# @product_bp.route('/api/winner', methods=['GET'])
# def get_auction_winner():
#     product_id = request.args.get('id')

#     product = Product.query.get(product_id)


#     if datetime.utcnow() < product.closing_date:
#         return

#     create_notification(
#         user_id=winner_user_id,
#         message=f"Congratulations! You have won the auction for product ID {product_id}.",
#         notif_type='winner'
#         )
        
#     if product.bid_price and product.user_id:
#         return jsonify({
#             "winner_user_id": int(product.user_id),
#             "winning_bid": round(product.bid_price, 2),
#             "product_id": product.id,
#             "product_name": product.name
#         }), 200
    
    

#     else:
#         return jsonify({"message": "No bids were placed for this product"}), 200



# @product_bp.route('/api/winner', methods=['GET'])
# def get_auction_winner():
#     product_id = request.args.get('id')

#     product = Product.query.get(product_id)


#     if datetime.utcnow() < product.closing_date:
#         return

#     create_notification(
#         user_id=winner_user_id,
#         message=f"Congratulations! You have won the auction for product ID {product_id}.",
#         notif_type='winner'
#         )
        
#     if product.bid_price and product.user_id:
#         return jsonify({
#             "winner_user_id": int(product.user_id),
#             "winning_bid": round(product.bid_price, 2),
#             "product_id": product.id,
#             "product_name": product.name
#         }), 200
    
    

#     else:
#         return jsonify({"message": "No bids were placed for this product"}), 200
