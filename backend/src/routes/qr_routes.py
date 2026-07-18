from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from config.database import get_db

from controllers.booking_controller import booking_controller

from services.qr_service import QRService

router = APIRouter()

@router.get("/booking/{booking_id}/qr")
def get_booking_qr(
    booking_id: str,
    db: Session = Depends(get_db)
):

    return booking_controller.get_booking_qr(
        db=db,
        booking_id=booking_id
    )