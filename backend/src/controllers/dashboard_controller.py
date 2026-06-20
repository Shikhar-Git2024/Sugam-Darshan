from models.user_model import User
from models.booking_model import Booking
from models.waiting_list_model import WaitingList


class DashboardController:

    def get_summary(
        self,
        db
    ):

        total_users = (
            db.query(User)
            .count()
        )

        total_bookings = (
            db.query(Booking)
            .count()
        )

        confirmed_bookings = (
            db.query(Booking)
            .filter(
                Booking.booking_status
                == "CONFIRMED"
            )
            .count()
        )

        cancelled_bookings = (
            db.query(Booking)
            .filter(
                Booking.booking_status
                == "CANCELLED"
            )
            .count()
        )

        waitlist_count = (
            db.query(WaitingList)
            .count()
        )

        return {
            "total_users":
                total_users,
            "total_bookings":
                total_bookings,
            "confirmed_bookings":
                confirmed_bookings,
            "cancelled_bookings":
                cancelled_bookings,
            "waitlist_count":
                waitlist_count
        }

    def get_users(self, db):

        users = db.query(User).all()

        return {
            "count": len(users),
            "users": [
                {
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "role": u.role
                }
                for u in users
            ]
        }


    def get_bookings(self, db):

        bookings = db.query(Booking).all()

        return {
            "count": len(bookings),
            "bookings": [
                {
                    "booking_id": b.booking_id,
                    "user_id": b.user_id,
                    "visit_date": b.visit_date,
                    "slot": b.slot,
                    "people_count": b.people_count,
                    "status": b.booking_status
                }
                for b in bookings
            ]
        }


    def get_waitlist(self, db):

        waitlist = db.query(
            WaitingList
        ).all()

        return {
            "count": len(waitlist),
            "waitlist": [
                {
                    "user_id": w.user_id,
                    "visit_date": w.visit_date,
                    "slot": w.slot,
                    "position": w.position
                }
                for w in waitlist
            ]
        }

    def get_crowd_status(self):

        return {
            "crowd_status": "MODERATE",
            "estimated_visitors": 40922,
            "wait_time": 32
        }


    def get_risk_status(self):

        return {
            "risk_level": "LOW",
            "risk_score": 25
        }

dashboard_controller = (
    DashboardController()
)