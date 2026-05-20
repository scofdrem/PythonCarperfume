from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from core.database import Base


class LandingPage(Base):
    __tablename__ = "landing_pages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    domain = Column(String(255), unique=True, nullable=True, index=True)
    hero_title = Column(String(200), nullable=True)
    hero_subtitle = Column(Text, nullable=True)
    hero_image = Column(String(500), nullable=True)
    seo_title = Column(String(200), nullable=True)
    seo_description = Column(String(500), nullable=True)
    seo_keywords = Column(String(500), nullable=True)
    theme_primary = Column(String(20), default="#C69B56")
    theme_secondary = Column(String(20), default="#000000")
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())