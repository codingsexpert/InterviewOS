"""Job description processing and retrieval endpoints."""

import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.job_description import JobDescription
from app.schemas.job_description import JobDescriptionCreateRequest, JobDescriptionResponse
from app.services.job_description_service import validate_and_normalize_job_description

router = APIRouter()


def check_dev_mode_guard(request: Request) -> None:
    """Security guard enforcing development-only unauthenticated access."""
    if settings.ENVIRONMENT.lower() == "production":
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthenticated document processing is disabled in production environments. Phase 02 user authorization required.",
            )


@router.post(
    "",
    response_model=JobDescriptionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Process and store job description",
    description="Validate, normalize, and store a target role job description for AI interview preparation.",
)
async def create_job_description(
    payload: JobDescriptionCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> JobDescriptionResponse:
    """Validate, clean, and persist target job description."""
    check_dev_mode_guard(request)

    normalized = validate_and_normalize_job_description(
        title=payload.title,
        company_name=payload.company_name,
        description_text=payload.description_text,
    )

    job_desc = JobDescription(
        title=normalized.title,
        company_name=normalized.company_name,
        description_text=normalized.description_text,
        word_count=normalized.word_count,
        user_id=None,  # User ownership linked in Phase 02
    )

    db.add(job_desc)
    await db.commit()
    await db.refresh(job_desc)

    return JobDescriptionResponse(
        id=job_desc.id,
        title=job_desc.title,
        company_name=job_desc.company_name,
        description_text=job_desc.description_text,
        word_count=job_desc.word_count or 0,
        created_at=job_desc.created_at,
        updated_at=job_desc.updated_at,
    )


@router.get(
    "/{job_description_id}",
    response_model=JobDescriptionResponse,
    summary="Retrieve processed job description by ID",
    description="Retrieve stored job description details by UUID.",
)
async def get_job_description_by_id(
    job_description_id: uuid.UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> JobDescriptionResponse:
    """Retrieve processed job description record by UUID."""
    check_dev_mode_guard(request)

    result = await db.execute(select(JobDescription).where(JobDescription.id == job_description_id))
    job_desc = result.scalar_one_or_none()

    if not job_desc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job description with ID '{job_description_id}' not found.",
        )

    return JobDescriptionResponse(
        id=job_desc.id,
        title=job_desc.title,
        company_name=job_desc.company_name,
        description_text=job_desc.description_text,
        word_count=job_desc.word_count or 0,
        created_at=job_desc.created_at,
        updated_at=job_desc.updated_at,
    )
