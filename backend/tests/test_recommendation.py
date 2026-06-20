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

from services.recommendation_engine import (
    recommendation_engine
)

result = recommendation_engine.recommend(
    visit_date="2026-10-25",
    people_count=4,
    preferred_time="18"
)

print(result)