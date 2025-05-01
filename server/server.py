# from flask import Flask, jsonify, send_from_directory
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import text
# from flask_cors import CORS
# from auth import auth_bp, db
# from products import product_bp, Product
# from bids import bid_bp
# from bids import Bid
# from notifications import notification_bp, create_notification 
# import os
# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import datetime, timezone

# app = Flask(__name__)
# CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost:3306/aos'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db.init_app(app)
# app.register_blueprint(auth_bp)
# app.register_blueprint(product_bp)
# app.register_blueprint(bid_bp)
# app.register_blueprint(notification_bp)


    
# @app.route('/test-db')
# def test_db():
#     try:
#         with app.app_context():
#             db.session.execute(text('SELECT 1'))
#         return jsonify({"status": "success", "message": "Database connection successful!"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})

# @app.route('/uploads/<path:filename>')
# def uploaded_file(filename):
#     return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

# def check_ended_auctions():
#     with app.app_context(): 
#         ended_products = Product.query.filter(
#             Product.closing_date < datetime.now,
#             Product.reserve_price <= Product.bid_price,
#             Product.winner_notified == False,
#             print(Product.closing_date, datetime.now)
#         ).all()

#     # for product in ended_products:
#     # # 🧠 Find the highest bid for this product
#     #     winning_bid = Bid.query.filter_by(product_id=product.id)\
#     #     .order_by(Bid.bid_amount.desc())\
#     #     .first()

#     #     if winning_bid:
#     #         winner_id = winning_bid.user_id

#     #         create_notification(
#     #         user_id=winner_id,
#     #         message=f"You've won the auction for {product.name}!",
#     #         notif_type='winner'
#     #      )

#     #     product.winner_notified = True
#     #     product.winner_id = winner_id  # Optional: store winner in products table

#         for product in ended_products:
#             winner_id = product.user_id
#             if winner_id:
#                 create_notification(
#                     user_id=winner_id,
#                     message=f"You've won the auction for {product.name}!",
#                     notif_type='winner'
#                 )
#                 product.winner_notified = True
#                 print("Winner notified")
#                 print(winner_id)
#         db.session.commit()    

# scheduler = BackgroundScheduler()
# scheduler.add_job(func=check_ended_auctions, trigger="interval", minutes=1)
# scheduler.start()

# if __name__ == "__main__":
#     app.run(port=8000, debug=True)

from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from auth import auth_bp, db
from products import product_bp, Product
from bids import bid_bp, Bid
from notifications import notification_bp, create_notification
import os
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost:3306/aos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(bid_bp)
app.register_blueprint(notification_bp)

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
    with app.app_context():
        now = datetime.now()

        ended_products = Product.query.filter(
            Product.closing_date < now,
            Product.reserve_price <= Product.bid_price,
            Product.winner_notified == False
        ).all()

        print(f"[INFO] Found {len(ended_products)} ended products eligible for notification")

        for product in ended_products:
            # Get highest bid for the product
            winning_bid = Bid.query.filter_by(product_id=product.id)\
                .order_by(Bid.bid_amount.desc()).first()

            if not winning_bid:
                print(f"[SKIP] No bids found for Product ID {product.id}")
                continue

            winner_id = winning_bid.user_id

            # Create notification for the winner
            create_notification(
                user_id=winner_id,
                message=f"You've won the auction for {product.name}!",
                notif_type='winner'
            )

            # Update product status
            product.winner_notified = True
            product.user_id = winner_id  # Only if winner_id field exists
            product.bid_price = winning_bid.bid_amount

            print(f"[NOTIFIED] User {winner_id} won {product.name} for ${winning_bid.bid_amount}")

        db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_ended_auctions, trigger="interval", seconds=10)
scheduler.start()

if __name__ == "__main__":
    app.run(port=8000, debug=True)
