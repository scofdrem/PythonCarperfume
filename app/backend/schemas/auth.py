from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserResponse(BaseModel):
    id: str  # Now a string UUID (platform sub)
    email: str
    name: Optional[str] = None
    role: str = "user"  # user/admin
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


class PlatformTokenExchangeRequest(BaseModel):
    """Request body for exchanging Platform token for app token."""

    platform_token: str


class TokenExchangeResponse(BaseModel):
    """Response body for issued application token."""

    token: str


class AdminLoginRequest(BaseModel):
    """Request body for admin username/password login."""

    username: str = Field(..., min_length=1, max_length=255)
    password: str = Field(..., min_length=1, max_length=255)


class AdminLoginResponse(BaseModel):
    """Response body for admin login with application token."""

    token: str
    token_type: str = "Bearer"
    expires_in: int
    user: UserResponse
