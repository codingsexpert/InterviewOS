"""Resume upload, validation, and retrieval endpoints."""

import uuid
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.resume import Resume
from app.schemas.resume import ResumeDetailResponse, ResumeUploadResponse
from app.services.pdf_service import process_and_store_pdf

router = APIRouter()


def check_dev_mode_guard(request: Request) -> None:
    """Security guard enforcing development-only unauthenticated access.
    
    In production environments, unauthenticated document upload is strictly blocked
    until Phase 02 Google OAuth / User Management is integrated.
    """
    if settings.ENVIRONMENT.lower() == "production":
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthenticated document processing is disabled in production environments. Phase 02 user authorization required.",
            )


@router.post(
    "",
    response_model=ResumeUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and process PDF resume",
    description="Upload a real PDF resume, validate format and magic bytes, extract digital text, and store in database.",
)
async def upload_resume(
    request: Request,
    file: UploadFile = File(..., description="PDF resume file to upload and parse"),
    db: AsyncSession = Depends(get_db),
) -> ResumeUploadResponse:
    """Upload, parse, and persist candidate resume."""
    check_dev_mode_guard(request)

    # Validate and extract text
    extraction_result = await process_and_store_pdf(file)

    # Persist in PostgreSQL
    resume = Resume(
        original_filename=extraction_result.original_filename,
        storage_reference=extraction_result.storage_reference,
        extracted_text=extraction_result.extracted_text,
        processing_status=extraction_result.processing_status,
        file_size=extraction_result.file_size,
        page_count=extraction_result.page_count,
        word_count=extraction_result.word_count,
        user_id=None,  # Safe development workflow; user ownership linked in Phase 02
    )

    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    preview = (resume.extracted_text[:300] + "...") if resume.extracted_text and len(resume.extracted_text) > 300 else (resume.extracted_text or "")

    return ResumeUploadResponse(
        id=resume.id,
        original_filename=resume.original_filename,
        file_size=resume.file_size,
        page_count=resume.page_count or 0,
        word_count=resume.word_count or 0,
        processing_status=resume.processing_status,
        extracted_text_preview=preview,
        extracted_text=resume.extracted_text,
        warning_message=extraction_result.warning_message,
        created_at=resume.created_at,
    )


@router.get(
    "/{resume_id}",
    response_model=ResumeDetailResponse,
    summary="Retrieve processed resume by ID",
    description="Retrieve stored resume metadata and full extracted text by UUID.",
)
async def get_resume_by_id(
    resume_id: uuid.UUID,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ResumeDetailResponse:
    """Retrieve processed resume record by its unique ID."""
    check_dev_mode_guard(request)

    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resume with ID '{resume_id}' not found.",
        )

    return ResumeDetailResponse(
        id=resume.id,
        original_filename=resume.original_filename,
        file_size=resume.file_size,
        page_count=resume.page_count or 0,
        word_count=resume.word_count or 0,
        processing_status=resume.processing_status,
        extracted_text=resume.extracted_text,
        created_at=resume.created_at,
        updated_at=resume.updated_at,
    )
