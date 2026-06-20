from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from config.database import get_db

from middleware.auth_middleware import (
    require_admin
)

from controllers.admin_controller import (
    admin_controller
)

router = APIRouter()


@router.get("/admin/stats")
def admin_stats(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_admin
    )
):

    return admin_controller.get_system_stats(
        db
    )


@router.post(
    "/admin/create-authority/{user_id}"
)
def create_authority(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_admin
    )
):

    return (
        admin_controller
        .create_authority(
            db,
            user_id
        )
    )