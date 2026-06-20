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

from services.forecast_service import forecast_service

models = forecast_service.get_models()

print("Models Loaded:")
print(models.keys())

print("\nForecast Service Ready")