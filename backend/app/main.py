"""InterviewOS FastAPI Application Entrypoint."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import engine
from app.core.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup and graceful shutdown."""
    logger.info(f"Starting {settings.PROJECT_NAME} in '{settings.ENVIRONMENT}' mode.")
    yield
    if engine is not None:
        logger.info("Disposing SQLAlchemy async engine connection pool...")
        await engine.dispose()
    logger.info("Application shutdown complete.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API powering the InterviewOS mock interview platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Centralized exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all unhandled exception handler providing consistent structured errors."""
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "service": settings.SERVICE_NAME,
            "error_type": "InternalServerError",
            "message": "An unexpected internal server error occurred.",
        },
    )


# Include API routers
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
async def root_redirect() -> dict[str, str]:
    """Root redirect / information endpoint."""
    return {
        "service": settings.SERVICE_NAME,
        "docs": "/docs",
        "api": settings.API_V1_STR,
    }
