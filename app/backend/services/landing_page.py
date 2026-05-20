import logging
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.landing_page import LandingPage
from models.landing_catalogue import LandingCatalogue

logger = logging.getLogger(__name__)


class LandingPageService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[LandingPage]:
        result = await self.db.execute(select(LandingPage))
        return list(result.scalars().all())

    async def get_by_id(self, id: int) -> Optional[LandingPage]:
        result = await self.db.execute(select(LandingPage).where(LandingPage.id == id))
        return result.scalars().first()

    async def get_by_slug(self, slug: str) -> Optional[LandingPage]:
        result = await self.db.execute(select(LandingPage).where(LandingPage.slug == slug))
        return result.scalars().first()

    async def get_by_domain(self, domain: str) -> Optional[LandingPage]:
        result = await self.db.execute(
            select(LandingPage).where(LandingPage.domain == domain, LandingPage.is_active == True)
        )
        return result.scalars().first()

    async def create(self, data: dict) -> LandingPage:
        page = LandingPage(**data)
        self.db.add(page)
        await self.db.commit()
        await self.db.refresh(page)
        return page

    async def update(self, id: int, data: dict) -> Optional[LandingPage]:
        page = await self.get_by_id(id)
        if not page:
            return None
        for key, value in data.items():
            setattr(page, key, value)
        await self.db.commit()
        await self.db.refresh(page)
        return page

    async def delete(self, id: int) -> bool:
        page = await self.get_by_id(id)
        if not page:
            return False
        await self.db.delete(page)
        await self.db.commit()
        return True

    async def get_or_create_catalogue(self, landing_page_id: int) -> Optional[LandingCatalogue]:
        result = await self.db.execute(
            select(LandingCatalogue).where(LandingCatalogue.landing_page_id == landing_page_id)
        )
        catalogue = result.scalars().first()
        if catalogue:
            return catalogue
        page = await self.get_by_id(landing_page_id)
        if not page:
            return None
        catalogue = LandingCatalogue(landing_page_id=landing_page_id, name=f"{page.name} Catalogue")
        self.db.add(catalogue)
        await self.db.commit()
        await self.db.refresh(catalogue)
        return catalogue