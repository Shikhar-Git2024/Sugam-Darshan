import pandas as pd
import os


class DataLookup:

    def __init__(self):

        dataset_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "../../ml/datasets/RamMandir_Merged_Output_V4.xlsx"
            )
        )

        self.df = pd.read_excel(dataset_path)

        self.df["Date"] = pd.to_datetime(
            self.df["Date"]
        )

    def get_date_features(self, date):

        date = pd.to_datetime(date)

        row = self.df[
            self.df["Date"] == date
        ]

        if row.empty:
            return None

        row = row.iloc[0]

        return {
            "Month": row["Month"],
            "Day_of_Week": row["Day_of_Week"],
            "Season": row["Season"],
            "Temperature_C": row["Temperature_C"],
            "Festival_Importance": row["Festival_Importance"],
            "Public_Holiday": row["Public_Holiday"],
            "Long_Weekend_Flag": row["Long_Weekend_Flag"],
            "School_Holiday_Flag": row["School_Holiday_Flag"],
            "Weekend": row["Weekend"],
            "Risk_Level_V4": row["Risk_Level_V4"]
        }


data_lookup = DataLookup()