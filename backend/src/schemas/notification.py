from pydantic import BaseModel
from typing import Optional


class NotificationCreate(BaseModel):

    user_id: Optional[int] = None

    title: str

    message: str

    type: str

    priority: str

    audience: str


class NotificationResponse(BaseModel):

    success: bool

    message: str