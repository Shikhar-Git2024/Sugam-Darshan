from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from config.database import get_db

from controllers.notification_controller import NotificationController
from schemas.notification import NotificationCreate

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.post("/create")
def create_notification(
    request: NotificationCreate,
    db: Session = Depends(get_db)
):

    notification = (
        NotificationController.create_notification(
            db,
            request
        )
    )

    return {
        "success": True,
        "message": "Notification created.",
        "notification_id": notification.id
    }


@router.get("/")
def get_all_notifications(
    db: Session = Depends(get_db)
):

    notifications = (
        NotificationController.get_all_notifications(
            db
        )
    )

    return {
        "count": len(notifications),
        "notifications": notifications
    }


@router.get("/user/{user_id}")
def get_user_notifications(
    user_id: int = Path(...),
    db: Session = Depends(get_db)
):

    notifications = (
        NotificationController.get_user_notifications(
            db,
            user_id
        )
    )

    return {
        "count": len(notifications),
        "notifications": notifications
    }


@router.put("/read/{notification_id}")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db)
):

    notification = (
        NotificationController.mark_as_read(
            db,
            notification_id
        )
    )

    if not notification:
        return {
            "success": False,
            "message": "Notification not found."
        }

    return {
        "success": True,
        "message": "Marked as read."
    }