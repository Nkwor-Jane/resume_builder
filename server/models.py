from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from bson import ObjectId

# To handle Mongo _id
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# === Nested Structures ===
class Education(BaseModel):
    degree: str
    school: str
    startYear: str
    endYear: str

class Experience(BaseModel):
    title: str
    company: str
    startDate: str
    endDate: str
    responsibilities: str

class Volunteer(BaseModel):
    vTitle: str
    vCompany: str
    vStartDate: str
    vEndDate: str
    vResponsibilities: str

class Certification(BaseModel):
    credential: str
    organization: str
    yearGotten: str

# === Main Resume Models ===
class ResumeBase(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    linkedInURL: str
    portfolioURL: str
    summary: str
    skills: str
    education: List[Education]
    experience: List[Experience]
    volunteer: List[Volunteer]
    certifications: List[Certification]
    file_path: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    fullName: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    linkedInURL: Optional[str]
    portfolioURL: Optional[str]
    summary: Optional[str]
    skills: Optional[str]
    education: Optional[List[Education]]
    experience: Optional[List[Experience]]
    volunteer: Optional[List[Volunteer]]
    certifications: Optional[List[Certification]]

class Resume(ResumeBase):
    id: str = Field(default_factory=lambda: str(PyObjectId()), alias="_id")

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

    @classmethod
    def from_doc(cls, doc):
        if not doc:
            return None
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        return cls(**doc)