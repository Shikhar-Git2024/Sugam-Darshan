import sys
import os

ROOT_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

sys.path.insert(0, ROOT_DIR)

from config.database import Base
from config.database import engine

from models.user_model import User
from models.booking_model import Booking
from models.waiting_list_model import WaitingList

Base.metadata.create_all(bind=engine)

print("All Tables Created Successfully")