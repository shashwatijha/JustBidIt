from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask import send_from_directory
from flask_cors import CORS
from auth import auth_bp, db
from products import product_bp
from bids import bid_bp
from admin import admin_bp 
from smart_login import smart_login_bp
from support import support_bp
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost:3306/aos'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(bid_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(smart_login_bp)
app.register_blueprint(support_bp)

# @app.route('/test-db')
# def test_db():
#     try:
#         with app.app_context():
#             db.session.execute(text('SELECT 1'))
#         return jsonify({"status": "success", "message": "Database connection successful!"})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)})

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

if __name__ == "__main__":
    app.run(port=8000, debug=True)

