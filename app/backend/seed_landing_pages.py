import asyncio
import logging
import os
import sys
from pathlib import Path

# Ensure backend is on path
backend_dir = Path(__file__).parent.resolve()
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
from core.database import Base, db_manager
from models.landing_page import LandingPage
from models.landing_catalogue import LandingCatalogue
from models.landing_product import LandingProduct
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


LANDING_PAGES = [
    {
        "name": "Landing Page 1",
        "slug": "landing-1",
        "domain": "landing1.local",
        "hero_title": "Discover Premium Aromas",
        "hero_subtitle": "Curated collection for the refined palate",
        "seo_title": "Premium Aromas — Landing Page 1",
        "seo_description": "Explore our exclusive premium aroma collection on Landing Page 1.",
        "is_active": True,
    },
    {
        "name": "Landing Page 2",
        "slug": "landing-2",
        "domain": "landing2.local",
        "hero_title": "Elite Fragrance Selection",
        "hero_subtitle": "Handpicked scents for every occasion",
        "seo_title": "Elite Fragrances — Landing Page 2",
        "seo_description": "Browse our elite fragrance selection on Landing Page 2.",
        "is_active": True,
    },
]


LANDING_PRODUCTS = {
    "landing-1": [
        {"name": "Golden Essence", "category": "Premium", "sort_order": 1},
        {"name": "Royal Spice", "category": "Spicy", "sort_order": 2},
        {"name": "Citrus Bloom", "category": "Fresh", "sort_order": 3},
        {"name": "Velvet Musk", "category": "Premium", "sort_order": 4},
        {"name": "Midnight Oud", "category": "Woody", "sort_order": 5},
    ],
    "landing-2": [
        {"name": "Aqua Mist", "category": "Fresh", "sort_order": 1},
        {"name": "Desert Rose", "category": "Floral", "sort_order": 2},
        {"name": "Ocean Breeze", "category": "Fresh", "sort_order": 3},
        {"name": "Sandalwood", "category": "Woody", "sort_order": 4},
        {"name": "Jasmine Pearl", "category": "Floral", "sort_order": 5},
    ],
}


async def seed():
    load_dotenv(backend_dir / ".env")
    await db_manager.ensure_initialized()
    
    async with db_manager.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Tables created")

    async with db_manager.async_session_maker() as db:
        # Check if already seeded
        result = await db.execute(select(LandingPage))
        existing = result.scalars().all()
        if len(existing) >= 2:
            logger.info("Landing pages already seeded. Skipping.")
            return

        # Create pages
        page_map = {}
        for page_data in LANDING_PAGES:
            page = LandingPage(**page_data)
            db.add(page)
            await db.commit()
            await db.refresh(page)
            page_map[page.slug] = page
            logger.info(f"Created landing page: {page.name} (id={page.id})")

            # Create catalogue
            catalogue = LandingCatalogue(
                landing_page_id=page.id,
                name=f"{page.name} Catalogue",
            )
            db.add(catalogue)
            await db.commit()
            await db.refresh(catalogue)
            logger.info(f"  Created catalogue (id={catalogue.id})")

            # Create products
            products = LANDING_PRODUCTS.get(page.slug, [])
            for p in products:
                product = LandingProduct(
                    catalogue_id=catalogue.id,
                    name=p["name"],
                    category=p["category"],
                    sort_order=p["sort_order"],
                    is_active=True,
                )
                db.add(product)
            await db.commit()
            logger.info(f"  Created {len(products)} products")

        logger.info("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())