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

    async def save_resume_with_file(self, data: dict):
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return str(doc["_id"])
