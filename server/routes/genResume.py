from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from service.langchain_service import enhance_summary

router = APIRouter()

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(resume: dict):
    try:
        result = await analyze_resume_with_langchain(resume)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))