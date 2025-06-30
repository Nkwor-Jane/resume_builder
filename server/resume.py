from fastapi import FastAPI, APIRouter, HTTPException, Request
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from models import Resume
from resume_service import save_resume
from motor.motor_asyncio import AsyncIOMotorClient
from database import ResumeDAL

load_dotenv()

COLLECTION_NAME= "resume"
MONGODB_URI= os.environ["MONGODB_URI"]
DEBUG= os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "on", "yes" }

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(MONGODB_URI)
    database = client.get_default_database()

    pong = await database.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")
    
    resume = database.get_collection(COLLECTION_NAME)
    app.resume_dal = ResumeDAL(resume)

    yield
    client.close()
router = APIRouter()

@router.post("/resume")
async def create_resume(resume: Resume, request: Request):
    try:
        resume_id = await request.app.resume_dal.create_resume(resume)
        return {"id": resume_id, "message": "Resume saved successfully"}
    except Exception as e:
        # Log the error (print or use logging)
        print(f"Error saving resume: {e}")
        raise HTTPException(status_code=500, detail="Failed to save resume")