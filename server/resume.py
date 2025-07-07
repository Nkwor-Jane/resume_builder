
from fastapi import FastAPI, APIRouter, Form, UploadFile, File, HTTPException, Request
from resume_service import save_resume_with_file
import json
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from database import ResumeDAL
import json
from resume_service import save_resume_with_file

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
async def create_resume(
    request: Request,
    resume: str = Form(...),
    file: UploadFile = File(None)  # optional
):
    try:
        resume_data = json.loads(resume)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid resume JSON")

    # You can store or process `file` here if needed
    dal = request.app.resume_dal
    resume_id = await save_resume_with_file(dal, resume_data, file)
    return {"id": resume_id, "message": "Resume saved successfully"}
