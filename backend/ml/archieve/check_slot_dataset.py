import pandas as pd

df = pd.read_csv(
    "../datasets/RamMandir_SlotWise_Dataset_V2.csv"
)

print("Rows:", len(df))

print("\nUnique Visitors Values:")
print(df["Visitors"].nunique())

print("\nTop Visitor Counts:")
print(df["Visitors"].value_counts().head(20))

print("\nVisitors Statistics:")
print(df["Visitors"].describe())