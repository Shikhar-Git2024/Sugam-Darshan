from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from config.database import get_db

from controllers.dashboard_controller import (
    dashboard_controller
)
from middleware.auth_middleware import (
    require_authority
)
from middleware.auth_middleware import (
    require_authority
)

router = APIRouter()


@router.get("/dashboard/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(
    require_authority
)
):

    return (
        dashboard_controller
        .get_summary(db)
    )

@router.get("/dashboard/users")
def dashboard_users(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_authority
    )
):

    return (
        dashboard_controller
        .get_users(db)
    )


@router.get("/dashboard/bookings")
def dashboard_bookings(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_authority
    )
):

    return (
        dashboard_controller
        .get_bookings(db)
    )


@router.get("/dashboard/waitlist")
def dashboard_waitlist(
    db: Session = Depends(get_db),
    current_user = Depends(
        require_authority
    )
):

    return (
        dashboard_controller
        .get_waitlist(db)
    )

@router.get("/dashboard/crowd")
def dashboard_crowd(
    current_user = Depends(
        require_authority
    )
):

    return (
        dashboard_controller
        .get_crowd_status()
    )


@router.get("/dashboard/risk")
def dashboard_risk(
    current_user = Depends(
        require_authority
    )
):

    return (
        dashboard_controller
        .get_risk_status()
    )