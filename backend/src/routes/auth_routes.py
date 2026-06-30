from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from config.database import get_db

from schemas.user_schema import UserRegister
from schemas.login_schema import LoginRequest
from schemas.forgot_password_schema import ForgotPasswordRequest
from schemas.reset_password_schema import ResetPasswordRequest
from controllers.auth_controller import auth_controller

router = APIRouter()


@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    return auth_controller.register_user(
        db=db,
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=user.password
    )


@router.post("/login")
def login_user(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    return auth_controller.login_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    return auth_controller.forgot_password(
        db=db,
        email=data.email
    )
@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    return auth_controller.reset_password(
        db=db,
        token=data.token,
        new_password=data.new_password
    )