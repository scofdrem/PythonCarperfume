"""update products schema

Revision ID: d34c8912abc5
Revises: 467980df475b
Create Date: 2026-05-21 23:31:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd34c8912abc5'
down_revision: Union[str, Sequence[str], None] = '467980df475b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add new columns
    op.add_column('products', sa.Column('price', sa.Float(), nullable=False, server_default='0.0'))
    op.add_column('products', sa.Column('refillable', sa.Boolean(), nullable=True, server_default='false'))
    
    # Drop old columns (SQLite requires recreating table, using batch mode)
    with op.batch_alter_table('products') as batch_op:
        batch_op.drop_column('gender')
        batch_op.drop_column('age_range')


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table('products') as batch_op:
        batch_op.add_column(sa.Column('gender', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('age_range', sa.VARCHAR(), nullable=True))
    
    op.drop_column('products', 'price')
    op.drop_column('products', 'refillable')