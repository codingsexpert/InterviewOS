"""Health diagnostic endpoints."""

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.core.config import settings
from app.core.database import check_db_connectivity

router = APIRouter()


class HealthResponse(BaseModel):
    """General service health status schema."""
    status: str
    service: str


class DatabaseHealthResponse(BaseModel):
    """Database connectivity diagnostic schema."""
    status: str
    service: str
    database: str
    message: str


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Returns basic liveness status for the InterviewOS API service.",
)
async def health_check() -> HealthResponse:
    """Basic service health check."""
    return HealthResponse(
        status="ok",
        service=settings.SERVICE_NAME,
    )


@router.get(
    "/health/db",
    response_model=DatabaseHealthResponse,
    responses={
        status.HTTP_200_OK: {"description": "Database connection verified and healthy."},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Database is unreachable or unconfigured."},
    },
    summary="Database Connectivity Check",
    description="Executes a live query diagnostic (SELECT 1) against the configured PostgreSQL database.",
)
async def database_health_check() -> JSONResponse:
    """Live database connectivity diagnostic."""
    is_healthy, message = await check_db_connectivity()

    if is_healthy:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "ok",
                "service": settings.SERVICE_NAME,
                "database": "connected",
                "message": message,
            },
        )

    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "status": "error",
            "service": settings.SERVICE_NAME,
            "database": "unreachable",
            "message": message,
        },
    )
