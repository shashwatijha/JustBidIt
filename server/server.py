from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask import send_from_directory
from flask_cors import CORS
from auth import auth_bp, db
from products import product_bp
from bids import bid_bp
import os
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost:3306/aos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(bid_bp)



    
@app.route('/test-db')
def test_db():
    try:
        with app.app_context():
            db.session.execute(text('SELECT 1'))
        return jsonify({"status": "success", "message": "Database connection successful!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

def check_ended_auctions():
    with app.app_context():  # ✅ Needed for db access in background
        ended_products = Product.query.filter(Product.closing_date < datetime.utcnow()).all()
        for product in ended_products:
            winner_id = product.user_id
            if winner_id:
                create_notification(
                    user_id=winner_id,
                    message=f"You've won the auction for {product.name}!",
                    notif_type='winner'
                )
                # Optionally: add a product.winner_notified = True and save

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_ended_auctions, trigger="interval", minutes=1)
scheduler.start()

if __name__ == "__main__":
    app.run(port=8000, debug=True)
