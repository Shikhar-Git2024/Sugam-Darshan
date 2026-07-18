from fastapi import HTTPException
from models.user_model import User


class ProfileController:

    def get_profile(self, db, user_id):

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "profile": {
                "phone": user.phone,
                "language": user.language,
                "visitTime": user.visit_time,
                "emergencyName": user.emergency_name,
                "emergencyPhone": user.emergency_phone
            }
        }


    def update_profile(
        self,
        db,
        user_id,
        phone,
        language,
        visit_time,
        emergency_name,
        emergency_phone
    ):

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        user.phone = phone
        user.language = language
        user.visit_time = visit_time
        user.emergency_name = emergency_name
        user.emergency_phone = emergency_phone

        db.commit()
        db.refresh(user)

        return {
            "message": "Profile updated successfully",
            "profile": {
                "phone": user.phone,
                "language": user.language,
                "visitTime": user.visit_time,
                "emergencyName": user.emergency_name,
                "emergencyPhone": user.emergency_phone
            }
        }


profile_controller = ProfileController()