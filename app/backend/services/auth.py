import hashlib
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple

from core.auth import create_access_token, create_refresh_token, decode_refresh_token
from core.config import settings
from core.exceptions import UnauthorizedError
from core.security import verify_password
from models.auth import User
from models.refresh_token import RefreshToken
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class AccountLockedError(UnauthorizedError):
    """Raised when account is temporarily locked due to failed login attempts."""


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _check_lockout(self, user: User) -> None:
        """Check if account is locked and raise if so."""
        now = datetime.now(timezone.utc)
        if user.locked_until and user.locked_until > now:
            remaining = int((user.locked_until - now).total_seconds())
            logger.warning(f"Account locked for {user.login}, {remaining}s remaining")
            raise AccountLockedError(f"Account temporarily locked. Try again in {remaining} seconds.")
        # Auto-unlock if expired
        if user.locked_until and user.locked_until <= now:
            user.locked_until = None
            user.failed_login_attempts = 0

    async def _record_failed_attempt(self, user: User) -> None:
        """Increment failed attempts, lock account if threshold reached."""
        user.failed_login_attempts += 1
        logger.warning(f"Failed attempt {user.failed_login_attempts}/{settings.max_failed_login_attempts} for {user.login}")
        if user.failed_login_attempts >= settings.max_failed_login_attempts:
            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=settings.lockout_duration_minutes)
            logger.warning(f"Account locked: {user.login}")
        await self.db.commit()

    async def _clear_failed_attempts(self, user: User) -> None:
        """Reset failed attempts on successful login."""
        if user.failed_login_attempts > 0 or user.locked_until is not None:
            user.failed_login_attempts = 0
            user.locked_until = None
            await self.db.commit()

    async def authenticate_admin(self, username: str, password: str) -> Optional[User]:
        """Authenticate admin user with username and password."""
        logger.info(f"Authenticating admin user: {username}")
        result = await self.db.execute(
            select(User).where(User.login == username, User.role == "admin", User.is_active == True)
        )
        user = result.scalar_one_or_none()
        if not user:
            logger.warning(f"Admin user not found: {username}")
            return None

        try:
            await self._check_lockout(user)
        except AccountLockedError:
            raise

        if not verify_password(password, user.password_hash):
            await self._record_failed_attempt(user)
            logger.warning(f"Invalid password for: {username}")
            return None

        await self._clear_failed_attempts(user)
        user.last_login = datetime.now(timezone.utc)
        await self.db.commit()
        logger.info(f"Admin authenticated: {username}")
        return user

    async def issue_token_pair(self, user: User) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """Issue access + refresh token pair. Old refresh tokens are NOT auto-revoked here —
        callers can use rotate_refresh_token() for strict one-time rotation."""
        now = datetime.now(timezone.utc)

        # Access token
        access_claims = {
            "sub": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "username": user.login or "",
        }
        access_token = create_access_token(access_claims)
        access_expires_at = now + timedelta(minutes=int(settings.access_token_expire_minutes))

        # Refresh token
        jti = secrets.token_urlsafe(32)
        refresh_token_str, refresh_expires_at = create_refresh_token(str(user.id), jti)

        # Store in DB
        token_hash = hashlib.sha256(refresh_token_str.encode()).hexdigest()
        rt = RefreshToken(
            id=secrets.token_urlsafe(16),
            user_id=str(user.id),
            token_hash=token_hash,
            jti=jti,
            expires_at=refresh_expires_at,
        )
        self.db.add(rt)
        await self.db.commit()

        logger.info(f"Token pair issued for {user.id}, jti: {jti}")
        return (
            {"token": access_token, "expires_at": access_expires_at, "expires_in": int(settings.access_token_expire_minutes) * 60},
            {"token": refresh_token_str, "expires_at": refresh_expires_at, "jti": jti},
        )

    async def rotate_refresh_token(self, old_refresh_token: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """Rotate refresh token: validate old, revoke it, issue new pair."""
        try:
            payload = decode_refresh_token(old_refresh_token)
        except Exception as exc:
            logger.warning(f"Invalid refresh token: {exc}")
            raise UnauthorizedError("Invalid refresh token")

        user_id = payload.get("sub")
        jti = payload.get("jti")
        if not user_id or not jti:
            raise UnauthorizedError("Invalid refresh token payload")

        # Find in DB
        result = await self.db.execute(
            select(RefreshToken).where(
                RefreshToken.jti == jti,
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc),
            )
        )
        rt = result.scalar_one_or_none()
        if not rt:
            logger.warning(f"Refresh token not found/revoked: {jti}")
            raise UnauthorizedError("Refresh token revoked or expired")

        # Revoke old token
        rt.is_revoked = True

        # Fetch user
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user or not user.is_active:
            raise UnauthorizedError("User not found or inactive")

        await self.db.commit()
        return await self.issue_token_pair(user)


async def initialize_admin_user():
    """Seed the default admin user if it does not exist.

    Reads credentials from settings (``admin_login``, ``admin_email``,
    ``admin_password``).  Falls back to the values previously used in
    *seed_admin_user.py* when the settings are not configured.
    """
    from core.config import settings
    from core.database import db_manager
    from core.security import hash_password
    from models.auth import User
    from sqlalchemy import select

    logger = logging.getLogger(__name__)
    await db_manager.init_db()

    admin_id = getattr(settings, "admin_id", "admin")
    admin_login = getattr(settings, "admin_login", "admin")
    admin_email = getattr(settings, "admin_email", "aromaty1000@gmail.com")
    admin_password = getattr(settings, "admin_password", "admin12345")

    async with db_manager.async_session_maker() as db:
        result = await db.execute(select(User).where(User.id == admin_id))
        existing = result.scalar_one_or_none()

        if existing:
            existing.login = admin_login
            existing.email = admin_email
            existing.password_hash = hash_password(admin_password)
            existing.name = admin_login
            existing.role = "admin"
            await db.commit()
            logger.info("Admin user '%s' updated", admin_login)
        else:
            db.add(
                User(
                    id=admin_id,
                    email=admin_email,
                    login=admin_login,
                    name=admin_login,
                    role="admin",
                    password_hash=hash_password(admin_password),
                    is_active=True,
                )
            )
            await db.commit()
            logger.info("Admin user '%s' created", admin_login)
