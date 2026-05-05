import logging

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/migration", tags=["migration"])


@router.post("/fix-site-content-content-key")
async def fix_site_content_content_key(
    db: AsyncSession = Depends(get_db),
):
    """One-time migration: add content_key column if missing, populate defaults, make NOT NULL"""
    try:
        # Step 1: Add column as nullable if it doesn't exist
        await db.execute(text(
            "ALTER TABLE site_content ADD COLUMN IF NOT EXISTS content_key VARCHAR DEFAULT 'default'"
        ))
        await db.commit()
        logger.info("Migration step 1: added content_key column (nullable with default)")

        # Step 2: Set content_key='default' for all rows where it is NULL
        result = await db.execute(
            text("UPDATE site_content SET content_key = 'default' WHERE content_key IS NULL")
        )
        await db.commit()
        rows_updated = result.rowcount
        logger.info(f"Migration step 2: updated {rows_updated} rows with content_key='default'")

        # Step 3: Alter column to be NOT NULL
        await db.execute(text(
            "ALTER TABLE site_content ALTER COLUMN content_key SET NOT NULL"
        ))
        await db.commit()
        logger.info("Migration step 3: set content_key as NOT NULL")

        return {"status": "success", "rows_updated": rows_updated, "message": "content_key column added and populated"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Migration error: {str(e)}", exc_info=True)
        return {"status": "error", "detail": str(e)}