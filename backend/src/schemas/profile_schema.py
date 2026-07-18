from pydantic import BaseModel


class ProfileUpdateRequest(BaseModel):
    user_id: int
    phone: str
    language: str
    visitTime: str
    emergencyName: str
    emergencyPhone: str