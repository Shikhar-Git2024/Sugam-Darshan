from datetime import datetime


def get_slot_end_datetime(visit_date: str, slot: str):
    """
    Returns the datetime when a slot ends.

    Example:
    visit_date = "2026-10-25"
    slot = "07:00 AM - 09:00 AM"

    Returns:
    datetime(2026,10,25,9,0)
    """

    # Handle Darshan slots
    if "-" in slot:
        end_time = slot.split("-")[1].strip()

    # Handle Aarti slots
    elif "(" in slot and ")" in slot:
        time_part = slot.split("(")[1].split(")")[0]
        end_time = time_part.split("-")[1].strip()

    else:
        raise ValueError(f"Unknown slot format: {slot}")

    date_time = f"{visit_date} {end_time}"

    return datetime.strptime(
        date_time,
        "%Y-%m-%d %I:%M %p"
    )