from sqlalchemy.orm import Session

from models.user_model import User
from utils.security import hash_password
from utils.security import verify_password
from utils.jwt_handler import create_access_token


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
        db,
        email,
        password
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

auth_controller = AuthController()