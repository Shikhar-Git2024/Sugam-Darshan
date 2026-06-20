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

from utils.security import (
    hash_password,
    verify_password
)

hashed = hash_password(
    "SugamDarshan123"
)

print("HASH:")
print(hashed)

print("\nVERIFY:")

print(
    verify_password(
        "SugamDarshan123",
        hashed
    )
)