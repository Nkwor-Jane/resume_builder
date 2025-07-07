from database import ResumeDAL
from fastapi import UploadFile
import shutil
import os
from uuid import uuid4

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_resume_with_file(dal: ResumeDAL, resume_data: dict, file: UploadFile):
    try:
        if file is not None:
            filename = f"{uuid4()}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)

            # Save file to disk
            with open(file_path, "wb") as f:
                shutil.copyfileobj(file.file, f)

            # Add file_path to resume data
            resume_data["file_path"] = file_path
        else:
            resume_data["file_path"] = None

        result = await dal.create_resume_with_file(resume_data)
        return result
    except Exception as e:
        raise Exception(f"Failed to save resume and file: {e}")


# async def save_resume(data: dict):
#     result = await ResumeDAL.resumes.insert_one(data)
#     return str(result.inserted_id)