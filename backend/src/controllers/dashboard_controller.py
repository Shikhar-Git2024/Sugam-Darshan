from models.user_model import User
from models.booking_model import Booking
from models.waiting_list_model import WaitingList
from services.live_crowd_service import live_crowd_service


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

        live = live_crowd_service.get_live_status()

        return {
            "crowd_status": live["status"],
            "estimated_visitors": live["current_visitors"],
            "expected_today": live["expected_today"],
            "wait_time": live["wait_time"],
            "last_updated": live["last_updated"]
        }


    def get_risk_status(self):

        live = live_crowd_service.get_live_status()
        visitors = live["current_visitors"]

        if visitors < 15000:
            risk = "LOW"
            score = 20

        elif visitors < 30000:
            risk = "MODERATE"
            score = 45

        elif visitors < 50000:
            risk = "HIGH"
            score = 75

        else:
            risk = "CRITICAL"
            score = 95

        return {

            "risk_level": risk,
            "risk_score": score,
            "current_visitors": visitors,
            "last_updated": live["last_updated"]
        }

dashboard_controller = (
    DashboardController()
)