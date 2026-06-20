from pydantic import BaseModel


class BookingRequest(BaseModel):

    user_id: int
    visit_date: str
    slot: str
    booking_type: str
    people_count: int