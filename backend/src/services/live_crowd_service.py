from datetime import datetime

from services.forecast_service import forecast_service


class LiveCrowdService:

    def get_live_status(self):

        now = datetime.now()

        today = now.date().isoformat()

        predicted_visitors = forecast_service.predict_crowd(today)

        hour = now.hour + (now.minute / 60)

        # Crowd profile throughout the day
        if hour < 5:
            factor = 0.05

        elif hour < 7:
            factor = 0.20

        elif hour < 9:
            factor = 0.50

        elif hour < 11:
            factor = 0.80

        elif hour < 13:
            factor = 1.00

        elif hour < 15:
            factor = 0.85

        elif hour < 17:
            factor = 0.65

        elif hour < 19:
            factor = 0.45

        elif hour < 21:
            factor = 0.25

        else:
            factor = 0.08

        import random

        # 15-minute fluctuation
        current_block = now.minute // 15

        # Fixed seed for each 15-minute block
        random.seed(
            now.year * 1000000 +
            now.month * 10000 +
            now.day * 100 +
            current_block
        )

        variation = random.uniform(-0.05, 0.05)

        factor = factor * (1 + variation)

        current_visitors = int(predicted_visitors * factor)

        if current_visitors < 15000:
            crowd = "LOW"

        elif current_visitors < 30000:
            crowd = "MODERATE"

        elif current_visitors < 50000:
            crowd = "BUSY"

        else:
            crowd = "HEAVY"

        wait_time = max(
            5,
            min(
                int(current_visitors / 1200),
                180
            )
        )

        return {

            "status": crowd,

            "current_visitors": current_visitors,

            "expected_today": round(predicted_visitors),

            "wait_time": wait_time,

            "last_updated": now.strftime("%Y-%m-%d %H:%M:%S"),

            "next_update_in_minutes": 15
        }


live_crowd_service = LiveCrowdService()