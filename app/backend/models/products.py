from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    volumes = Column(String, nullable=True)
    image = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    refillable = Column(Boolean, nullable=True, default=False, server_default='false')
    is_new = Column(Boolean, nullable=True, default=False, server_default='false')
    is_featured = Column(Boolean, nullable=True, default=False, server_default='false')
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
