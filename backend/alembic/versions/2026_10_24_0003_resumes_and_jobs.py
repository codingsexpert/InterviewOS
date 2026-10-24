"""Create resumes and job descriptions tables for Phase 03.

Revision ID: 0003_create_resumes_and_job_descriptions
Revises: 0002_create_users_table
Create Date: 2026-10-24 14:55:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0003_resumes_and_jobs"
down_revision: Union[str, None] = "0002_create_users_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create resumes table
    op.create_table(
        "resumes",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("storage_reference", sa.String(length=512), nullable=False),
        sa.Column("extracted_text", sa.Text(), nullable=True),
        sa.Column(
            "processing_status",
            sa.String(length=50),
            server_default="completed",
            nullable=False,
        ),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("page_count", sa.Integer(), server_default="0", nullable=True),
        sa.Column("word_count", sa.Integer(), server_default="0", nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_resumes_processing_status", "resumes", ["processing_status"])
    op.create_index("ix_resumes_user_id", "resumes", ["user_id"])

    # 2. Create job_descriptions table
    op.create_table(
        "job_descriptions",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("description_text", sa.Text(), nullable=False),
        sa.Column("word_count", sa.Integer(), server_default="0", nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_job_descriptions_title", "job_descriptions", ["title"])
    op.create_index("ix_job_descriptions_user_id", "job_descriptions", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_job_descriptions_user_id", table_name="job_descriptions")
    op.drop_index("ix_job_descriptions_title", table_name="job_descriptions")
    op.drop_table("job_descriptions")

    op.drop_index("ix_resumes_user_id", table_name="resumes")
    op.drop_index("ix_resumes_processing_status", table_name="resumes")
    op.drop_table("resumes")
