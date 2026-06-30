from sqlalchemy.orm import Session

import secrets
import asyncio
from datetime import datetime, timedelta

from models.user_model import User

from utils.security import (
    hash_password,
    verify_password
)

from utils.jwt_handler import create_access_token
from utils.email_sender import send_reset_email


class AuthController:

    def register_user(
        self,
        db: Session,
        name,
        email,
        phone,
        password
    ):

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            return {
                "success": False,
                "message": "Email already registered"
            }

        new_user = User(
            name=name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            role="DEVOTEE"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": new_user.id
        }

    def login_user(
        self,
        db: Session,
        email,
        password,
        role
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "Invalid Email"
            }

        if not verify_password(
            password,
            user.password_hash
        ):
            return {
                "success": False,
                "message": "Invalid Password"
            }
        
        if user.role != role:
            
            redirect_map = {
                "DEVOTEE": "/devotee/login",
                "AUTHORITY": "/authority/login",
                "ADMIN": "/admin/login"
            }

            return {
                "success": False,
                "message": f"This account belongs to the {user.role} Portal.",
                "redirect": redirect_map.get(user.role)
            }

        token = create_access_token(
            {
                "user_id": user.id,
                "email": user.email,
                "role": user.role
            }
        )

        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }

    def forgot_password(
        self,
        db: Session,
        email
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "No account found with this email."
            }

        token = secrets.token_urlsafe(32)

        user.reset_token = token
        user.reset_token_expiry = (
            datetime.utcnow() + timedelta(minutes=30)
        )

        db.commit()

        reset_link = (
            f"http://localhost:5173/reset-password/{token}"
        )

        asyncio.run(
            send_reset_email(
                user.email,
                reset_link
            )
        )

        return {
            "success": True,
            "message": "Password reset email sent successfully."
        }

    def reset_password(
        self,
        db: Session,
        token,
        new_password
    ):

        user = (
            db.query(User)
            .filter(User.reset_token == token)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "Invalid reset token."
            }

        if datetime.utcnow() > user.reset_token_expiry:
            return {
                "success": False,
                "message": "Reset token has expired."
            }

        user.password_hash = hash_password(new_password)

        user.reset_token = None
        user.reset_token_expiry = None

        db.commit()

        return {
            "success": True,
            "message": "Password reset successfully."
        }


auth_controller = AuthController()