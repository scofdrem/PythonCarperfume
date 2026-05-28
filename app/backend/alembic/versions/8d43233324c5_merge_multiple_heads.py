"""merge multiple heads

Revision ID: 8d43233324c5
Revises: 57c60ab029ca, b1c2d3e4f5a6, e1a2b3c4d5e6
Create Date: 2026-05-28 10:40:02.047430

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8d43233324c5'
down_revision: Union[str, Sequence[str], None] = ('57c60ab029ca', 'b1c2d3e4f5a6', 'e1a2b3c4d5e6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass