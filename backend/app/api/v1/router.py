"""API v1 master router aggregating domain endpoints."""

from fastapi import APIRouter
from app.api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health & Diagnostics"])
