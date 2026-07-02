from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from config.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    phone = Column(
        String,
        unique=True,
        nullable=True      # Changed
    )

    password_hash = Column(
        String,
        nullable=True      # Changed
    )

    auth_provider = Column(
        String,
        default="LOCAL"
    )

    google_id = Column(
        String,
        unique=True,
        nullable=True
    )

    profile_picture = Column(
        String,
        nullable=True
    )

    role = Column(
        String,
        default="DEVOTEE"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )