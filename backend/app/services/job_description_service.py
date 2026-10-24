"""Job description validation, normalization, and processing service."""

import re
from dataclasses import dataclass
from fastapi import HTTPException, status


@dataclass
class NormalizedJobDescription:
    """Normalized job description payload ready for persistence."""

    title: str
    company_name: str | None
    description_text: str
    word_count: int


def normalize_job_description_text(raw_text: str) -> str:
    """Normalize raw job description text by removing excessive whitespace and trailing characters."""
    if not raw_text:
        return ""
    # Normalize newline breaks
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    # Replace tabs and multiple horizontal spaces with single space
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse multiple consecutive empty lines to maximum 2 (preserving paragraphs)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def validate_and_normalize_job_description(
    title: str,
    company_name: str | None,
    description_text: str,
) -> NormalizedJobDescription:
    """Validate incoming job description parameters and return normalized values.
    
    Validates:
      - Title is non-empty and between 2 and 255 characters
      - Description text has meaningful content (minimum 30 characters after stripping)
      - Enforces maximum length bounds (50,000 characters)
      - Computes accurate word counts
    """
    clean_title = title.strip()
    if len(clean_title) < 2 or len(clean_title) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job title must be between 2 and 255 characters.",
        )

    clean_company = company_name.strip() if company_name else None
    if clean_company and len(clean_company) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company name must not exceed 255 characters.",
        )

    clean_description = normalize_job_description_text(description_text)
    if len(clean_description) < 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description must contain at least 30 characters of meaningful text.",
        )

    if len(clean_description) > 50000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description exceeds maximum allowed length of 50,000 characters.",
        )

    word_count = len(clean_description.split())

    return NormalizedJobDescription(
        title=clean_title,
        company_name=clean_company,
        description_text=clean_description,
        word_count=word_count,
    )
