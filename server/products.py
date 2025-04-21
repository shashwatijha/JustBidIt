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
