from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime, date


class LandingPageBase(BaseModel):
    name: str
    slug: str
    domain: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    theme_primary: Optional[str] = "#C69B56"
    theme_secondary: Optional[str] = "#000000"
    is_active: Optional[bool] = True


class LandingPageCreate(LandingPageBase):
    pass


class LandingPageUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    domain: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    theme_primary: Optional[str] = None
    theme_secondary: Optional[str] = None
    is_active: Optional[bool] = None


class LandingPageResponse(LandingPageBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LandingPageListResponse(BaseModel):
    items: List[LandingPageResponse]
    total: int