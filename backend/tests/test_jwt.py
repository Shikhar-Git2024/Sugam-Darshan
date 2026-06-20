import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from utils.jwt_handler import (
    create_access_token
)

token = create_access_token(
    {
        "user_id": 1,
        "email": "test@test.com",
        "role": "DEVOTEE"
    }
)

print(token)