from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from config.database import Base


class WaitingList(Base):

    __tablename__ = "waiting_list"

    id = Column(
        Integer,
        primary_key=True,
        index=True
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

    position = Column(
        Integer
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )