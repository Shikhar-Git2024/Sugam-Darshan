from sqlalchemy.orm import Session

from models.notification_model import Notification

class NotificationController:

    @staticmethod
    def create_notification(
        db: Session,
        data
    ):

        notification = Notification(

            user_id=data.user_id,

            title=data.title,

            message=data.message,

            type=data.type,

            priority=data.priority,

            audience=data.audience

        )

        db.add(notification)

        db.commit()

        db.refresh(notification)

        return notification

    @staticmethod
    def get_all_notifications(
        db: Session
    ):

        return (
            db.query(Notification)
            .order_by(
                Notification.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int
    ):

        from models.user_model import User
        from sqlalchemy import or_, and_

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if not user:
            return []

        return (

            db.query(Notification)

            .filter(

                or_(

                    # Personal notifications
                    Notification.user_id == user_id,

                    # Broadcast to everyone
                    and_(
                        Notification.user_id == None,
                        Notification.audience == "ALL"
                    ),

                    # Broadcast to this role only
                    and_(
                        Notification.user_id == None,
                        Notification.audience == user.role
                    )

                )

            )

            .order_by(
                Notification.created_at.desc()
            )

            .all()

        )

    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int
    ):

        notification = (
            db.query(Notification)
            .filter(
                Notification.id == notification_id
            )
            .first()
        )

        if not notification:
            return None

        notification.is_read = True

        db.commit()

        db.refresh(notification)

        return notification