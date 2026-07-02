from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from config.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    # Null means broadcast notification
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    title = Column(String, nullable=False)

    message = Column(String, nullable=False)

    # GENERAL | BOOKING | SOS | INCIDENT | WEATHER | FESTIVAL | AUTHORITY
    type = Column(String, default="GENERAL")

    # LOW | NORMAL | HIGH | CRITICAL
    priority = Column(String, default="NORMAL")

    # ALL | DEVOTEE | AUTHORITY | ADMIN
    audience = Column(String, default="ALL")

    is_read = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )