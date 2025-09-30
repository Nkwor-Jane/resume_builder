from database import ResumeDAL
from fastapi import UploadFile
import os
import base64

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_resume_with_file(dal: ResumeDAL, resume_data: dict, file: UploadFile = None):
    if file:
        content = await file.read()
        encoded = base64.b64encode(content).decode("utf-8")

        resume_data["file_name"] = file.filename
        resume_data["file_content"] = encoded
    else:
        resume_data["file_name"] = None
        resume_data["file_content"] = None

    result = await dal.save_resume_with_file(resume_data)
    return result
