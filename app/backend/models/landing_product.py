from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.sql import func
from core.database import Base


class LandingProduct(Base):
    __tablename__ = "landing_products"

    id = Column(Integer, primary_key=True, index=True)
    catalogue_id = Column(Integer, ForeignKey("landing_catalogues.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    attributes = Column(JSON, nullable=True)  # configurable: size, color, pricing tiers, inventory
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
