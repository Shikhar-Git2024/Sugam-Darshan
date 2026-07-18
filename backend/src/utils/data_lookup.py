import pandas as pd
import os


class DataLookup:

    def __init__(self):

        dataset_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "../../ml/datasets/final_data.csv"
            )
        )

        self.df = pd.read_csv(dataset_path)

        self.df["date"] = pd.to_datetime(
            self.df["date"]
        )

    def get_date_features(self, visit_date):

        visit_date = pd.to_datetime(visit_date)

        month = visit_date.month
        day = visit_date.day

        rows = self.df[
            (self.df["month"] == month) &
            (self.df["day"] == day)
        ]

        if rows.empty:

            rows = self.df[
                self.df["month"] == month
            ]

        row = rows.iloc[0]

        return {

            "month": row["month"],

            "day": row["day"],

            "day_of_week": visit_date.dayofweek,

            "weekend": 1 if visit_date.dayofweek >= 5 else 0,

            "temp_max": row["temp_max"],

            "temp_min": row["temp_min"],

            "humidity": row["humidity"],

            "rainfall": row["rainfall"],

            "rolling_avg_7": row["rolling_avg_7"],

            "google_trend_score": row["google_trend_score"],

            "is_public_holiday": row["is_public_holiday"],

            "is_festival": row["is_festival"]
        }

    def get_full_row(self, date):

        date = pd.to_datetime(date)

        month = date.month
        day = date.day

        row = self.df[
            (self.df["month"] == month) &
            (self.df["day"] == day)
        ]

        if row.empty:
            return None

        return row.iloc[0].to_dict()

data_lookup = DataLookup()