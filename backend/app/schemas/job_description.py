"""Pydantic schemas for job description processing and retrieval."""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class JobDescriptionCreateRequest(BaseModel):
    """Payload to submit and process a target job description."""

    title: str = Field(
        ...,
        min_length=2,
        max_length=255,
        description="Target job title (e.g. Senior Backend Engineer)",
        examples=["Senior Full Stack Engineer"],
    )
    company_name: str | None = Field(
        None,
        max_length=255,
        description="Optional hiring company or team name",
        examples=["Stripe"],
    )
    description_text: str = Field(
        ...,
        min_length=30,
        max_length=50000,
        description="Full text of the target job posting / role description",
    )


class JobDescriptionResponse(BaseModel):
    """Response schema for processed job description."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    company_name: str | None = None
    description_text: str
    word_count: int
    created_at: datetime
    updated_at: datetime
