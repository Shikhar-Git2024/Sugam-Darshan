from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models.user_model import User

from utils.security import hash_password
from utils.security import verify_password
from utils.jwt_handler import create_access_token
from utils.google_auth import verify_google_token


class AuthController:

    def register_user(
        self,
        db: Session,
        name,
        email,
        phone,
        password
    ):

        existing_email = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_email:

            return {
                "success": False,
                "message": "Email already registered"
            }

        existing_phone = (
            db.query(User)
            .filter(User.phone == phone)
            .first()
        )

        if existing_phone:

            return {
                "success": False,
                "message": "Phone number already registered"
            }

        try:

            new_user = User(
                name=name,
                email=email,
                phone=phone,
                password_hash=hash_password(password),
                role="DEVOTEE",
                auth_provider="LOCAL"
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return {
                "success": True,
                "message": "User registered successfully",
                "user_id": new_user.id
            }

        except IntegrityError:

            db.rollback()

            return {
                "success": False,
                "message": "Registration failed. Email or phone number already exists."
            }

        except Exception:

            db.rollback()

            return {
                "success": False,
                "message": "Something went wrong. Please try again."
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

        if user.auth_provider == "GOOGLE":

            return {
                "success": False,
                "message": "This account uses Google Sign-In. Please continue with Google."
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

    def google_login(
        self,
        db,
        google_token
    ):

        google_user = verify_google_token(
            google_token
        )

        if not google_user["success"]:

            return {
                "success": False,
                "message": "Invalid Google Token"
            }

        user = (
            db.query(User)
            .filter(User.email == google_user["email"])
            .first()
        )

        if not user:

            user = User(
                name=google_user["name"],
                email=google_user["email"],
                phone=None,
                password_hash=None,
                role="DEVOTEE",
                auth_provider="GOOGLE",
                google_id=google_user["google_id"],
                profile_picture=google_user["picture"]
            )

            db.add(user)
            db.commit()
            db.refresh(user)

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