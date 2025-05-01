from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask import send_from_directory
from flask_cors import CORS
from auth import auth_bp, db
from products import product_bp, Product
from bids import bid_bp, Bid
from admin import admin_bp 
from smart_login import smart_login_bp
from support import support_bp
from notifications import notification_bp
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from notifications import create_notification, Notification
from flask import request
import os
from sqlalchemy import or_

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:mysql@localhost:3306/aos'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost:3306/aos'




app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(bid_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(smart_login_bp)
app.register_blueprint(support_bp)
app.register_blueprint(notification_bp)


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

# def check_ended_auctions():
#     with app.app_context():
#         now = datetime.now()

#         ended_products = Product.query.filter(
#             Product.closing_date < now,
#             Product.reserve_price <= Product.bid_price,
#             Product.winner_notified == False
#         ).all()

#         print(f"[INFO] Found {len(ended_products)} ended products eligible for notification")

#         for product in ended_products:
#             winner_id = product.user_id
#             bid_amount = product.bid_price

#             if not winner_id:
#                 print(f"[SKIP] No winner assigned for Product ID {product.id}")
#                 continue

#             create_notification(
#                 user_id=winner_id,
#                 message=f"You've won the auction for {product.name}!",
#                 notif_type='winner'
#             )

#             product.winner_notified = True
#             print(f"[NOTIFIED] User {winner_id} won {product.name} for ${bid_amount}")

#         db.session.commit()

def check_ended_auctions():
    with app.app_context():
        now = datetime.now()

        # Find all ended products not yet notified
        ended_products = Product.query.filter(
            Product.closing_date < now,
            Product.winner_notified == False
        ).all()

        for product in ended_products:
            # 🔍 Get the highest bid
            highest_bid = Bid.query.filter_by(product_id=product.id)\
                                   .order_by(Bid.bid_amount.desc()).first()

            if not highest_bid:
                continue  # No bids placed

            # ✅ Case A: No reserve set
            if product.reserve_price is None:
                winner_id = highest_bid.user_id
                product.user_id = winner_id
                product.bid_price = highest_bid.bid_amount
                create_notification(
                    user_id=winner_id,
                    message=f"You've won the auction for {product.name}!",
                    notif_type='winner'
                )
                print(f"[✅ NO RESERVE] Winner for {product.name}: User {winner_id} @ ${highest_bid.bid_amount}")

            # ❌ Case B: Reserve exists but not met
            elif highest_bid.bid_amount < product.reserve_price:
                print(f"[❌ RESERVE NOT MET] No winner for {product.name}")
                product.user_id = None
                product.bid_price = highest_bid.bid_amount  # Optional: to show last bid
            else:
                # ✅ Case C: Reserve met
                winner_id = highest_bid.user_id
                product.user_id = winner_id
                product.bid_price = highest_bid.bid_amount
                create_notification(
                    user_id=winner_id,
                    message=f"You've won the auction for {product.name}!",
                    notif_type='winner'
                )
                print(f"[✅ RESERVE MET] Winner for {product.name}: User {winner_id} @ ${highest_bid.bid_amount}")

            product.winner_notified = True

        db.session.commit()


# def check_ended_auctions():
#     with app.app_context():
#         now = datetime.now()

#         ended_products = Product.query.filter(
#             Product.closing_date < now,
#             Product.reserve_price <= Product.bid_price,
#             Product.winner_notified == False
#         ).all()

#         print(f"[INFO] Found {len(ended_products)} ended products eligible for notification")


#         for product in ended_products:

#             # Get highest bid for the product
#             winning_bid = Bid.query.filter_by(product_id=product.id)\
#                 .order_by(Bid.bid_amount.desc()).first()

#             if not winning_bid:
#                 print(f"[SKIP] No bids found for Product ID {product.id}")
#                 continue

#             winner_id = winning_bid.user_id

#             # Create notification for the winner
#             create_notification(
#                 user_id=winner_id,
#                 message=f"You've won the auction for {product.name}!",
#                 notif_type='winner'
#             )

#             # Update product status
#             product.winner_notified = True
#             product.user_id = winner_id  # Only if winner_id field exists
#             product.bid_price = winning_bid.bid_amount

#             print(f"[NOTIFIED] User {winner_id} won {product.name} for ${winning_bid.bid_amount}")

#         db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(func=check_ended_auctions, trigger="interval", seconds=10)
scheduler.start()

if __name__ == "__main__":
    app.run(port=8000, debug=True)
