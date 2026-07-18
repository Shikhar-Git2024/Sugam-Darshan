from models.user_model import User
from models.booking_model import Booking
from datetime import date, timedelta
from services.forecast_service import forecast_service
from services.live_crowd_service import live_crowd_service

class PublicController:

    def home_stats(self, db):

        total_users = db.query(User).count()

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
        }
    
    def crowd_status(self):

        return live_crowd_service.get_live_status()

    def forecast(self):

        result = []
        today = date.today()

        for i in range(7):

            current_date = today + timedelta(days=i)
            visitors = forecast_service.predict_crowd(
                current_date.isoformat()
            )
            crowd_level = (
                forecast_service.get_crowd_level(
                    visitors
                )
            )
            wait_time = (
                forecast_service.get_wait_time(
                    visitors
                )
            )

            result.append({

                "date":
                    current_date.isoformat(),

                "day":
                    current_date.strftime("%a"),

                "crowd":
                    round(visitors),

                "crowd_level":
                    crowd_level,

                "expected_wait":
                    wait_time
            })

        return result


public_controller = PublicController()