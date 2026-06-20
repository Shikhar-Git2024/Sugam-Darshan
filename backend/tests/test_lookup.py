import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from utils.data_lookup import data_lookup

data = data_lookup.get_date_features(
    "2026-10-25"
)

print(data)