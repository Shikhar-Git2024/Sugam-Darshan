from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db
from controllers.profile_controller import profile_controller
from schemas.profile_schema import ProfileUpdateRequest

router = APIRouter()


@router.get("/devotee/profile/{user_id}")
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    return profile_controller.get_profile(
        db=db,
        user_id=user_id
    )


@router.put("/devotee/profile/update")
def update_profile(
    profile: ProfileUpdateRequest,
    db: Session = Depends(get_db)
):
    return profile_controller.update_profile(
        db=db,
        user_id=profile.user_id,
        phone=profile.phone,
        language=profile.language,
        visit_time=profile.visitTime,
        emergency_name=profile.emergencyName,
        emergency_phone=profile.emergencyPhone
    )