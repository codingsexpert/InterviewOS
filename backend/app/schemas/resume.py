"""Pydantic schemas for resume upload and retrieval."""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ResumeUploadResponse(BaseModel):
    """Response schema returned after uploading and processing a PDF resume."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    original_filename: str
    file_size: int
    page_count: int
    word_count: int
    processing_status: str = Field(
        ...,
        description="'completed' for parsed documents, 'scanned_no_text' for image-only PDFs, or 'failed'",
    )
    extracted_text_preview: str = Field(
        ...,
        description="First 300 characters of extracted text for immediate preview",
    )
    extracted_text: str | None = Field(
        None,
        description="Full text extracted from PDF (available for immediate inspection)",
    )
    warning_message: str | None = Field(
        None,
        description="Warning notice if document is scanned or partially unreadable",
    )
    created_at: datetime


class ResumeDetailResponse(BaseModel):
    """Detailed response schema when retrieving a stored resume by ID."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    original_filename: str
    file_size: int
    page_count: int
    word_count: int
    processing_status: str
    extracted_text: str | None
    created_at: datetime
    updated_at: datetime
