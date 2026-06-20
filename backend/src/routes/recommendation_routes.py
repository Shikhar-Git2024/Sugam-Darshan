from fastapi import APIRouter

from controllers.recommendation_controller import (
    recommendation_controller
)

router = APIRouter()


@router.post("/recommend")
def recommend(data: dict):

    result = (
        recommendation_controller.get_recommendation(
            visit_date=data["visit_date"],
            people_count=data["people_count"],
            preferred_time=data["preferred_time"]
        )
    )

    return result