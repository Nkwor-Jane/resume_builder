
from fastapi import FastAPI, APIRouter, Form, UploadFile, File, HTTPException, Request
from resume_service import save_resume_with_file
import json
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from database import ResumeDAL
import json
import base64

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
    file: UploadFile = File(None)
):
    print(f"Received file: {file.filename if file else 'No file'}")

    try:
        resume_data = json.loads(resume)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid resume JSON")

    if file:
        content = await file.read()
        print(f"File content size: {len(content)} bytes")
        encoded = base64.b64encode(content).decode("utf-8")
        resume_data["file_name"] = file.filename
        resume_data["file_content"] = encoded
        print("resume_data keys:", resume_data.keys())
        print("file_content length:", len(resume_data.get("file_content", "")))
    else:
        resume_data["file_name"] = None
        resume_data["file_content"] = None  

    dal = request.app.resume_dal
    resume_id = await dal.save_resume_with_file(resume_data)
    return {"id": resume_id, "message": "Resume saved successfully"}
