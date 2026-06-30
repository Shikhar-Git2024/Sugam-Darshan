from pydantic import BaseModel
from typing import Optional


class IncidentCreate(BaseModel):

    user_id: int

    type: str

    category: str

    description: str

    latitude: str

    longitude: str

    location_name: str

    # -------------------------
    # Missing Person Details
    # -------------------------

    missing_person_name: Optional[str] = None

    missing_person_age: Optional[int] = None

    missing_person_gender: Optional[str] = None

    contact_number: Optional[str] = None

    last_seen_time: Optional[str] = None

    image_path: Optional[str] = None


class IncidentResponse(BaseModel):

    success: bool

    incident_id: str

    status: str