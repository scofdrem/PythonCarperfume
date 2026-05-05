import logging
import re
from typing import Optional

from core.database import get_db
from dependencies.auth import get_admin_user
from fastapi import APIRouter, Depends, HTTPException, status
from models.auth import User
from pydantic import BaseModel, EmailStr, field_validator
from schemas.auth import UserResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/admin/account", tags=["admin-account"])


# ---------- Pydantic Schemas with Validation ----------

class UpdateEmailRequest(BaseModel):
    """Schema for updating admin email with validation."""
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        email_pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, v):
            raise ValueError("Введите корректный email адрес")
        if len(v) > 254:
            raise ValueError("Email слишком длинный (макс. 254 символа)")
        return v


class UpdatePasswordRequest(BaseModel):
    """Schema for updating admin password with validation."""
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("current_password")
    @classmethod
    def validate_current_password(cls, v: str) -> str:
        if not v or len(v.strip()) < 1:
            raise ValueError("Введите текущий пароль")
        return v

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 8:
            raise ValueError("Пароль должен содержать минимум 8 символов")
        if len(v) > 128:
            raise ValueError("Пароль слишком длинный (макс. 128 символов)")
        if not re.search(r"[A-Za-z]", v):
            raise ValueError("Пароль должен содержать хотя бы одну букву")
        if not re.search(r"[0-9]", v):
            raise ValueError("Пароль должен содержать хотя бы одну цифру")
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_confirm_password(cls, v: str, info) -> str:
        return v

    def model_post_init(self, __context):
        if self.new_password != self.confirm_password:
            raise ValueError("Пароли не совпадают")


class UpdateNameRequest(BaseModel):
    """Schema for updating admin display name."""
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Имя не может быть пустым")
        if len(v) > 100:
            raise ValueError("Имя слишком длинное (макс. 100 символов)")
        return v


class AccountResponse(BaseModel):
    """Admin account info response."""
    id: str
    email: str
    name: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class FeedbackEmailRequest(BaseModel):
    """Schema for updating feedback email with validation."""
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        email_pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, v):
            raise ValueError("Введите корректный email адрес")
        if len(v) > 254:
            raise ValueError("Email слишком длинный (макс. 254 символа)")
        return v


class FeedbackEmailResponse(BaseModel):
    """Feedback email config response."""
    email: str


# ---------- Account Endpoints ----------

@router.get("", response_model=AccountResponse)
async def get_admin_account(
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current admin account information."""
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role)


@router.put("/email", response_model=AccountResponse)
async def update_admin_email(
    data: UpdateEmailRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update admin email address."""
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    old_email = user.email
    user.email = data.email
    await db.commit()
    await db.refresh(user)

    logger.info(f"Admin email updated: {old_email} -> {data.email}")
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role)


@router.put("/name", response_model=AccountResponse)
async def update_admin_name(
    data: UpdateNameRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update admin display name."""
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    user.name = data.name
    await db.commit()
    await db.refresh(user)

    logger.info(f"Admin name updated to: {data.name}")
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role)


@router.put("/password")
async def update_admin_password(
    data: UpdatePasswordRequest,
    current_user: UserResponse = Depends(get_admin_user),
):
    """Update admin password.

    Note: Authentication is managed through the OIDC provider.
    This endpoint validates the request format but the actual password
    change must be performed through the identity provider's interface.
    """
    # Validate that new password differs from current
    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Новый пароль должен отличаться от текущего",
        )

    return {
        "message": "Аутентификация управляется через внешний провайдер (OIDC). "
                   "Для смены пароля используйте интерфейс провайдера авторизации.",
        "provider_managed": True,
    }


# ---------- Feedback Email Endpoints ----------

@router.get("/feedback-email", response_model=FeedbackEmailResponse)
async def get_feedback_email(
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the default feedback email address from app config."""
    from models.app_configs import App_configs

    result = await db.execute(
        select(App_configs).where(App_configs.config_key == "feedback_email")
    )
    config = result.scalar_one_or_none()

    email = config.config_value if config else ""
    return FeedbackEmailResponse(email=email)


@router.put("/feedback-email", response_model=FeedbackEmailResponse)
async def update_feedback_email(
    data: FeedbackEmailRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the default feedback email address in app config."""
    from models.app_configs import App_configs

    result = await db.execute(
        select(App_configs).where(App_configs.config_key == "feedback_email")
    )
    config = result.scalar_one_or_none()

    if config:
        config.config_value = data.email
    else:
        config = App_configs(
            config_key="feedback_email",
            config_value=data.email,
            description="Default email address for customer feedback and inquiries",
        )
        db.add(config)

    await db.commit()
    await db.refresh(config)

    logger.info(f"Feedback email updated to: {data.email}")
    return FeedbackEmailResponse(email=data.email)