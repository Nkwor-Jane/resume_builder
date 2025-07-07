# # app/database.py
# from motor.motor_asyncio import AsyncIOMotorClient
# from pymongo import ASCENDING
# from dotenv import load_dotenv
# import os

# load_dotenv()

# COLLECTION_NAME = "resumes"
# MONGO_URI = os.getenv["MONGO_URI"]
# client = AsyncIOMotorClient(MONGO_URI)
# db = client.resume_builder

# dal/resume_dal.py
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from models import Resume, ResumeCreate, ResumeUpdate
from pymongo import ReturnDocument
from fastapi import UploadFile
from typing import Optional, List

class ResumeDAL:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_resume(self, data: ResumeCreate):
        result = await self.collection.insert_one(data.dict())
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return Resume.from_doc(doc)

    async def get_resume(self, resume_id: str):
        try:
            _id = ObjectId(resume_id)
        except:
            return None
        doc = await self.collection.find_one({"_id": _id})
        return Resume.from_doc(doc) if doc else None

    async def update_resume(self, resume_id: str, data: ResumeUpdate):
        try:
            _id = ObjectId(resume_id)
        except:
            return None
        result = await self.collection.find_one_and_update(
            {"_id": _id},
            {"$set": data.dict(exclude_none=True)},
            return_document=ReturnDocument.AFTER
        )
        return Resume.from_doc(result) if result else None

    async def delete_resume(self, resume_id: str):
        try:
            _id = ObjectId(resume_id)
        except:
            return False
        result = await self.collection.delete_one({"_id": _id})
        return result.deleted_count == 1

# async def save_resume_file_metadata(self, filename: str, path: str):
#     doc = {"filename": filename, "file_path": path}
#     result = await self.collection.insert_one(doc)
#     return str(result.inserted_id)

    async def save_resume_with_file(self, data: dict, file: UploadFile):
        # Save file to disk or DB as needed
        content = await file.read()
        filename = file.filename

        # Add file metadata or content to resume document
        data["uploaded_file_name"] = filename
        data["uploaded_file_content"] = content.decode(errors="ignore")  # or save as binary

        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return str(doc["_id"])
