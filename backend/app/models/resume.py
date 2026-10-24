"""Resume SQLAlchemy model for uploaded candidate resumes and extraction metadata."""

import uuid
from sqlalchemy import Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class Resume(Base, TimestampMixin):
    """Uploaded candidate resume with storage reference and extracted text."""

    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    storage_reference: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    processing_status: Mapped[str] = mapped_column(
        String(50),
        default="completed",
        nullable=False,
        index=True,
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    page_count: Mapped[int | None] = mapped_column(
        Integer,
        default=0,
        nullable=True,
    )
    word_count: Mapped[int | None] = mapped_column(
        Integer,
        default=0,
        nullable=True,
    )
    # user_id is ready for Phase 02 Google OAuth user ownership linking
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        nullable=True,
        index=True,
    )

    def __repr__(self) -> str:
        return f"<Resume id={self.id} filename={self.original_filename} status={self.processing_status}>"
