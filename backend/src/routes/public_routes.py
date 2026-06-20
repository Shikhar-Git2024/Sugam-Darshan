from fastapi import APIRouter, Depends

from config.database import get_db

from controllers.public_controller import (
    public_controller
)

router = APIRouter()


@router.get("/public/home-stats")
def home_stats(
    db=Depends(get_db)
):
    return public_controller.home_stats(db)


@router.get("/public/crowd-status")
def crowd_status():
    return public_controller.crowd_status()


@router.get("/public/forecast")
def forecast():
    return public_controller.forecast()