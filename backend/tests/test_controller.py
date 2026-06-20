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

from controllers.recommendation_controller import (
    recommendation_controller
)

result = (
    recommendation_controller.get_recommendation(
        visit_date="2026-10-25",
        people_count=4,
        preferred_time="evening"
    )
)

print(result)