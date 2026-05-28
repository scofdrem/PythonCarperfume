from models.base import Base
from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey
from sqlalchemy.sql import func


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(255), primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(255), nullable=False, unique=True)
    jti = Column(String(255), nullable=False, unique=True)
    is_revoked = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())