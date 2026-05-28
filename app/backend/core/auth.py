import hashlib
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from core.config import settings
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError, JWTClaimsError

logger = logging.getLogger(__name__)

# Token type claims
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


class AccessTokenError(Exception):
    """Custom exception for application JWT access token errors."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


def create_access_token(claims: Dict[str, Any], expires_minutes: Optional[int] = None) -> str:
    """Create short-lived JWT access token from provided claims."""
    if not settings.jwt_secret_key:
        logger.error("JWT secret key is not configured")
        raise ValueError("JWT secret key is not configured")

    now = datetime.now(timezone.utc)
    token_claims = claims.copy()

    expiry_minutes = expires_minutes if expires_minutes is not None else int(settings.access_token_expire_minutes)
    expire_at = now + timedelta(minutes=expiry_minutes)

    token_claims.update(
        {
            "exp": expire_at,
            "iat": now,
            "nbf": now,
            "type": ACCESS_TOKEN_TYPE,
        }
    )

    token = jwt.encode(token_claims, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    user_id = token_claims.get("sub", "unknown")
    user_hash = hashlib.sha256(str(user_id).encode()).hexdigest()[:8] if user_id != "unknown" else "unknown"
    logger.debug("Access token created for user hash: %s", user_hash)
    return token


def create_refresh_token(user_id: str, jti: str) -> tuple[str, datetime]:
    """Create long-lived JWT refresh token.

    Returns (token, expires_at).
    """
    if not settings.jwt_secret_key:
        raise ValueError("JWT secret key is not configured")

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=7)

    claims = {
        "sub": user_id,
        "jti": jti,
        "type": REFRESH_TOKEN_TYPE,
        "exp": expires_at,
        "iat": now,
        "nbf": now,
    }

    token = jwt.encode(claims, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    logger.debug("Refresh token created for user_id: %s", user_id)
    return token, expires_at


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT access token."""
    if not settings.jwt_secret_key:
        logger.error("JWT secret key is not configured")
        raise AccessTokenError("Authentication service is misconfigured")

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != ACCESS_TOKEN_TYPE:
            raise AccessTokenError("Invalid token type")
        user_id = payload.get("sub", "unknown")
        user_hash = hashlib.sha256(str(user_id).encode()).hexdigest()[:8] if user_id != "unknown" else "unknown"
        logger.debug("Access token validated for user hash: %s", user_hash)
        return payload
    except ExpiredSignatureError as exc:
        logger.info("Access token has expired")
        raise AccessTokenError("Token has expired") from exc
    except JWTError as exc:
        logger.warning("Token validation failed: %s", type(exc).__name__)
        raise AccessTokenError("Invalid authentication token") from exc


def decode_refresh_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT refresh token."""
    if not settings.jwt_secret_key:
        raise AccessTokenError("Authentication service is misconfigured")

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != REFRESH_TOKEN_TYPE:
            raise AccessTokenError("Invalid token type")
        return payload
    except ExpiredSignatureError as exc:
        raise AccessTokenError("Refresh token has expired") from exc
    except JWTError as exc:
        raise AccessTokenError("Invalid refresh token") from exc
