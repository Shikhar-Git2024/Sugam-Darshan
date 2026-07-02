from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from config.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(String, unique=True, index=True)

    authority_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    # SOS / MISSING_PERSON
    type = Column(String, nullable=False)

    category = Column(String, nullable=False)

    description = Column(String)

    latitude = Column(String)

    longitude = Column(String)

    location_name = Column(String)

    priority = Column(
        String,
        default="HIGH"
    )

    status = Column(
        String,
        default="ACTIVE"
    )

    assigned_authority = Column(
        Integer,
        nullable=True
    )

    # ==========================
    # Missing Person Details
    # ==========================

    missing_person_name = Column(
        String,
        nullable=True
    )

    missing_person_age = Column(
        Integer,
        nullable=True
    )

    missing_person_gender = Column(
        String,
        nullable=True
    )

    contact_number = Column(
        String,
        nullable=True
    )

    last_seen_time = Column(
        String,
        nullable=True
    )

    image_path = Column(
        String,
        nullable=True
    )

    # ==========================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    assigned_at = Column(
        DateTime,
        nullable=True
    )

    resolved_at = Column(
        DateTime,
        nullable=True
    )