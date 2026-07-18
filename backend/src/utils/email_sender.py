from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()
print("USERNAME:", os.getenv("MAIL_USERNAME"))
print("FROM:", os.getenv("MAIL_FROM"))
print("NAME:", os.getenv("MAIL_FROM_NAME"))

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_reset_email(
    email: str,
    reset_link: str
):

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">

        <h2 style="color:#1b5e20;">
            🛕 Sugam Darshan
        </h2>

        <p>Hello,</p>

        <p>
            We received a request to reset your password.
        </p>

        <p>
            Click the button below:
        </p>

        <a href="{reset_link}"
        style="
        background:#1b5e20;
        color:white;
        padding:12px 20px;
        text-decoration:none;
        border-radius:6px;">
        Reset Password
        </a>

        <br><br>

        <p>
            This link expires in <b>30 minutes</b>.
        </p>

        <p>
            If you didn't request this, simply ignore this email.
        </p>

        <hr>

        <p>
            Team <b>Sugam Darshan</b>
        </p>

    </body>
    </html>
    """

    message = MessageSchema(
        subject="Reset Password | Sugam Darshan",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

import random


async def send_verification_otp(
    email: str,
    otp: str
):

    html = f"""
    <html>
    <body style="font-family:Arial,sans-serif;">

    <h2 style="color:#1b5e20;">
        🛕 Sugam Darshan
    </h2>

    <h3>Email Verification</h3>

    <p>Your verification OTP is:</p>

    <h1 style="
        letter-spacing:8px;
        color:#1b5e20;">
        {otp}
    </h1>

    <p>This OTP is valid for <b>30 minutes</b>.</p>

    <p>Do not share this OTP with anyone.</p>

    <hr>

    <p>Team Sugam Darshan</p>

    </body>
    </html>
    """

    message = MessageSchema(
        subject="Verify Your Email | Sugam Darshan",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)