from services.forecast_service import forecast_service
from utils.data_lookup import data_lookup


class RecommendationEngine:

    SLOT_MAPPING = {
        "06-09": "07:00 AM - 09:00 AM",
        "09-12": "09:00 AM - 11:00 AM",
        "12-15": "01:00 PM - 03:00 PM",
        "15-18": "03:00 PM - 05:00 PM",
        "18-21": "05:00 PM - 07:00 PM",
        "21-24": "07:00 PM - 09:00 PM"
    }

    def crowd_status(self, visitors):

        if visitors < 20000:
            return "LOW"

        elif visitors < 50000:
            return "MODERATE"

        elif visitors < 100000:
            return "HIGH"

        return "VERY HIGH"

    def estimate_wait_time(self, visitors):

        wait_time = int((visitors / 1500) + 5)

        return max(5, min(wait_time, 180))

    def recommend(
        self,
        visit_date,
        people_count=1,
        preferred_time=None
    ):

        features = data_lookup.get_date_features(
            visit_date
        )

        if not features:

            return {
                "success": False,
                "message": "Date not found in dataset"
            }

        slots = [
            "06-09",
            "09-12",
            "12-15",
            "15-18",
            "18-21",
            "21-24"
        ]

        results = []

        for slot in slots:

            slot_input = {
                "Slot": slot,
                "Month": features["Month"],
                "Day_of_Week": features["Day_of_Week"],
                "Season": features["Season"],
                "Temperature_C": features["Temperature_C"],
                "Festival_Importance":
                    features["Festival_Importance"],
                "Public_Holiday":
                    features["Public_Holiday"],
                "Long_Weekend_Flag":
                    features["Long_Weekend_Flag"],
                "School_Holiday_Flag":
                    features["School_Holiday_Flag"],
                "Weekend":
                    features["Weekend"],
                "Risk_Level_V4":
                    features["Risk_Level_V4"]
            }

            predicted_visitors = (
                forecast_service.predict_slot(
                    slot_input
                )
            )

            wait_time = self.estimate_wait_time(
                predicted_visitors
            )

            crowd_status = self.crowd_status(
                predicted_visitors
            )

            score = wait_time

            if crowd_status == "MODERATE":
                score += 20

            elif crowd_status == "HIGH":
                score += 40

            elif crowd_status == "VERY HIGH":
                score += 60

            if preferred_time:

                if preferred_time.lower() in slot.lower():
                    score -= 15

            results.append({
                "slot": slot,
                "display_slot":
                    self.SLOT_MAPPING.get(
                        slot,
                        slot
                    ),
                "visitors":
                    round(predicted_visitors),
                "wait_time":
                    wait_time,
                "crowd_status":
                    crowd_status,
                "score":
                    score
            })

        results = sorted(
            results,
            key=lambda x: x["score"]
        )

        best_slot = results[0]
        alternative_slot = results[1]

        return {
            "success": True,
            "recommended_slot":
                best_slot,
            "alternative_slot":
                alternative_slot
        }


recommendation_engine = RecommendationEngine()