from core.database import Base
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String


class App_configs(Base):
    __tablename__ = "app_configs"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    config_key = Column(String, nullable=False)
    config_value = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)