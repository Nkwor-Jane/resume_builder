# app/services/resume_service.py
from database import ResumeDAL

async def save_resume(data: dict):
    result = await ResumeDAL.resumes.insert_one(data)
    return str(result.inserted_id)