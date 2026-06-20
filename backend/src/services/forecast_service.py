import os
import joblib
import pandas as pd

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

        self.risk_model = joblib.load(
            os.path.join(
                base_path,
                "risk_prediction_model.pkl"
            )
        )

        self.slot_model = joblib.load(
            os.path.join(
                base_path,
                "slot_forecast_model.pkl"
            )
        )

    def get_models(self):

        return {
            "crowd_model": self.crowd_model,
            "risk_model": self.risk_model,
            "slot_model": self.slot_model
        }

    # ----------------------------------
    # Crowd Forecast
    # ----------------------------------

    def predict_crowd(self, data):

        df = pd.DataFrame([data])

        prediction = self.crowd_model.predict(df)

        return float(prediction[0])

    # ----------------------------------
    # Risk Forecast
    # ----------------------------------

    def predict_risk(self, data):

        df = pd.DataFrame([data])

        prediction = self.risk_model.predict(df)

        risk_map = {
            0: "LOW",
            1: "MEDIUM",
            2: "HIGH",
            3: "CRITICAL"
        }

        return risk_map.get(
            int(prediction[0]),
            "UNKNOWN"
        )

    # ----------------------------------
    # Slot Forecast
    # ----------------------------------

    def predict_slot(self, data):

        df = pd.DataFrame([data])

        prediction = self.slot_model.predict(df)

        return float(prediction[0])


forecast_service = ForecastService()