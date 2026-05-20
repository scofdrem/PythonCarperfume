import hashlib
import hmac
import logging
import re
import secrets
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


# ---------- Password Hashing Utilities ----------

def generate_salt() -> str:
    """Generate a secure random salt."""
    return secrets.token_hex(32)


def hash_password(password: str, salt: str) -> str:
    """Hash a password with salt using PBKDF2-SHA256."""
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000,  # iterations
    )
    return key.hex()


def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    """Verify a password against a stored hash."""
    computed_hash = hash_password(password, salt)
    return hmac.compare_digest(computed_hash, stored_hash)

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
    current_password: Optional[str] = ""
    new_password: str
    confirm_password: str

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


class UpdateLoginRequest(BaseModel):
    """Schema for updating admin login with validation."""
    login: str

    @field_validator("login")
    @classmethod
    def validate_login(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Логин не может быть пустым")
        if len(v) < 3:
            raise ValueError("Логин должен содержать минимум 3 символа")
        if len(v) > 100:
            raise ValueError("Логин слишком длинный (макс. 100 символов)")
        if not re.match(r"^[a-zA-Z0-9_\-]+$", v):
            raise ValueError("Логин может содержать только латинские буквы, цифры, дефис и подчёркивание")
        return v


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
    login: Optional[str] = None  # Login/username (displayed as Login)
    has_password: bool = False  # Whether password is set

    class Config:
        from_attributes = True


class UpdateRoleRequest(BaseModel):
    """Schema for updating a user's role."""
    user_id: str
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        v = v.strip().lower()
        if v not in ("user", "admin"):
            raise ValueError("Роль должна быть 'user' или 'admin'")
        return v

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("ID пользователя не может быть пустым")
        return v


class DeleteUserRequest(BaseModel):
    """Schema for deleting a user."""
    user_id: str

    @field_validator("user_id")
    @classmethod
    def validate_user_id(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("ID пользователя не может быть пустым")
        return v


class UserListResponse(BaseModel):
    """Single user info in the list."""
    id: str
    email: str
    name: Optional[str] = None
    role: str
    last_login: Optional[str] = None
    created_at: Optional[str] = None


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
    return AccountResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        login=user.login,  # Use login field from DB
        has_password=bool(user.password_hash),
    )


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
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role, login=user.login, has_password=bool(user.password_hash))


@router.put("/login", response_model=AccountResponse)
async def update_admin_login(
    data: UpdateLoginRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update admin login username."""
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    # Check if login is already taken by another user
    existing = await db.execute(select(User).where(User.login == data.login).where(User.id != current_user.id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Этот логин уже занят")

    old_login = user.login
    user.login = data.login
    await db.commit()
    await db.refresh(user)

    logger.info(f"Admin login updated: {old_login} -> {data.login}")
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role, login=user.login, has_password=bool(user.password_hash))


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
    return AccountResponse(id=user.id, email=user.email, name=user.name, role=user.role, login=user.login, has_password=bool(user.password_hash))


@router.put("/password")
async def update_admin_password(
    data: UpdatePasswordRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update admin password with proper hashing."""
    result = await db.execute(select(User).where(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    # If user already has a password, verify the current password
    if user.password_hash:
        if not data.current_password or not data.current_password.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Введите текущий пароль",
            )
        stored = user.password_hash
        if ":" in stored:
            salt, stored_hash = stored.split(":", 1)
            if not verify_password(data.current_password, salt, stored_hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Неверный текущий пароль",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Требуется повторная аутентификация. Обратитесь к администратору.",
            )

    # Generate new salt and hash the new password
    salt = generate_salt()
    new_hash = hash_password(data.new_password, salt)
    user.password_hash = f"{salt}:{new_hash}"

    await db.commit()
    await db.refresh(user)

    logger.info(f"Admin password updated for user: {user.email}")
    return {"message": "Пароль успешно обновлён", "success": True}


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


# ---------- User Management Endpoints ----------

@router.get("/users", response_model=list[UserListResponse])
async def list_users(
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """List all registered users. Admin only."""
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [
        UserListResponse(
            id=u.id,
            email=u.email,
            name=u.name,
            role=u.role,
            last_login=u.last_login.isoformat() if u.last_login else None,
            created_at=u.created_at.isoformat() if u.created_at else None,
        )
        for u in users
    ]


@router.put("/users/role", response_model=UserListResponse)
async def update_user_role(
    data: UpdateRoleRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a user's role (promote/demote). Admin only."""
    if data.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не можете изменить свою собственную роль",
        )

    result = await db.execute(select(User).where(User.id == data.user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    old_role = user.role
    user.role = data.role
    await db.commit()
    await db.refresh(user)

    logger.info(f"User {user.email} role changed: {old_role} -> {data.role} by admin {current_user.email}")
    return UserListResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        last_login=user.last_login.isoformat() if user.last_login else None,
        created_at=user.created_at.isoformat() if user.created_at else None,
    )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user account. Admin only."""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не можете удалить свой собственный аккаунт",
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    await db.delete(user)
    await db.commit()

    logger.info(f"User {user.email} deleted by admin {current_user.email}")
    return {"message": f"Пользователь {user.email} удалён", "deleted": True}