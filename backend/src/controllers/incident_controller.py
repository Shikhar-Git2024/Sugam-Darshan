import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from models.incident_model import Incident
from services.notification_service import NotificationService


class IncidentController:

    @staticmethod
    def generate_incident_id():
        return (
            "INC-"
            + datetime.now().strftime("%Y")
            + "-"
            + uuid.uuid4().hex[:6].upper()
        )
    
    @staticmethod
    def get_priority(category: str):
        priority_map = {
            # Critical
            "Medical Emergency": "CRITICAL",
            "Fire Hazard": "CRITICAL",
            "Stampede Risk": "CRITICAL",
            "Lost Child": "CRITICAL",
            # High
            "Security Threat": "HIGH",
            "Lost Elderly": "HIGH",
            "Missing Person": "HIGH",
        }
        return priority_map.get(
            category,
            "MEDIUM"
        )

    @staticmethod
    def create_incident(db: Session, data):

        incident = Incident(

            incident_id=IncidentController.generate_incident_id(),
            user_id=data.user_id,
            type=data.type,
            category=data.category,
            description=data.description,
            latitude=data.latitude,
            longitude=data.longitude,
            location_name=data.location_name,
            priority=IncidentController.get_priority(
                data.category
            ),
            status="ACTIVE",

            # Missing Person Details
            missing_person_name=data.missing_person_name,
            missing_person_age=data.missing_person_age,
            missing_person_gender=data.missing_person_gender,
            contact_number=data.contact_number,
            last_seen_time=data.last_seen_time,
            image_path=data.image_path,
        )

        db.add(incident)
        db.commit()
        db.refresh(incident)

        NotificationService.send(
            db=db,
            title="Emergency SOS Registered",
            message=f"Temple Security has received your emergency alert ({incident.category}). Help is being dispatched.",
            user_id=incident.user_id,
            type="SOS",
            priority="HIGH",
        )

        return incident

    @staticmethod
    def get_all_incidents(db: Session):

        return (
            db.query(Incident)
            .order_by(Incident.created_at.desc())
            .all()
        )

    @staticmethod
    def get_user_incidents(db: Session, user_id: int):

        return (
            db.query(Incident)
            .filter(Incident.user_id == user_id)
            .order_by(Incident.created_at.desc())
            .all()
        )

    @staticmethod
    def assign_incident(
        db: Session,
        incident_id: int,
        authority_id: int,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if not incident:
            return None

        incident.authority_id = authority_id
        incident.assigned_at = datetime.utcnow()
        incident.status = "IN_PROGRESS"

        db.commit()
        db.refresh(incident)

        NotificationService.send(
            db=db,
            title="Security Responding",
            message="An emergency response team has taken ownership of your incident and is moving to your position.",
            user_id=incident.user_id,
            type="SOS",
            priority="HIGH",
        )

        return incident

    @staticmethod
    def resolve_incident(
        db: Session,
        incident_id: int,
    ):

        incident = (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

        if not incident:
            return None

        incident.status = "RESOLVED"
        incident.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(incident)

        NotificationService.send(
            db=db,
            title="Emergency Resolved",
            message="Temple authorities have resolved your incident. Please reach out if you need further assistance.",
            user_id=incident.user_id,
            type="SOS",
            priority="HIGH",
        )

        return incident