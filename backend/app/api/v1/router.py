from fastapi import APIRouter
from app.api.v1.endpoints import auth, health, job_descriptions, resumes, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health & Diagnostics"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(job_descriptions.router, prefix="/job-descriptions", tags=["Job Descriptions"])
