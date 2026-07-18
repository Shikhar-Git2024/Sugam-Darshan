import pandas as pd

# Final features expected by the ML model
FEATURE_COLUMNS = [
    "month",
    "day",
    "day_of_week",
    "weekend",
    "temp_max",
    "temp_min",
    "humidity",
    "rainfall",
    "rolling_avg_7",
    "google_trend_score",
    "is_public_holiday",
    "is_festival"
]


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Converts the raw dataset into the exact feature set
    required by the ML model.

    This function MUST be used during BOTH:
    1. Model Training
    2. Model Prediction

    Never duplicate preprocessing elsewhere.
    """

    df = df.copy()

    # Convert date into datetime
    df["date"] = pd.to_datetime(df["date"])

    # Generate calendar features
    df["day_of_week"] = df["date"].dt.dayofweek

    df["weekend"] = (
        df["day_of_week"] >= 5
    ).astype(int)

    # Remove columns we don't want
    drop_columns = [
        "date",
        "weekday",
        "summer",
        "rolling_avg_8",
        "is_brahmostavam"
    ]

    df = df.drop(
        columns=drop_columns,
        errors="ignore"
    )

    return df