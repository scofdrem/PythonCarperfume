import hashlib
import logging

from core.auth import AccessTokenError, decode_access_token, decode_refresh_token
from core.config import settings
from core.exceptions import UnauthorizedError
from dependencies.auth import get_admin_user, get_current_user
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from middlewares.rate_limit import limiter
from models.auth import User
from models.refresh_token import RefreshToken
from schemas.auth import AdminLoginRequest, AdminLoginResponse, UserResponse
from services.auth import AuthService, AccountLockedError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

logger = logging.getLogger(__name__)


@router.post("/admin/login", response_model=AdminLoginResponse)
@limiter.limit("5/minute")
async def admin_login(
    request: AdminLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Admin login with username/password, returns JWT token pair."""
    auth_service = AuthService(db)
    try:
        user = await auth_service.authenticate_admin(request.username, request.password)
    except AccountLockedError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc))

    if not user:
        logger.warning(f"Failed admin login attempt: {request.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Issue token pair
    access_data, refresh_data = await auth_service.issue_token_pair(user)

    # Set refresh token in httpOnly cookie (7-day expiry)
    response.set_cookie(
        key="refresh_token",
        value=refresh_data["token"],
        httponly=True,
        secure=settings.is_production,
        samesite="strict" if settings.is_production else "lax",
        max_age=7 * 24 * 60 * 60,  # 7 days
        path="/api/v1/auth",
    )

    # Also set access token cookie for same-site requests
    response.set_cookie(
        key="auth_token",
        value=access_data["token"],
        httponly=True,
        secure=settings.is_production,
        samesite="strict" if settings.is_production else "lax",
        max_age=int(settings.access_token_expire_minutes) * 60,
    )

    return AdminLoginResponse(
        token=access_data["token"],
        token_type="Bearer",
        expires_in=access_data["expires_in"],
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            last_login=user.last_login,
        ),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current authenticated user info."""
    return current_user


@router.post("/logout")
async def logout(response: Response, request: Request, db: AsyncSession = Depends(get_db)):
    """Revoke refresh token and clear auth cookies."""
    # Try to revoke refresh token if present
    refresh_token = request.cookies.get("refresh_token")
    if refresh_token:
        try:
            payload = decode_refresh_token(refresh_token)
            jti = payload.get("jti")
            if jti:
                result = await db.execute(select(RefreshToken).where(RefreshToken.jti == jti))
                rt = result.scalar_one_or_none()
                if rt:
                    rt.is_revoked = True
                    await db.commit()
        except Exception:
            pass  # Best-effort revocation

    # Clear both cookies
    response.delete_cookie(key="auth_token", httponly=True, secure=settings.is_production, samesite="strict")
    response.delete_cookie(key="refresh_token", httponly=True, secure=settings.is_production, samesite="strict", path="/api/v1/auth")
    return {"message": "Logged out successfully"}


@router.post("/token/refresh")
async def refresh_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    """Rotate refresh token: validate old, revoke it, issue new pair."""
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    auth_service = AuthService(db)
    try:
        access_data, refresh_data = await auth_service.rotate_refresh_token(refresh_token)
    except UnauthorizedError as exc:
        # If refresh token is invalid/reused, clear cookie
        response.delete_cookie(key="refresh_token", httponly=True, secure=settings.is_production, samesite="strict", path="/api/v1/auth")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))

    # Set new refresh token cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_data["token"],
        httponly=True,
        secure=settings.is_production,
        samesite="strict" if settings.is_production else "lax",
        max_age=7 * 24 * 60 * 60,
        path="/api/v1/auth",
    )

    # Set new access token cookie
    response.set_cookie(
        key="auth_token",
        value=access_data["token"],
        httponly=True,
        secure=settings.is_production,
        samesite="strict" if settings.is_production else "lax",
        max_age=int(settings.access_token_expire_minutes) * 60,
    )

    return {
        "token": access_data["token"],
        "token_type": "Bearer",
        "expires_in": access_data["expires_in"],
    }