from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from config.database import Base


class Booking(Base):

    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    booking_id = Column(
        String,
        unique=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    visit_date = Column(
        String
    )

    slot = Column(
        String
    )

    booking_type = Column(
        String,
        default="DARSHAN"
    )

    people_count = Column(
        Integer
    )

    booking_status = Column(
        String,
        default="CONFIRMED"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )