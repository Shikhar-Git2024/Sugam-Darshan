from services.recommendation_engine import (
    recommendation_engine
)

class RecommendationController:

    def get_recommendation(
        self,
        visit_date,
        people_count,
        preferred_time
    ):

        result = recommendation_engine.recommend(
            visit_date=visit_date,
            people_count=people_count,
            preferred_time=preferred_time
        )

        return result


recommendation_controller = (
    RecommendationController()
)