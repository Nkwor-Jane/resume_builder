# app/services/resume_service.py
from database import db

async def save_resume(data: dict):
    result = await db.resumes.insert_one(data)
    return str(result.inserted_id)