from typing import Optional
from pydantic import BaseModel
from datetime import datetime, date


class LandingCatalogueBase(BaseModel):
    landing_page_id: int
    name: str


class LandingCatalogueCreate(LandingCatalogueBase):
    pass


class LandingCatalogueUpdate(BaseModel):
    name: Optional[str] = None


class LandingCatalogueResponse(LandingCatalogueBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True