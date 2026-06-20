import pandas as pd

# Load datasets
slot_df = pd.read_csv(
    "../datasets/RamMandir_SlotWise_Dataset_V2.csv"
)

daily_df = pd.read_excel(
    "../datasets/RamMandir_Merged_Output_V4.xlsx"
)

# Columns to bring from daily dataset
daily_features = [
    "Date",
    "Month",
    "Day_of_Week",
    "Season",
    "Temperature_C",
    "Festival_Importance",
    "Public_Holiday",
    "Long_Weekend_Flag",
    "School_Holiday_Flag",
    "Risk_Level_V4"
]

daily_df = daily_df[daily_features]

# Convert dates
slot_df["Date"] = pd.to_datetime(slot_df["Date"])
daily_df["Date"] = pd.to_datetime(daily_df["Date"])

# Merge
merged_df = slot_df.merge(
    daily_df,
    on="Date",
    how="left"
)

# Weekend Feature
merged_df["Weekend"] = (
    merged_df["Day_of_Week"]
    .isin(["Saturday", "Sunday"])
).astype(int)

# Save
merged_df.to_csv(
    "../datasets/RamMandir_SlotWise_Dataset_V3.csv",
    index=False
)

print("Slot Dataset V3 Created Successfully")

print("\nRows:", len(merged_df))

print("\nColumns:")
print(merged_df.columns.tolist())