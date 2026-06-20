from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

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
from routes.dashboard_routes import (
    router as dashboard_router
)
from routes.admin_routes import (
    router as admin_router
)

app = FastAPI(
    title="Sugam Darshan API"
)

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
    dashboard_router
)
app.include_router(
    admin_router
)


@app.get("/")
def root():

    return {
        "message":
        "Sugam Darshan Backend Running"
    }