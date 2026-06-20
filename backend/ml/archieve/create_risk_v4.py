import pandas as pd
import numpy as np

# Load V3 Dataset
df = pd.read_excel("../datasets/RamMandir_Merged_Output_V3.xlsx")

# Calculate percentiles from Actual Visitors
p50 = df["Actual_Visitors"].quantile(0.50)
p80 = df["Actual_Visitors"].quantile(0.80)
p95 = df["Actual_Visitors"].quantile(0.95)

print("P50:", p50)
print("P80:", p80)
print("P95:", p95)

# Risk Score (0-100)
df["Risk_Score_V4"] = (
    (
        df["Actual_Visitors"]
        / df["Actual_Visitors"].max()
    )
    * 100
)

# Risk Level using Percentiles
def assign_risk(visitors):

    if visitors < p50:
        return "LOW"

    elif visitors < p80:
        return "MEDIUM"

    elif visitors < p95:
        return "HIGH"

    return "CRITICAL"


df["Risk_Level_V4"] = df["Actual_Visitors"].apply(assign_risk)

# Save Dataset
df.to_excel(
    "../datasets/RamMandir_Merged_Output_V4.xlsx",
    index=False
)

print("\nDataset V4 Created Successfully\n")

print(df["Risk_Level_V4"].value_counts())

print("\nPercentages:\n")

print(
    (
        df["Risk_Level_V4"]
        .value_counts(normalize=True)
        * 100
    ).round(2)
)