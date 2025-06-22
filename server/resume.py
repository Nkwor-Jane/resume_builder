from fastapi import APIRouter, HTTPException
from models import Resume
from resume_service import save_resume

router = APIRouter()

@router.post("/resume")
async def create_resume(resume: Resume):
    resume_id = await save_resume(resume.dict())
    return {"id": resume_id, "message": "Resume saved successfully"}