from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    age_range = Column(String, nullable=True)
    volumes = Column(String, nullable=True)
    image = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    is_new = Column(Boolean, nullable=True, default=False, server_default='false')
    is_featured = Column(Boolean, nullable=True, default=False, server_default='false')
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)