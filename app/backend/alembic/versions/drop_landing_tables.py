"""drop landing tables

Revision ID: e1a2b3c4d5e6
Revises: d34c8912abc5
Create Date: 2026-05-23 01:26:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'd34c8912abc5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop orphaned landing tables."""
    op.drop_table('landing_products')
    op.drop_table('landing_catalogues')
    op.drop_table('landing_pages')


def downgrade() -> None:
    """Recreate landing tables."""
    op.create_table('landing_pages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('slug', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug')
    )
    
    op.create_table('landing_catalogues',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('landing_page_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['landing_page_id'], ['landing_pages.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('landing_products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('landing_catalogue_id', sa.Integer(), nullable=True),
        sa.Column('product_id', sa.Integer(), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['landing_catalogue_id'], ['landing_catalogues.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )