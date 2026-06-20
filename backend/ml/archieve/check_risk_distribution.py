import pandas as pd

df = pd.read_excel(
    "../datasets/RamMandir_Merged_Output_V3.xlsx"
)

print(df["Risk_Level_V3"].value_counts())

print("\nPercentages:\n")

print(
    (
        df["Risk_Level_V3"]
        .value_counts(normalize=True)
        * 100
    ).round(2)
)