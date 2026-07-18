from pydantic import BaseModel
from pydantic import EmailStr


class ResendOTPRequest(BaseModel):

    email: EmailStr