from models.user_model import User
from models.booking_model import Booking
from datetime import date, timedelta

class PublicController:

    def home_stats(self, db):

        total_users = db.query(User).count()

        total_bookings = db.query(Booking).count()

        confirmed_bookings = (
            db.query(Booking)
            .filter(
                Booking.booking_status == "CONFIRMED"
            )
            .count()
        )

        return {
            "total_visitors": total_users,
            "active_bookings": confirmed_bookings,
            "forecast_accuracy": 96,
            "happy_devotees": 98
        }

    def crowd_status(self):

        return {
            "status": "MODERATE",
            "wait_time": 18,
            "recommended_slot": "07:00-10:00"
        }

    def forecast(self):

        crowd_data = [
            4200,
            3900,
            5100,
            6200,
            7400,
            9800,
            8500
        ]

        result = []

        today = date.today()

        for i, crowd in enumerate(crowd_data):

            current_date = today + timedelta(days=i)

            if crowd < 5000:
                crowd_level = "LOW"
                expected_wait = 10

            elif crowd < 7000:
                crowd_level = "MODERATE"
                expected_wait = 25

            elif crowd < 9000:
                crowd_level = "BUSY"
                expected_wait = 45

            else:
                crowd_level = "HEAVY"
                expected_wait = 75

            result.append({
                "date": current_date.isoformat(),
                "day": current_date.strftime("%a"),
                "crowd": crowd,
                "crowd_level": crowd_level,
                "expected_wait": expected_wait
            })

        return result


public_controller = PublicController()