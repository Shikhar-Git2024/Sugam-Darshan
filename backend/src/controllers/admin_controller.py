from models.user_model import User
from models.booking_model import Booking


class AdminController:

    def get_system_stats(
        self,
        db
    ):

        return {
            "total_users":
                db.query(User).count(),

            "total_bookings":
                db.query(Booking).count()
        }

    def create_authority(
        self,
        db,
        user_id
    ):

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:

            return {
                "success": False,
                "message": "User Not Found"
            }

        user.role = "AUTHORITY"

        db.commit()

        return {
            "success": True,
            "message":
                f"User {user_id} promoted to AUTHORITY"
        }


admin_controller = AdminController()