from sqlalchemy.orm import Session
from models.notification_model import Notification

class NotificationService:

    @staticmethod
    def send(
        db: Session,
        title: str,
        message: str,
        type: str = "GENERAL",
        priority: str = "NORMAL",
        audience: str = "ALL",
        user_id=None,
    ):

        notification = Notification(

            user_id=user_id,

            title=title,

            message=message,

            type=type,

            priority=priority,

            audience=audience,

            is_read=False,

        )

        db.add(notification)

        db.commit()

        db.refresh(notification)

        return notification