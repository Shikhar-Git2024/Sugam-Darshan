from pydantic import BaseModel
from pydantic import EmailStr


class VerifyEmailRequest(BaseModel):

    email: EmailStr
    otp: str