from models.user_model import User
from models.booking_model import Booking
from datetime import date, timedelta
import random

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
        # 1. Define the possible states and their matching time slots
        scenarios = [
            {"status": "LOW", "recommended_slot": "Immediate access / Any time"},
            {"status": "MODERATE", "recommended_slot": "07:00-10:00"},
            {"status": "HIGH", "recommended_slot": "14:00-16:00"},
            {"status": "CRITICAL", "recommended_slot": "19:00-21:00"}
        ]
        
        # 2. Randomly pick one scenario
        chosen = random.choice(scenarios)
        
        # 3. Generate a realistic wait time based on the status
        if chosen["status"] == "LOW":
            wait_time = random.randint(0, 10)      # 0 to 10 mins
        elif chosen["status"] == "MODERATE":
            wait_time = random.randint(11, 25)     # 11 to 25 mins
        elif chosen["status"] == "HIGH":
            wait_time = random.randint(26, 50)     # 26 to 50 mins
        else:  # CRITICAL
            wait_time = random.randint(51, 90)     # 51 to 90 mins

        return {
            "status": chosen["status"],
            "wait_time": wait_time,
            "recommended_slot": chosen["recommended_slot"]
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