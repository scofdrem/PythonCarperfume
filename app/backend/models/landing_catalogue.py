from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base


class LandingCatalogue(Base):
    __tablename__ = "landing_catalogues"

    id = Column(Integer, primary_key=True, index=True)
    landing_page_id = Column(Integer, ForeignKey("landing_pages.id"), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())