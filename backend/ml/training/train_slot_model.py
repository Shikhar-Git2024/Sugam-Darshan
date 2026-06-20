import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.ensemble import RandomForestRegressor
from sklearn.neural_network import MLPRegressor

from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

import numpy as np

# =====================
# LOAD DATA
# =====================

df = pd.read_csv(
    "../datasets/RamMandir_SlotWise_Dataset_V3.csv"
)

# =====================
# FEATURES
# =====================

FEATURES = [
    "Slot",
    "Month",
    "Day_of_Week",
    "Season",
    "Temperature_C",
    "Festival_Importance",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Weekend",
    "Risk_Level_V4"
]

TARGET = "Visitors"

X = df[FEATURES]
y = df[TARGET]

# =====================
# SPLIT
# =====================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================
# PREPROCESSING
# =====================

categorical_features = [
    "Slot",
    "Day_of_Week",
    "Season",
    "Risk_Level_V4"
]

numeric_features = [
    "Month",
    "Temperature_C",
    "Festival_Importance",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Weekend"
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "num",
            StandardScaler(),
            numeric_features
        )
    ]
)

# =====================
# MODELS
# =====================

models = {
    "RandomForest":
        RandomForestRegressor(
            n_estimators=300,
            random_state=42
        ),

    "XGBoost":
        XGBRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=6,
            random_state=42
        ),

    "LightGBM":
        LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            random_state=42
        ),

    "NeuralNetwork":
        MLPRegressor(
            hidden_layer_sizes=(256,128,64),
            max_iter=3000,
            early_stopping=True,
            random_state=42
        )
}

best_model = None
best_r2 = -999
best_name = ""

# =====================
# TRAIN
# =====================

for name, model in models.items():

    print(f"\nTraining {name}...")

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)

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

    print(
        f"{name} | "
        f"MAE={mae:.2f} | "
        f"RMSE={rmse:.2f} | "
        f"R2={r2:.4f}"
    )

    if r2 > best_r2:
        best_r2 = r2
        best_model = pipeline
        best_name = name

# =====================
# SAVE
# =====================

joblib.dump(
    best_model,
    "../models/slot_forecast_model.pkl"
)

print("\n")
print("="*50)
print("BEST MODEL")
print("="*50)

print("Model:", best_name)
print("R2:", round(best_r2,4))
print("\nSaved Successfully.")