from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from config.database import Base


class Transaction(Base):

    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    transaction_id = Column(
        String,
        unique=True
    )

    booking_id = Column(
        String
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    amount = Column(
        Float,
        default=0.0
    )

    payment_status = Column(
        String,
        default="SUCCESS"
    )

    payment_method = Column(
        String,
        default="FREE"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )