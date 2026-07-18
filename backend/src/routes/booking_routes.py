from fastapi import APIRouter
from fastapi import Depends
from fastapi import Path
from fastapi import HTTPException

from sqlalchemy.orm import Session

from config.database import get_db

from schemas.booking_schema import (
    BookingRequest,
    EditBookingRequest,
    CheckInRequest
)

from controllers.booking_controller import (
    booking_controller
)

router = APIRouter()


@router.post("/book-slot")
def book_slot(
    booking: BookingRequest,
    db: Session = Depends(get_db)
):

    result = booking_controller.create_booking(
        db=db,
        user_id=booking.user_id,
        visit_date=booking.visit_date,
        slot=booking.slot,
        booking_type=booking.booking_type,
        people_count=booking.people_count
    )

    if not result["success"]:
        raise HTTPException(
            status_code=400,
            detail=result
        )

    return result

@router.get("/booking/{booking_id}")
def get_booking(
    booking_id: str,
    db: Session = Depends(get_db)
):

    return booking_controller.get_booking(
        db=db,
        booking_id=booking_id
    )

@router.put("/booking/{booking_id}")
def edit_booking(
    booking_id: str,
    booking: EditBookingRequest,
    db: Session = Depends(get_db)
):

    result = booking_controller.update_booking(
        db=db,
        booking_id=booking_id,
        visit_date=booking.visit_date,
        slot=booking.slot,
        people_count=booking.people_count
    )

    if not result["success"]:
        raise HTTPException(
            status_code=400,
            detail=result
        )

    return result

@router.post("/booking/check-in")
def check_in_booking(
    request: CheckInRequest,
    db: Session = Depends(get_db)
):

    return booking_controller.check_in_booking(
        db=db,
        booking_id=request.booking_id
    )

@router.post("/cancel-booking/{booking_id}")
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db)
):

    return booking_controller.cancel_booking(
        db=db,
        booking_id=booking_id
    )

@router.get("/my-bookings/{user_id}")
def my_bookings(
    user_id: int,
    db: Session = Depends(get_db)
):

    return booking_controller.get_user_bookings(
        db=db,
        user_id=user_id
    )

@router.get("/available-slots")
def available_slots(
    visit_date: str,
    booking_type: str,
    db: Session = Depends(get_db)
):

    return booking_controller.get_available_slots(
        db=db,
        visit_date=visit_date,
        booking_type=booking_type
    )