"""SQLAlchemy declarative base and common model mixins."""

from datetime import datetime, timezone
from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy declarative models."""

    @declared_attr.directive
    def __tablename__(cls) -> str:
        """Derive default table name from lowercase class name."""
        return cls.__name__.lower() + "s"


class TimestampMixin:
    """Reusable mixin providing created_at and updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
