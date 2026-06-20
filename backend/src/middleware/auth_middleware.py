from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import HTTPException
from fastapi import HTTPException

from utils.jwt_handler import (
    verify_token
)

security = HTTPBearer()


def get_current_user(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):

    token = credentials.credentials

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    return payload

def require_authority(
    current_user = Depends(
        get_current_user
    )
):

    if current_user["role"] not in [
        "AUTHORITY",
        "ADMIN"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Access Denied"
        )

    return current_user

def require_admin(
    current_user=Depends(
        get_current_user
    )
):

    if current_user["role"] != "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Required"
        )

    return current_user