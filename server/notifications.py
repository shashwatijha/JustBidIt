from flask import Blueprint, jsonify
from auth import db
from datetime import datetime
from sqlalchemy import text
from flask import request

notification_bp = Blueprint('notification', __name__)

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50))  
    created_at = db.Column(db.DateTime)

@notification_bp.route('/api/notifications', methods=['GET'])
@notification_bp.route('/api/notifications', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id')
    if user_id:
        notifications = Notification.query.filter_by(user_id=user_id).all()
    else:
        notifications = Notification.query.all()

    result = [
        {
            "id": n.id,
            "user_id": n.user_id,
            "type": n.type,
            "message": n.message,
            "created_at": n.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for n in notifications
    ]
    return jsonify(result), 200

def create_notification(user_id, message, notif_type='info'):
    db.session.execute(
        text("""
            INSERT INTO notifications (user_id, message, type, created_at)
            VALUES (:uid, :msg, :typ, :ts)
        """),
        {"uid": user_id, "msg": message, "typ": notif_type, "ts": datetime.now()}
    )
    db.session.commit()