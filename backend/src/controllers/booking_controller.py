from datetime import datetime, timedelta
from sqlalchemy import func

# Models
from models.booking_model import Booking
from models.waiting_list_model import WaitingList
from models.transaction_model import Transaction

# Utilities & Services
from utils.temple_slots import DARSHAN_SLOTS, AARTI_SLOTS
from services.notification_service import NotificationService
from fastapi.responses import StreamingResponse
from services.qr_service import QRService

# Configurations / Constraints
from config.constants import (
    SLOT_CAPACITY,
    MAX_PEOPLE_PER_BOOKING,
    MAX_FUTURE_BOOKINGS,
    BOOKING_LOCK_MINUTES
)

class BookingController:

    def generate_booking_id(self, booking_db_id):
        return f"SD2026{booking_db_id:06d}"

    def generate_transaction_id(self, transaction_db_id):
        return f"TXN2026{transaction_db_id:06d}"

    def _parse_slot_start_time(self, visit_date, slot_string):
        try:
            if '(' in slot_string and ')' in slot_string:
                time_part = slot_string.split('(')[1].split(')')[0]
            else:
                time_part = slot_string
                
            start_time_str = time_part.split('-')[0].strip()
            return datetime.strptime(f"{visit_date} {start_time_str}", "%Y-%m-%d %I:%M %p")
        except Exception as e:
            raise ValueError(f"Invalid slot format: {slot_string}") from e

    def _parse_slot_end_time(self, visit_date, slot_string):
        try:
            if '(' in slot_string and ')' in slot_string:
                time_part = slot_string.split('(')[1].split(')')[0]
            else:
                time_part = slot_string
                
            end_time_str = time_part.split('-')[1].strip()
            return datetime.strptime(f"{visit_date} {end_time_str}", "%Y-%m-%d %I:%M %p")
        except Exception as e:
            raise ValueError(f"Invalid slot format: {slot_string}") from e

    def create_booking(self, db, user_id, visit_date, slot, booking_type, people_count):
        if people_count < 1:
            return {
                "success": False,
                "error_code": "INVALID_PEOPLE_COUNT",
                "message": "Invalid people count."
            }

        if people_count > MAX_PEOPLE_PER_BOOKING:
            return {
                "success": False,
                "error_code": "MAX_PEOPLE_EXCEEDED",
                "message": f"Maximum {MAX_PEOPLE_PER_BOOKING} devotees are allowed in a single booking."
            }

        booking_datetime = self._parse_slot_start_time(visit_date, slot)
        lock_time = booking_datetime - timedelta(minutes=BOOKING_LOCK_MINUTES)

        if datetime.now() >= lock_time:
            return {
                "success": False,
                "error_code": "BOOKING_CLOSED",
                "message": f"Booking for this slot closes {BOOKING_LOCK_MINUTES} minutes before the slot starts."
            }
        
        existing_booking = (
            db.query(Booking)
            .filter(
                Booking.user_id == user_id,
                Booking.visit_date == visit_date,
                Booking.booking_status == "CONFIRMED"
            )
            .first()
        )

        if existing_booking:
            return {
                "success": False,
                "error_code": "DUPLICATE_BOOKING",
                "message": "You already have a confirmed booking for this date."
            }

        today = datetime.now().date()
        future_booking_count = 0
        user_bookings = (
            db.query(Booking)
            .filter(
                Booking.user_id == user_id,
                Booking.booking_status == "CONFIRMED"
            )
            .all()
        )

        for booking in user_bookings:
            booking_date = datetime.strptime(booking.visit_date, "%Y-%m-%d").date()
            if booking_date > today:
                future_booking_count += 1

        if future_booking_count >= MAX_FUTURE_BOOKINGS:
            return {
                "success": False,
                "error_code": "FUTURE_BOOKING_LIMIT",
                "message": f"You can have a maximum of {MAX_FUTURE_BOOKINGS} active future bookings. Please cancel one before making another booking."
            }

        current_people = (
            db.query(func.sum(Booking.people_count))
            .filter(
                Booking.visit_date == visit_date,
                Booking.slot == slot,
                Booking.booking_status == "CONFIRMED"
            )
            .scalar() or 0
        )

        if current_people + people_count > SLOT_CAPACITY:
            position = (
                db.query(WaitingList)
                .filter(WaitingList.visit_date == visit_date, WaitingList.slot == slot)
                .count()
            ) + 1

            wait_entry = WaitingList(
                user_id=user_id,
                visit_date=visit_date,
                slot=slot,
                booking_type=booking_type,
                people_count=people_count,
                position=position
            )
            db.add(wait_entry)
            db.commit()

            NotificationService.send(
                db=db,
                title="Booking Waitlisted",
                message=f"Your {booking_type} booking request for {visit_date} is waitlisted at position #{position}.",
                user_id=user_id,
                type="BOOKING",
                priority="NORMAL"
            )

            return {"success": True, "status": "WAITLISTED", "position": position}

        booking = Booking(
            user_id=user_id,
            visit_date=visit_date,
            slot=slot,
            booking_type=booking_type,
            people_count=people_count,
            booking_status="CONFIRMED"
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)

        booking.booking_id = self.generate_booking_id(booking.id)
        db.commit()

        transaction = Transaction(
            booking_id=booking.booking_id,
            user_id=user_id,
            amount=0,
            payment_status="SUCCESS",
            payment_method="FREE"
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        transaction.transaction_id = self.generate_transaction_id(transaction.id)
        db.commit()

        NotificationService.send(
            db=db,
            title="Booking Confirmed",
            message=f"Your {booking_type} slot booking ({booking.booking_id}) for {visit_date} is confirmed.",
            user_id=user_id,
            type="BOOKING",
            priority="NORMAL"
        )

        return {
            "success": True,
            "status": "CONFIRMED",
            "booking_id": booking.booking_id,
            "transaction_id": transaction.transaction_id,
        }

    def update_booking(
        self,
        db,
        booking_id,
        visit_date,
        slot,
        people_count
    ):
        booking = (
            db.query(Booking)
            .filter(Booking.booking_id == booking_id)
            .first()
        )

        if not booking:
            return {
                "success": False,
                "error_code": "BOOKING_NOT_FOUND",
                "message": "Booking not found."
            }

        if booking.booking_status != "CONFIRMED":
            return {
                "success": False,
                "error_code": "INVALID_STATUS",
                "message": f"Only confirmed bookings can be edited. Current status: {booking.booking_status}"
            }
        
        booking_datetime = self._parse_slot_start_time(
            booking.visit_date,
            booking.slot
        )

        lock_time = booking_datetime - timedelta(
            minutes=BOOKING_LOCK_MINUTES
        )

        if datetime.now() >= lock_time:
            return {
                "success": False,
                "error_code": "EDIT_LOCKED",
                "message": f"Booking cannot be edited within {BOOKING_LOCK_MINUTES} minutes before the slot starts."
            }
        
        if people_count < 1:
            return {
                "success": False,
                "error_code": "INVALID_PEOPLE_COUNT",
                "message": "Invalid people count."
            }

        if people_count > MAX_PEOPLE_PER_BOOKING:
            return {
                "success": False,
                "error_code": "MAX_PEOPLE_EXCEEDED",
                "message": f"Maximum {MAX_PEOPLE_PER_BOOKING} devotees are allowed."
            }
        
        existing_booking = (
            db.query(Booking)
            .filter(
                Booking.user_id == booking.user_id,
                Booking.visit_date == visit_date,
                Booking.booking_status == "CONFIRMED",
                Booking.booking_id != booking.booking_id
            )
            .first()
        )

        if existing_booking:
            return {
                "success": False,
                "error_code": "DUPLICATE_BOOKING",
                "message": "You already have another confirmed booking for this date."
            }
        
        today = datetime.now().date()
        future_booking_count = 0

        user_bookings = (
            db.query(Booking)
            .filter(
                Booking.user_id == booking.user_id,
                Booking.booking_status == "CONFIRMED",
                Booking.booking_id != booking.booking_id
            )
            .all()
        )

        for b in user_bookings:
            booking_date = datetime.strptime(
                b.visit_date,
                "%Y-%m-%d"
            ).date()

            if booking_date > today:
                future_booking_count += 1

        new_booking_date = datetime.strptime(
            visit_date,
            "%Y-%m-%d"
        ).date()

        if new_booking_date > today:
            future_booking_count += 1

        if future_booking_count > MAX_FUTURE_BOOKINGS:
            return {
                "success": False,
                "error_code": "FUTURE_BOOKING_LIMIT",
                "message": f"Maximum {MAX_FUTURE_BOOKINGS} future bookings are allowed."
            }

        current_people = (
            db.query(func.sum(Booking.people_count))
            .filter(
                Booking.visit_date == visit_date,
                Booking.slot == slot,
                Booking.booking_status == "CONFIRMED",
                Booking.booking_id != booking.booking_id
            )
            .scalar()
        ) or 0

        if current_people + people_count > SLOT_CAPACITY:
            return {
                "success": False,
                "error_code": "SLOT_FULL",
                "message": "The selected slot is already full."
            }
        
        booking.visit_date = visit_date
        booking.slot = slot
        booking.people_count = people_count
        db.commit()

        NotificationService.send(
            db=db,
            title="Booking Updated",
            message=f"Your booking {booking.booking_id} has been updated successfully.",
            user_id=booking.user_id,
            type="BOOKING",
            priority="NORMAL"
        )

        return {
            "success": True,
            "message": "Booking updated successfully.",
            "booking_id": booking.booking_id
        }
    
    def check_in_booking(
        self,
        db,
        booking_id
    ):
        booking = (
            db.query(Booking)
            .filter(Booking.booking_id == booking_id)
            .first()
        )

        if not booking:
            return {
                "success": False,
                "message": "Booking not found."
            }

        if booking.booking_status == "CANCELLED":
            return {
                "success": False,
                "message": "Booking has been cancelled."
            }

        if booking.booking_status == "EXPIRED":
            return {
                "success": False,
                "message": "Booking has expired."
            }

        if booking.booking_status == "COMPLETED":
            return {
                "success": False,
                "message": "Visit already completed."
            }

        if booking.booking_status == "CHECKED_IN":
            return {
                "success": False,
                "message": "Devotee has already checked in."
            }

        if booking.booking_status != "CONFIRMED":
            return {
                "success": False,
                "message": "Invalid booking status."
            }
        
        slot_start = self._parse_slot_start_time(
            booking.visit_date,
            booking.slot
        )

        slot_end = slot_start

        if "(" in booking.slot:
            time_range = booking.slot.split("(")[1].split(")")[0]
            end_time = time_range.split("-")[1].strip()
        else:
            end_time = booking.slot.split("-")[1].strip()

        slot_end = datetime.strptime(
            f"{booking.visit_date} {end_time}",
            "%Y-%m-%d %I:%M %p"
        )

        current_time = datetime.now()

        if current_time < slot_start:
            return {
                "success": False,
                "message": "Check-in has not started yet."
            }

        if current_time > slot_end:
            return {
                "success": False,
                "message": "Check-in window has ended."
            }

        booking.booking_status = "CHECKED_IN"
        booking.checked_in_at = datetime.now()
        db.commit()

        NotificationService.send(
            db=db,
            title="Temple Check-In Successful",
            message=f"You have successfully checked in for booking {booking.booking_id}. Have a pleasant darshan.",
            user_id=booking.user_id,
            type="BOOKING",
            priority="NORMAL"
        )

        return {
            "success": True,
            "message": "Check-in completed successfully.",
            "booking_id": booking.booking_id,
            "checked_in_at": booking.checked_in_at.isoformat()
        }

    def get_booking_qr(
        self,
        db,
        booking_id
    ):
        booking = (
            db.query(Booking)
            .filter(Booking.booking_id == booking_id)
            .first()
        )

        if not booking:
            return {
                "success": False,
                "message": "Booking not found."
            }

        if booking.booking_status != "CONFIRMED":
            return {
                "success": False,
                "message": "QR is only available for confirmed bookings."
            }

        booking_datetime = self._parse_slot_start_time(
            booking.visit_date,
            booking.slot
        )

        lock_time = booking_datetime - timedelta(
            minutes=BOOKING_LOCK_MINUTES
        )

        if datetime.now() < lock_time:
            remaining = lock_time - datetime.now()
            hours = remaining.seconds // 3600
            minutes = (remaining.seconds % 3600) // 60

            return {
                "success": False,
                "message": f"QR will be available in {hours} hour(s) {minutes} minute(s)."
            }

        qr_image = QRService.generate_qr(
            booking.booking_id
        )

        return StreamingResponse(
            qr_image,
            media_type="image/png"
        )

    def get_booking(self, db, booking_id):
        booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return {"success": False, "message": "Booking not found"}
        
        transaction = db.query(Transaction).filter(Transaction.booking_id == booking.booking_id).first()
        
        current_time = datetime.now()
        booking_datetime = self._parse_slot_start_time(
            booking.visit_date,
            booking.slot
        )
        lock_time = booking_datetime - timedelta(
            minutes=BOOKING_LOCK_MINUTES
        )
        booking_locked = current_time >= lock_time

        return {
            "success": True,
            "booking": {
                "booking_id": booking.booking_id,
                "booking_type": booking.booking_type,
                "visit_date": booking.visit_date,
                "slot": booking.slot,
                "people_count": booking.people_count,
                "status": booking.booking_status,

                "checked_in": booking.booking_status == "CHECKED_IN",
                "checked_in_at": (
                    booking.checked_in_at.isoformat()
                    if booking.checked_in_at
                    else None
                ),

                "can_edit": (
                    booking.booking_status == "CONFIRMED"
                    and not booking_locked
                ),

                "can_cancel": (
                    booking.booking_status == "CONFIRMED"
                    and not booking_locked
                ),

                "qr_available": (
                    booking.booking_status == "CONFIRMED"
                    and booking_locked
                ),

                "can_download_ticket": (
                    booking.booking_status == "CONFIRMED"
                    and booking_locked
                ),

                "qr_endpoint": (
                    f"/booking/{booking.booking_id}/qr"
                    if booking.booking_status == "CONFIRMED"
                    and booking_locked
                    else None
                ),

                "qr_message": (
                    None
                    if booking.booking_status == "CONFIRMED"
                    and booking_locked
                    else f"QR will be available {BOOKING_LOCK_MINUTES} minutes before your slot."
                ),

                "transaction": {
                    "transaction_id": transaction.transaction_id if transaction else None,
                    "amount": transaction.amount if transaction else 0,
                    "payment_status": transaction.payment_status if transaction else None,
                    "payment_method": transaction.payment_method if transaction else None
                }
            }
        }

    def get_user_bookings(self, db, user_id):
        bookings = db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.created_at.desc()).all()
        current_time = datetime.now()
        
        formatted_bookings = []
        for b in bookings:
            booking_datetime = self._parse_slot_start_time(b.visit_date, b.slot)
            lock_time = booking_datetime - timedelta(minutes=BOOKING_LOCK_MINUTES)
            booking_locked = current_time >= lock_time
            
            booking_data = {
                "booking_id": b.booking_id,
                "booking_type": b.booking_type,
                "visit_date": b.visit_date,
                "slot": b.slot,
                "people_count": b.people_count,
                "status": b.booking_status,
                "created_at": b.created_at.isoformat() if b.created_at else None,
                "can_edit": (
                    b.booking_status == "CONFIRMED"
                    and not booking_locked
                ),
                "can_cancel": (
                    b.booking_status == "CONFIRMED"
                    and not booking_locked
                ),
                "qr_available": (
                    b.booking_status == "CONFIRMED"
                    and booking_locked
                ),
                "qr_endpoint": (
                    f"/booking/{b.booking_id}/qr"
                    if b.booking_status == "CONFIRMED" and booking_locked
                    else None
                ),
                "qr_message": (
                    None
                    if b.booking_status == "CONFIRMED" and booking_locked
                    else f"QR will be available {BOOKING_LOCK_MINUTES} minutes before your slot."
                ),
                "can_download_ticket": (
                    b.booking_status == "CONFIRMED"
                    and booking_locked
                )
            }
            formatted_bookings.append(booking_data)

        return {
            "success": True,
            "count": len(bookings),
            "bookings": formatted_bookings
        }

    def cancel_booking(self, db, booking_id):
        booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return {"success": False, "message": "Booking not found"}

        if booking.booking_status in ["COMPLETED", "EXPIRED", "CANCELLED"]:
            return {
                "success": False,
                "message": f"Booking is already {booking.booking_status.lower()}."
            }
        
        booking_datetime = self._parse_slot_start_time(
            booking.visit_date,
            booking.slot
        )

        lock_time = booking_datetime - timedelta(
            minutes=BOOKING_LOCK_MINUTES
        )

        if datetime.now() >= lock_time:
            return {
                "success": False,
                "message": f"Booking cannot be cancelled within {BOOKING_LOCK_MINUTES} minutes before the slot starts."
            }

        booking.booking_status = "CANCELLED"
        db.commit()

        NotificationService.send(
            db=db,
            title="Booking Cancelled",
            message=f"Your booking {booking_id} has been successfully cancelled.",
            user_id=booking.user_id,
            type="BOOKING",
            priority="NORMAL"
        )

        waitlist_user = (
            db.query(WaitingList)
            .filter(WaitingList.visit_date == booking.visit_date, WaitingList.slot == booking.slot)
            .order_by(WaitingList.position)
            .first()
        )

        promotion_message = None
        if waitlist_user:
            promoted_booking = Booking(
                user_id=waitlist_user.user_id,
                visit_date=waitlist_user.visit_date,
                slot=waitlist_user.slot,
                booking_type=waitlist_user.booking_type,
                people_count=waitlist_user.people_count,
                booking_status="CONFIRMED"
            )
            db.add(promoted_booking)
            db.commit()
            db.refresh(promoted_booking)

            promoted_booking.booking_id = self.generate_booking_id(promoted_booking.id)
            db.commit()

            transaction = Transaction(
                booking_id=promoted_booking.booking_id,
                user_id=waitlist_user.user_id,
                amount=0,
                payment_status="SUCCESS",
                payment_method="FREE"
            )
            db.add(transaction)
            db.commit()
            db.refresh(transaction)

            transaction.transaction_id = self.generate_transaction_id(transaction.id)
            db.commit()

            db.delete(waitlist_user)
            db.commit()

            NotificationService.send(
                db=db,
                title="Waitlist Ticket Promoted!",
                message=f"Good news! Your waitlisted position has been upgraded. Your confirmed booking ID is {promoted_booking.booking_id}.",
                user_id=waitlist_user.user_id,
                type="BOOKING",
                priority="HIGH"
            )

            promotion_message = f"Waitlist User Promoted: {promoted_booking.booking_id}"

        return {
            "success": True,
            "message": "Booking cancelled successfully",
            "promotion": promotion_message
        }

    def get_available_slots(self, db, visit_date, booking_type):
        slots = DARSHAN_SLOTS if booking_type == "DARSHAN" else AARTI_SLOTS
        result = []
        now = datetime.now()

        for slot in slots:
            booked = (
                db.query(func.sum(Booking.people_count))
                .filter(
                    Booking.visit_date == visit_date,
                    Booking.slot == slot,
                    Booking.booking_status == "CONFIRMED"
                )
                .scalar()
            ) or 0

            remaining = max(0, SLOT_CAPACITY - booked)

            if booked < (SLOT_CAPACITY * 0.20):
                crowd_level = "LOW"
            elif booked < (SLOT_CAPACITY * 0.50):
                crowd_level = "MODERATE"
            elif booked < (SLOT_CAPACITY * 0.80):
                crowd_level = "BUSY"
            else:
                crowd_level = "HEAVY"

            try:
                slot_start = self._parse_slot_start_time(visit_date, slot)
                slot_end = self._parse_slot_end_time(visit_date, slot)
                booking_close_time = slot_start - timedelta(minutes=BOOKING_LOCK_MINUTES)
            except ValueError:
                slot_start = now + timedelta(hours=1)
                slot_end = now + timedelta(hours=2)
                booking_close_time = slot_start - timedelta(minutes=BOOKING_LOCK_MINUTES)

            if remaining <= 0:
                status = "FULL"
                can_book = False
            elif now >= slot_end:
                status = "EXPIRED"
                can_book = False
            elif now >= slot_start:
                status = "STARTED"
                can_book = False
            elif now >= booking_close_time:
                status = "BOOKING_CLOSED"
                can_book = False
            else:
                status = "AVAILABLE"
                can_book = True

            result.append({
                "slot": slot,
                "booked": booked,
                "remaining_capacity": remaining,
                "total_capacity": SLOT_CAPACITY,
                "available": can_book,
                "crowd_level": crowd_level,
                "status": status,
                "booking_lock_minutes": BOOKING_LOCK_MINUTES
            })

        return {
            "success": True,
            "visit_date": visit_date,
            "booking_type": booking_type,
            "slots": result
        }

booking_controller = BookingController()