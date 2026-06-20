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

from config.database import engine
from sqlalchemy import text

try:

    with engine.connect() as conn:

        result = conn.execute(
            text("SELECT version();")
        )

        print("Database Connected Successfully")

        print(result.fetchone())

except Exception as e:

    print("Database Connection Failed")

    print(e)