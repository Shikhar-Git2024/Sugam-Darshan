from datetime import datetime

from config.database import SessionLocal
from models.booking_model import Booking


def update_booking_status():

    db = SessionLocal()

    try:

        bookings = (
            db.query(Booking)
            .filter(
                Booking.booking_status.in_(
                    ["CONFIRMED", "CHECKED_IN"]
                )
            )
            .all()
        )

        current_time = datetime.now()

        for booking in bookings:

            try:

                slot = booking.slot.strip()

                if "(" not in slot:

                    if " - " not in slot:
                        print(
                            f"[Scheduler] Invalid Darshan Slot ({booking.booking_id}): {slot}"
                        )
                        continue

                    end_time = slot.split(" - ")[1].strip()

                else:

                    if "(" not in slot or ")" not in slot:
                        print(
                            f"[Scheduler] Invalid Aarti Slot ({booking.booking_id}): {slot}"
                        )
                        continue

                    time_range = slot.split("(")[1].split(")")[0]

                    if " - " not in time_range:
                        print(
                            f"[Scheduler] Invalid Aarti Time Range ({booking.booking_id}): {slot}"
                        )
                        continue

                    end_time = time_range.split(" - ")[1].strip()

                slot_end = datetime.strptime(
                    f"{booking.visit_date} {end_time}",
                    "%Y-%m-%d %I:%M %p"
                )

                if current_time >= slot_end:

                    if booking.booking_status == "CONFIRMED":

                        booking.booking_status = "EXPIRED"

                    elif booking.booking_status == "CHECKED_IN":

                        booking.booking_status = "COMPLETED"

            except Exception as e:

                print(
                    f"[Scheduler] Error Processing Booking {booking.booking_id}: {e}"
                )

                continue

    except Exception as e:

        print("Scheduler Error:", e)

        db.rollback()

    finally:

        db.close()