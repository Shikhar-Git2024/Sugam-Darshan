from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = (
    "316854803069-2nm8uvdc2bsqk86mbs1p5r5snu2iggal.apps.googleusercontent.com"
)


def verify_google_token(token: str):

    try:

        user_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        return {
            "success": True,
            "email": user_info.get("email"),
            "name": user_info.get("name"),
            "google_id": user_info.get("sub"),
            "picture": user_info.get("picture"),
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }