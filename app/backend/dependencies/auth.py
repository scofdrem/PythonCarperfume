"""
Authentication dependencies for FastAPI route protection.

Provides dependency injection for:
- Current user extraction (from Bearer token or cookie)
- Admin-only access control
"""
import hashlib
import logging
from typing import Optional

from core.auth import AccessTokenError, decode_access_token
from core.config import settings
from core.database import get_db
from core.exceptions import ForbiddenError, UnauthorizedError
from fastapi import Depends, Request
from models.auth import User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


async def get_token_from_request(request: Request) -> Optional[str]:
    """Extract JWT token from request (cookie first, then Authorization header)."""
    # Try cookie first
    token = request.cookies.get("auth_token")
    if token:
        return token

    # Try Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]

    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate current user from request.

    Reads JWT from cookie or Authorization header, validates it,
    and fetches the user from the database.
    """
    token = await get_token_from_request(request)
    if not token:
        raise UnauthorizedError("Authentication required")

    try:
        payload = decode_access_token(token)
    except AccessTokenError as exc:
        raise UnauthorizedError(exc.message)

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token")

    # Fetch user from database
    result = await db.execute(select(User).where(User.id == int(user_id), User.is_active == True))
    user = result.scalar_one_or_none()

    if not user:
        logger.warning(f"User {user_id} not found or inactive")
        raise UnauthorizedError("User not found or inactive")

    return user


async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Verify current user has admin role."""
    if current_user.role != "admin":
        raise ForbiddenError("Admin access required")
    return current_user