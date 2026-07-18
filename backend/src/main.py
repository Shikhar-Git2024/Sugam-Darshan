from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from config.database import Base, engine
from fastapi.staticfiles import StaticFiles
import os

from apscheduler.schedulers.background import BackgroundScheduler
from scheduler.booking_scheduler import update_booking_status

from models.user_model import User
from models.booking_model import Booking
from models.transaction_model import Transaction
from models.waiting_list_model import WaitingList

from routes.public_routes import (
    router as public_router
)

from routes.recommendation_routes import (
    router as recommendation_router
)

from routes.auth_routes import (
    router as auth_router
)

from routes.booking_routes import (
    router as booking_router
)

from routes.qr_routes import (
    router as qr_router
)

from routes.dashboard_routes import (
    router as dashboard_router
)

from routes.admin_routes import (
    router as admin_router
)

from routes.incident_routes import (
    router as incident_router
)

from routes.notification_routes import (
    router as notification_router
)

from routes.profile_routes import (
    router as profile_router
)

from routes.upload_routes import (
    router as upload_router
)

app = FastAPI(
    title="Sugam Darshan API"
)

Base.metadata.create_all(bind=engine)

scheduler = BackgroundScheduler()

scheduler.add_job(
    update_booking_status,
    "interval",
    minutes=1
)

scheduler.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    public_router
)

app.include_router(
    recommendation_router
)

app.include_router(
    auth_router
)

app.include_router(
    booking_router
)

app.include_router(
    qr_router
)

app.include_router(
    dashboard_router
)

app.include_router(
    admin_router
)

app.include_router(
    incident_router
)
os.makedirs(
    "uploads",
    exist_ok=True
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.include_router(
    notification_router
)

app.include_router(
    profile_router
)

app.include_router(
    upload_router
)


@app.get("/")
def root():

    return {
        "message": "Sugam Darshan Backend Running"
    }