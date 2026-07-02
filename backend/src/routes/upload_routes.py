import os
import uuid

from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_FOLDER = "uploads/missing_persons"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@router.post("/image")
async def upload_image(
    image: UploadFile = File(...)
):

    extension = image.filename.split(".")[-1]

    filename = (
        f"{uuid.uuid4()}.{extension}"
    )

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(
        filepath,
        "wb"
    ) as buffer:

        buffer.write(
            await image.read()
        )

    return {

        "success": True,

        "image_path": filepath.replace(
            "\\",
            "/"
        )

    }