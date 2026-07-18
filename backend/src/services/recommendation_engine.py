from datetime import date, timedelta

from services.forecast_service import forecast_service

from utils.data_lookup import data_lookup
import pandas as pd

class RecommendationEngine:

    def calculate_score(
        self,
        visitors,
        wait_time,
        row
    ):

        score = 100

        score -= visitors / 4000

        score -= wait_time / 3

        if row["is_festival"] == 1:
            score -= 8

        if row["is_public_holiday"] == 1:
            score -= 5

        if row["weekend"] == 1:
            score -= 3

        if row["temp_max"] > 38:
            score -= 2

        if row["rainfall"] > 15:
            score -= 2

        return round(
            max(60, min(score, 100))
        )
    
    def calculate_confidence(
        self,
        row
    ):

        confidence = 96

        if row["is_festival"] == 1:
            confidence -= 4

        if row["weekend"] == 1:
            confidence -= 2

        if row["rainfall"] > 20:
            confidence -= 2

        return max(85, confidence)
    
    def build_reasons(
        self,
        forecast_date,
        row,
        crowd,
        wait_time
    ):

        reasons = []

        if crowd == "LOW":
            reasons.append("Lowest predicted crowd")

        elif crowd == "MODERATE":
            reasons.append("Comfortable crowd level")

        if wait_time <= 30:
            reasons.append("Short waiting time")

        day_name = pd.to_datetime(
            forecast_date
        ).strftime("%A")

        if day_name in [
            "Saturday",
            "Sunday"
        ]:
            reasons.append("Weekend")
        else:
            reasons.append("Weekday")

        if row["is_festival"] == 0:
            reasons.append("No major festival")

        if 25 <= row["temp_max"] <= 35:
            reasons.append("Pleasant weather")

        return reasons

    def recommend(
        self,
        visit_date,
        people_count=1,
        preferred_time=None
    ):

        forecast = []

        # -----------------------------
        # Build 7-Day Forecast
        # -----------------------------

        for i in range(7):

            current_date = (
                date.today() +
                timedelta(days=i)
            )

            current_date_str = (
                current_date.isoformat()
            )

            visitors = (
                forecast_service.predict_crowd(
                    current_date_str
                )
            )

            wait_time = (
                forecast_service.get_wait_time(
                    visitors
                )
            )

            crowd = (
                forecast_service.get_crowd_level(
                    visitors
                )
            )

            row = data_lookup.get_full_row(
                current_date_str
            )

            if row is None:
                continue

            score = self.calculate_score(
                visitors,
                wait_time,
                row
            )

            confidence = self.calculate_confidence(
                row
            )

            reasons = self.build_reasons(
                current_date_str,
                row,
                crowd,
                wait_time
            )
            
            forecast.append({

                "date": current_date_str,

                "day": current_date.strftime("%a"),

                "expected_visitors": round(visitors),

                "crowd_level": crowd,

                "expected_wait": wait_time,

                "score": score,

                "confidence": confidence,

                "reasons": reasons

            })

        # -----------------------------
        # AI Recommended Day
        # -----------------------------

        ai_day = max(
            forecast,
            key=lambda x: x["score"]
        )

        lowest = min(
            forecast,
            key=lambda x: x["expected_visitors"]
        )

        ai_reasons = ai_day["reasons"].copy()

        if ai_day["date"] == lowest["date"]:
            ai_reasons.insert(
                0,
                "Lowest predicted crowd this week"
            )

        # -----------------------------
        # Selected Date
        # -----------------------------

        selected_row = data_lookup.get_full_row(
            visit_date
        )

        if selected_row:

            visitors = (
                forecast_service.predict_crowd(
                    visit_date
                )
            )

            wait = (
                forecast_service.get_wait_time(
                    visitors
                )
            )

            crowd = (
                forecast_service.get_crowd_level(
                    visitors
                )
            )

            selected_day = {

                "date":
                    visit_date,

                "day":
                    pd.to_datetime(
                        visit_date
                    ).strftime("%a"),

                "weather":{
                    "temperature":
                        selected_row["temp_max"],
                    "humidity":
                        selected_row["humidity"],
                    "rainfall":
                        selected_row["rainfall"]
                },

                "expected_visitors":
                    round(visitors),

                "crowd_level":
                    crowd,

                "expected_wait":
                    wait

            }

        else:

            selected_day = None

        clean_forecast = []
        for day in forecast:

            clean_forecast.append({

                "date": day["date"],

                "day": day["day"],

                "expected_visitors": day["expected_visitors"],

                "crowd_level": day["crowd_level"],

                "expected_wait": day["expected_wait"]

            })

        return {

            "success": True,

            "ai_recommendation": {

                "date":
                    ai_day["date"],

                "day":
                    ai_day["day"],

                "expected_visitors":
                    ai_day["expected_visitors"],

                "crowd_level":
                    ai_day["crowd_level"],

                "expected_wait":
                    ai_day["expected_wait"],

                "recommendation_score":
                    ai_day["score"],

                "confidence":
                    ai_day["confidence"],

                "reasons":
                    ai_reasons

            },

            "selected_date":
                selected_day,

            "forecast":
                clean_forecast

        }


recommendation_engine = RecommendationEngine()