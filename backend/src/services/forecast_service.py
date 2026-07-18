import os
import joblib
import pandas as pd

from utils.data_lookup import data_lookup


class ForecastService:

    def __init__(self):

        base_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "../../ml/models"
            )
        )

        self.crowd_model = joblib.load(
            os.path.join(
                base_path,
                "crowd_forecast_model.pkl"
            )
        )

    def predict_crowd(self, visit_date):

        features = data_lookup.get_date_features(
            visit_date
        )

        if features is None:
            return None

        df = pd.DataFrame([features])

        prediction = self.crowd_model.predict(df)

        return float(prediction[0])

    def get_crowd_level(self, visitors):

        if visitors < 50000:
            return "LOW"

        elif visitors < 65000:
            return "MODERATE"

        elif visitors < 85000:
            return "BUSY"

        else:
            return "HEAVY"

    def get_wait_time(self, visitors):

        wait = int((visitors / 2000) + 5)

        return max(5, min(wait, 180))

    def get_risk_level(self, visitors):

        if visitors < 40000:
            return "LOW"

        elif visitors < 60000:
            return "MODERATE"

        elif visitors < 80000:
            return "HIGH"

        return "CRITICAL"


forecast_service = ForecastService()