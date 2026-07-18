import os
import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from xgboost import XGBRegressor

# ==========================================================
# PATHS
# ==========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(
    BASE_DIR,
    "../datasets/final_data.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "../models/crowd_forecast_model.pkl"
)

# ==========================================================
# LOAD DATA
# ==========================================================

df = pd.read_csv(DATA_PATH)

print(f"\nDataset Shape : {df.shape}")

# ==========================================================
# PREPROCESSING
# ==========================================================

df["date"] = pd.to_datetime(df["date"])

df["day_of_week"] = df["date"].dt.dayofweek

df["weekend"] = (df["day_of_week"] >= 5).astype(int)

df = df.drop(
    columns=[
        "date",
        "weekday",
        "summer",
        "rolling_avg_8",
        "is_brahmostavam"
    ]
)

FEATURES = [
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

TARGET = "darshans"

X = df[FEATURES]

y = df[TARGET]

# ==========================================================
# TRAIN TEST SPLIT
# ==========================================================

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print(f"Training Rows : {len(X_train)}")
print(f"Testing Rows  : {len(X_test)}")

# ==========================================================
# PREPROCESSOR
# ==========================================================

numeric_features = FEATURES

preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            StandardScaler(),
            numeric_features
        )
    ]
)

# ==========================================================
# MODEL
# ==========================================================

model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# ==========================================================
# TRAIN
# ==========================================================

print("\nTraining XGBoost...\n")

pipeline.fit(
    X_train,
    y_train
)

# ==========================================================
# EVALUATION
# ==========================================================

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

r2 = r2_score(
    y_test,
    predictions
)

mape = np.mean(
    np.abs(
        (y_test - predictions) / y_test
    )
) * 100

print("=" * 60)
print("MODEL RESULTS")
print("=" * 60)

print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"MAPE : {mape:.2f}%")
print(f"R²   : {r2:.4f}")

# ==========================================================
# SAVE MODEL
# ==========================================================

joblib.dump(
    pipeline,
    MODEL_PATH
)

print("\nModel saved successfully.")
print(MODEL_PATH)