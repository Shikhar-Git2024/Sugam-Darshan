import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    classification_report
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

# ======================
# LOAD DATA
# ======================

df = pd.read_excel(
    "../datasets/RamMandir_Merged_Output_V4.xlsx"
)

# ======================
# FEATURES
# ======================

FEATURES = [
    "Month",
    "Day_of_Week",
    "Season",
    "Festival",
    "Temperature_C",
    "Previous_Day_Footfall",
    "Actual_Visitors",
    "Festival_Importance",
    "Festival_Window",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Temple_Capacity_Utilization",
    "Crowd_Density_Index",
    "Risk_Score"
]

TARGET = "Risk_Level_V4"

X = df[FEATURES]
y = df[TARGET]

# ======================
# SPLIT
# ======================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ======================
# PREPROCESSING
# ======================

categorical_features = [
    "Day_of_Week",
    "Season",
    "Festival",
    "Festival_Window"
]

numeric_features = [
    "Month",
    "Temperature_C",
    "Previous_Day_Footfall",
    "Actual_Visitors",
    "Festival_Importance",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Temple_Capacity_Utilization",
    "Crowd_Density_Index",
    "Risk_Score"
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

# ======================
# LABEL ENCODING
# ======================

label_map = {
    "LOW":0,
    "MEDIUM":1,
    "HIGH":2,
    "CRITICAL":3
}

y_train = y_train.map(label_map)
y_test = y_test.map(label_map)

# ======================
# MODELS
# ======================

models = {
    "LogisticRegression":
        LogisticRegression(max_iter=2000),

    "RandomForest":
        RandomForestClassifier(
            n_estimators=300,
            random_state=42
        ),

    "XGBoost":
        XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            random_state=42
        ),

    "LightGBM":
        LGBMClassifier(
            n_estimators=300,
            learning_rate=0.05,
            random_state=42
        )
}

best_model = None
best_accuracy = 0
best_name = ""

# ======================
# TRAIN
# ======================

for name, model in models.items():

    print(f"\nTraining {name}...")

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print(
        f"{name} Accuracy: "
        f"{accuracy:.4f}"
    )

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = pipeline
        best_name = name

# ======================
# SAVE MODEL
# ======================

joblib.dump(
    best_model,
    "../models/risk_prediction_model.pkl"
)

print("\n")
print("="*50)
print("BEST MODEL")
print("="*50)

print("Model:", best_name)
print("Accuracy:", round(best_accuracy,4))
print("\nSaved Successfully.")