import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.ensemble import RandomForestRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.linear_model import LinearRegression

from xgboost import XGBRegressor
from lightgbm import LGBMRegressor

# =========================
# LOAD DATA
# =========================

FILE_PATH = "../datasets/RamMandir_Merged_Output_V2.xlsx"

df = pd.read_excel(FILE_PATH)

# =========================
# CLEAN DATA
# =========================

df["Festival"] = df["Festival"].fillna("None")

df["Footfall_7_Day_Avg"] = (
    df["Actual_Visitors"]
    .rolling(7)
    .mean()
)

df["Footfall_14_Day_Avg"] = (
    df["Actual_Visitors"]
    .rolling(14)
    .mean()
)

df["Footfall_30_Day_Avg"] = (
    df["Actual_Visitors"]
    .rolling(30)
    .mean()
)
df["Is_Festival"] = (
    df["Festival"] != "None"
).astype(int)
df["Footfall_Lag_1"] = df["Actual_Visitors"].shift(1)

df["Footfall_Lag_3"] = df["Actual_Visitors"].shift(3)

df["Footfall_Lag_7"] = df["Actual_Visitors"].shift(7)

df["Footfall_Lag_14"] = df["Actual_Visitors"].shift(14)
df = df.dropna()

print(df.columns.tolist())
FEATURES = [
    "Month",
    "Footfall_Lag_1",
"Footfall_Lag_3",
"Footfall_Lag_7",
"Footfall_Lag_14",
    "Day_of_Week",
    "Season",
    "Festival",
    "Temperature_C",
    "Previous_Day_Footfall",
    "Festival_Importance",
    "Festival_Window",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Footfall_7_Day_Avg",
"Footfall_14_Day_Avg",
"Footfall_30_Day_Avg",
"Is_Festival"
]

TARGET = "Actual_Visitors"

X = df[FEATURES]
y = df[TARGET]

# =========================
# TIME BASED SPLIT
# =========================

train_df = df[df["Year"] < 2026]
test_df = df[df["Year"] == 2026]

X_train = train_df[FEATURES]
y_train = train_df[TARGET]

X_test = test_df[FEATURES]
y_test = test_df[TARGET]

print(f"\nTraining Rows: {len(train_df)}")
print(f"Testing Rows: {len(test_df)}")

# =========================
# PREPROCESSING
# =========================

categorical_features = [
    "Day_of_Week",
    "Season",
    "Festival",
    "Festival_Window"
]

numeric_features = [
    "Month",
    "Footfall_Lag_1",
"Footfall_Lag_3",
"Footfall_Lag_7",
"Footfall_Lag_14",
    "Temperature_C",
    "Previous_Day_Footfall",
    "Footfall_7_Day_Avg",
"Footfall_14_Day_Avg",
"Footfall_30_Day_Avg",
"Is_Festival",
    "Festival_Importance",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag"
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

# =========================
# MODELS
# =========================

models = {
    "LinearRegression": LinearRegression(),

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

results = []

best_model = None
best_r2 = -999
best_name = ""

# =========================
# TRAIN & EVALUATE
# =========================

for name, model in models.items():

    print(f"\nTraining {name}...")

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)

    rmse = np.sqrt(
        mean_squared_error(y_test, predictions)
    )

    r2 = r2_score(y_test, predictions)

    mape = np.mean(
        np.abs(
            (y_test - predictions) / y_test
        )
    ) * 100

    results.append([
        name,
        round(mae, 2),
        round(rmse, 2),
        round(mape, 2),
        round(r2, 4)
    ])

    if r2 > best_r2:
        best_r2 = r2
        best_model = pipeline
        best_name = name

# =========================
# RESULTS
# =========================

results_df = pd.DataFrame(
    results,
    columns=[
        "Model",
        "MAE",
        "RMSE",
        "MAPE",
        "R2"
    ]
)

results_df = results_df.sort_values(
    by="R2",
    ascending=False
)

print("\n")
print("=" * 70)
print("MODEL LEADERBOARD")
print("=" * 70)

print(results_df)

print("\nBest Model:", best_name)
print("Best R2:", round(best_r2, 4))

# =========================
# SAVE BEST MODEL
# =========================

joblib.dump(
    best_model,
    "../models/crowd_forecast_model.pkl"
)

print("\nModel saved successfully.")

if best_name == "LightGBM":
    model = best_model.named_steps["model"]

    feature_names = (
        best_model.named_steps["preprocessor"]
        .get_feature_names_out()
    )

    importance_df = pd.DataFrame({
        "Feature": feature_names,
        "Importance": model.feature_importances_
    })

    importance_df = importance_df.sort_values(
        by="Importance",
        ascending=False
    )

    print("\nTop 20 Important Features:")
    print(importance_df.head(20))

