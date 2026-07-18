import asyncio
import random
import secrets
from datetime import datetime, timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.user_model import User
from utils.email_sender import send_reset_email, send_verification_otp
from utils.google_auth import verify_google_token
from utils.jwt_handler import create_access_token
from utils.security import hash_password, verify_password


class AuthController:

    def register_user(self, db: Session, name, email, phone, password):

        # Step 1: Improved unverified account update block
        existing_email = db.query(User).filter(User.email == email).first()
        if existing_email:
            if existing_email.email_verified:
                return {"success": False, "message": "Email already registered."}

            # Update details if account exists but isn't verified yet
            existing_email.name = name
            existing_email.phone = phone
            existing_email.password_hash = hash_password(password)

            otp = str(random.randint(100000, 999999))
            existing_email.email_otp = otp
            existing_email.email_otp_expiry = datetime.utcnow() + timedelta(
                minutes=30
            )

            db.commit()

            asyncio.run(send_verification_otp(existing_email.email, otp))

            return {
                "success": True,
                "message": "Account already exists but was not verified. We've updated your details and sent a new verification OTP.",
                "email_verification_required": True,
                "email": existing_email.email,
            }

        existing_phone = db.query(User).filter(User.phone == phone).first()
        if existing_phone:
            return {
                "success": False,
                "message": "Phone number already registered",
            }

        try:
            otp = str(random.randint(100000, 999999))

            new_user = User(
                name=name,
                email=email,
                phone=phone,
                password_hash=hash_password(password),
                role="DEVOTEE",
                auth_provider="LOCAL",
                email_verified=False,
                email_otp=otp,
                email_otp_expiry=datetime.utcnow() + timedelta(minutes=30),
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            asyncio.run(send_verification_otp(new_user.email, otp))

            # Step 2: Improved Register API Response
            return {
                "success": True,
                "message": "Registration successful. Please verify your email.",
                "user_id": new_user.id,
                "email_verification_required": True,
                "email": new_user.email,
            }

        except IntegrityError:
            db.rollback()
            return {
                "success": False,
                "message": "Registration failed. Email or phone number already exists.",
            }

        except Exception:
            db.rollback()
            return {
                "success": False,
                "message": "Something went wrong. Please try again.",
            }

    def login_user(self, db: Session, email, password, role):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"success": False, "message": "Invalid Email"}

        if user.auth_provider == "GOOGLE":
            return {
                "success": False,
                "message": "This account uses Google Sign-In. Please continue with Google.",
            }

        if not verify_password(password, user.password_hash):
            return {"success": False, "message": "Invalid Password"}

        if user.role != role:
            redirect_map = {
                "DEVOTEE": "/devotee/login",
                "AUTHORITY": "/authority/login",
                "ADMIN": "/admin/login",
            }
            return {
                "success": False,
                "message": f"This account belongs to the {user.role} Portal.",
                "redirect": redirect_map.get(user.role),
            }

        if not user.email_verified:
            return {
                "success": False,
                "message": "Please verify your email before logging in.",
            }

        token = create_access_token(
            {"user_id": user.id, "email": user.email, "role": user.role}
        )
        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }

    def google_login(self, db: Session, google_token):
        google_user = verify_google_token(google_token)
        if not google_user["success"]:
            return {"success": False, "message": "Invalid Google Token"}

        user = db.query(User).filter(User.email == google_user["email"]).first()
        if not user:
            user = User(
                name=google_user["name"],
                email=google_user["email"],
                phone=None,
                password_hash=None,
                role="DEVOTEE",
                auth_provider="GOOGLE",
                google_id=google_user["google_id"],
                profile_picture=google_user["picture"],
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        token = create_access_token(
            {"user_id": user.id, "email": user.email, "role": user.role}
        )
        return {
            "success": True,
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
            },
        }

    def forgot_password(self, db: Session, email):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {
                "success": False,
                "message": "No account found with this email.",
            }

        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=30)
        db.commit()

        reset_link = f"http://localhost:5173/reset-password/{token}"
        asyncio.run(send_reset_email(user.email, reset_link))
        return {
            "success": True,
            "message": "Password reset email sent successfully.",
        }

    def reset_password(self, db: Session, token, new_password):
        user = db.query(User).filter(User.reset_token == token).first()
        if not user:
            return {"success": False, "message": "Invalid reset token."}
        if datetime.utcnow() > user.reset_token_expiry:
            return {"success": False, "message": "Reset token has expired."}

        user.password_hash = hash_password(new_password)
        user.reset_token = None
        user.reset_token_expiry = None
        db.commit()
        return {"success": True, "message": "Password reset successfully."}

    def verify_email(self, db: Session, email, otp):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"success": False, "message": "User not found."}
        if user.email_verified:
            return {"success": False, "message": "Email is already verified."}
        if datetime.utcnow() > user.email_otp_expiry:
            return {"success": False, "message": "OTP has expired."}
        if user.email_otp != otp:
            return {"success": False, "message": "Invalid OTP."}

        user.email_verified = True
        user.email_otp = None
        user.email_otp_expiry = None
        db.commit()
        return {"success": True, "message": "Email verified successfully."}

    def resend_email_otp(self, db: Session, email):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"success": False, "message": "User not found."}
        if user.email_verified:
            return {"success": False, "message": "Email is already verified."}

        otp = str(random.randint(100000, 999999))
        user.email_otp = otp
        user.email_otp_expiry = datetime.utcnow() + timedelta(minutes=30)
        db.commit()

        asyncio.run(send_verification_otp(user.email, otp))
        return {"success": True, "message": "OTP sent successfully."}


auth_controller = AuthController()