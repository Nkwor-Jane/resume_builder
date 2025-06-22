from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from resume import resume

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
def root():
    return {"message": "Resume Builder API is live!"}
