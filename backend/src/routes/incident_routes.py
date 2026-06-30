from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from config.database import get_db
from controllers.incident_controller import IncidentController
from schemas.incident import IncidentCreate

router = APIRouter(
    prefix="/incident",
    tags=["Incident Management"]
)


# -------------------------------
# Create Incident (SOS / Missing)
# -------------------------------

@router.post("/create")
def create_incident(
    request: IncidentCreate,
    db: Session = Depends(get_db),
):

    incident = IncidentController.create_incident(
        db,
        request,
    )

    return {
        "success": True,
        "incident_id": incident.incident_id,
        "status": incident.status,
        "message": "Incident created successfully."
    }


# -------------------------------
# Get All Incidents (Authority)
# -------------------------------

@router.get("/all")
def get_all_incidents(
    db: Session = Depends(get_db),
):

    incidents = IncidentController.get_all_incidents(db)

    return {
        "count": len(incidents),
        "incidents": incidents
    }


# -------------------------------
# Get User Incidents
# -------------------------------

@router.get("/my/{user_id}")
def get_user_incidents(
    user_id: int = Path(...),
    db: Session = Depends(get_db),
):

    incidents = IncidentController.get_user_incidents(
        db,
        user_id,
    )

    return {
        "count": len(incidents),
        "incidents": incidents
    }


# -------------------------------
# Assign Incident
# -------------------------------

@router.put("/assign/{incident_id}/{authority_id}")
def assign_incident(
    incident_id: int,
    authority_id: int,
    db: Session = Depends(get_db),
):

    incident = IncidentController.assign_incident(
        db,
        incident_id,
        authority_id,
    )

    if not incident:
        return {
            "success": False,
            "message": "Incident not found."
        }

    return {
        "success": True,
        "message": "Incident assigned successfully.",
        "status": incident.status,
    }


# -------------------------------
# Resolve Incident
# -------------------------------

@router.put("/resolve/{incident_id}")
def resolve_incident(
    incident_id: int,
    db: Session = Depends(get_db),
):

    incident = IncidentController.resolve_incident(
        db,
        incident_id,
    )

    if not incident:
        return {
            "success": False,
            "message": "Incident not found."
        }

    return {
        "success": True,
        "message": "Incident resolved successfully.",
        "status": incident.status,
    }