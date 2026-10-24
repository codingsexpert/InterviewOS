"""Job Description SQLAlchemy model for target interview roles."""

import uuid
from sqlalchemy import Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class JobDescription(Base, TimestampMixin):
    """Target job description providing role context for interview planning."""

    __tablename__ = "job_descriptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    company_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    description_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
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
        return f"<JobDescription id={self.id} title={self.title} company={self.company_name}>"
