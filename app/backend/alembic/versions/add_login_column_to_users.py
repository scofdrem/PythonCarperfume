"""add login column to users

Revision ID: b1c2d3e4f5a6
Revises: 467980df475b
Create Date: 2026-05-14 00:48:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, Sequence[str], None] = '467980df475b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add login column to users table."""
    op.add_column('users', sa.Column('login', sa.String(255), nullable=True))


def downgrade() -> None:
    """Remove login column from users table."""
    op.drop_column('users', 'login')