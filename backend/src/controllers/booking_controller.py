from models.booking_model import Booking
from models.waiting_list_model import WaitingList
from sqlalchemy import func
from models.transaction_model import Transaction
from utils.temple_slots import (
    DARSHAN_SLOTS,
    AARTI_SLOTS
)

class BookingController:

    SLOT_CAPACITY = 5000

    def generate_booking_id(self, booking_db_id):
        return f"SD2026{booking_db_id:06d}"

    def generate_transaction_id(self, transaction_db_id):
        return f"TXN2026{transaction_db_id:06d}"

    def create_booking(self, db, user_id, visit_date, slot, booking_type, people_count):
        if people_count < 1:
            return {
                "success": False,
                "message": "Invalid people count"
            }

        if people_count > 10:
            return {
                "success": False,
                "message": "Maximum 10 devotees allowed"
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

        if current_people + people_count > self.SLOT_CAPACITY:
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

        return {
            "success": True,
            "status": "CONFIRMED",
            "booking_id": booking.booking_id,
            "transaction_id": transaction.transaction_id,
        }

    def get_booking(self, db, booking_id):
        booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return {"success": False, "message": "Booking not found"}
        
        transaction = db.query(Transaction).filter(Transaction.booking_id == booking.booking_id).first()
        
        return {
            "success": True,
            "booking": {
                "booking_id": booking.booking_id,
                "booking_type": booking.booking_type,
                "visit_date": booking.visit_date,
                "slot": booking.slot,
                "people_count": booking.people_count,
                "status": booking.booking_status,
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
        return {
            "success": True,
            "count": len(bookings),
            "bookings": [
                {
                    "booking_id": b.booking_id,
                    "booking_type": b.booking_type,
                    "visit_date": b.visit_date,
                    "slot": b.slot,
                    "people_count": b.people_count,
                    "status": b.booking_status,
                    "created_at": b.created_at.isoformat() if b.created_at else None
                }
                for b in bookings
            ]
        }

    def cancel_booking(self, db, booking_id):
        booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            return {"success": False, "message": "Booking not found"}

        booking.booking_status = "CANCELLED"
        db.commit()

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

            promotion_message = f"Waitlist User Promoted: {promoted_booking.booking_id}"

        return {
            "success": True,
            "message": "Booking cancelled successfully",
            "promotion": promotion_message
        }

    def get_available_slots(
        self,
        db,
        visit_date,
        booking_type
    ):

        slots = (
            DARSHAN_SLOTS
            if booking_type == "DARSHAN"
            else AARTI_SLOTS
        )

        result = []

        for slot in slots:

            booked = (
                db.query(
                    func.sum(
                        Booking.people_count
                    )
                )
                .filter(
                    Booking.visit_date == visit_date,
                    Booking.slot == slot,
                    Booking.booking_status == "CONFIRMED"
                )
                .scalar()
            ) or 0

            remaining = (
                self.SLOT_CAPACITY - booked
            )

            if booked < 1000:
                crowd_level = "LOW"

            elif booked < 2500:
                crowd_level = "MODERATE"

            elif booked < 4000:
                crowd_level = "BUSY"

            else:
                crowd_level = "HEAVY"

            result.append({
                "slot": slot,
                "booked": booked,
                "remaining_capacity": remaining,
                "available": remaining > 0,
                "crowd_level": crowd_level
            })

        return {
            "success": True,
            "visit_date": visit_date,
            "booking_type": booking_type,
            "slots": result
        }

booking_controller = BookingController()