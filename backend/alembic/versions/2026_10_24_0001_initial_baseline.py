"""Initial database baseline migration.

Revision ID: 0001_initial_baseline
Revises: 
Create Date: 2026-10-24 07:40:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0001_initial_baseline"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Ensure pgcrypto extension is available for UUID generation in future tables
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')


def downgrade() -> None:
    pass
