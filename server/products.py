from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime
from auth import db
import os

product_bp = Blueprint('product', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    price = db.Column(db.Float)
    brand = db.Column(db.String(255))
    storage = db.Column(db.String(255))
    ram = db.Column(db.String(255))
    color = db.Column(db.String(100))
    screen_size = db.Column(db.String(100))
    reserve_price = db.Column(db.Float)
    closing_date = db.Column(db.DateTime)
    image_filename = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
            price=form['price'],
            brand=form['brand'],
            storage=form['storage'],
            ram=form['ram'],
            color=form['color'],
            screen_size=form['screenSize'],
            reserve_price=form['reservePrice'],
            closing_date=form['closingDate'],
            image_filename=filename
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({"message": "Product added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
@product_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        result = []

        for product in products:
            result.append({
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "brand": product.brand,
                "storage": product.storage,
                "ram": product.ram,
                "color": product.color,
                "screen_size": product.screen_size,
                "reserve_price": product.reserve_price,
                "closing_date": product.closing_date.strftime('%Y-%m-%d %H:%M:%S'),
                "image_url": f"http://localhost:8000/uploads/{product.image_filename}"
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_bp.route('/api/product', methods=['GET'])
def get_product_by_id():
    product_id = request.args.get('id')
    if not product_id:
        return jsonify({"error": "Missing product ID"}), 400

    product = Product.query.get(product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    result = {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "brand": product.brand,
        "storage": product.storage,
        "ram": product.ram,
        "color": product.color,
        "screen_size": product.screen_size,
        "reserve_price": product.reserve_price,
        "closing_date": product.closing_date.strftime('%Y-%m-%d %H:%M:%S'),
        "image_url": f"http://localhost:8000/uploads/{product.image_filename}"
    }

    return jsonify(result), 200

