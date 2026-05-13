"""SMTP settings stored in app_configs database table for persistence across redeployments."""

import logging
from typing import Optional

from core.database import get_db
from dependencies.auth import get_admin_user
from fastapi import APIRouter, Depends, HTTPException, status
from models.app_configs import App_configs
from pydantic import BaseModel, field_validator
from schemas.auth import UserResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/admin/smtp", tags=["admin-smtp"])

# SMTP config keys stored in app_configs
SMTP_KEYS = {
    "smtp_host": {
        "description": "SMTP server host (e.g. smtp.gmail.com)",
        "env_key": "SMTP_HOST",
    },
    "smtp_port": {
        "description": "SMTP server port (e.g. 587 for TLS, 465 for SSL)",
        "env_key": "SMTP_PORT",
    },
    "smtp_user": {
        "description": "SMTP login username",
        "env_key": "SMTP_USER",
    },
    "smtp_password": {
        "description": "SMTP login password or app-specific password",
        "env_key": "SMTP_PASSWORD",
    },
    "email_from": {
        "description": "Sender email address for notifications",
        "env_key": "EMAIL_FROM",
    },
    "email_to": {
        "description": "Recipient email address for inquiry notifications",
        "env_key": "EMAIL_TO",
    },
}


class SmtpSettingsRequest(BaseModel):
    """Schema for updating SMTP settings."""
    smtp_host: str = ""
    smtp_port: str = ""
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = ""
    email_to: str = ""

    @field_validator("smtp_port")
    @classmethod
    def validate_port(cls, v: str) -> str:
        v = v.strip()
        if v and not v.isdigit():
            raise ValueError("Порт должен быть числом")
        if v and (int(v) < 1 or int(v) > 65535):
            raise ValueError("Порт должен быть от 1 до 65535")
        return v

    @field_validator("email_from", "email_to")
    @classmethod
    def validate_emails(cls, v: str) -> str:
        v = v.strip()
        if v:
            import re
            email_pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
            if not re.match(email_pattern, v):
                raise ValueError("Введите корректный email адрес")
        return v


class SmtpSettingsResponse(BaseModel):
    """SMTP settings response."""
    smtp_host: str = ""
    smtp_port: str = ""
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = ""
    email_to: str = ""
    is_configured: bool = False


async def _get_config_value(db: AsyncSession, key: str) -> str:
    """Get a config value from app_configs table."""
    result = await db.execute(
        select(App_configs).where(App_configs.config_key == key)
    )
    config = result.scalar_one_or_none()
    return config.config_value if config else ""


async def _set_config_value(db: AsyncSession, key: str, value: str, description: str = ""):
    """Set a config value in app_configs table (upsert)."""
    result = await db.execute(
        select(App_configs).where(App_configs.config_key == key)
    )
    config = result.scalar_one_or_none()
    if config:
        config.config_value = value
    else:
        config = App_configs(
            config_key=key,
            config_value=value,
            description=description,
        )
        db.add(config)


@router.get("", response_model=SmtpSettingsResponse)
async def get_smtp_settings(
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Get SMTP settings from database."""
    values = {}
    for key, meta in SMTP_KEYS.items():
        values[key] = await _get_config_value(db, key)

    is_configured = bool(values["smtp_host"] and values["email_to"])

    return SmtpSettingsResponse(
        smtp_host=values["smtp_host"],
        smtp_port=values["smtp_port"],
        smtp_user=values["smtp_user"],
        smtp_password=values["smtp_password"],
        email_from=values["email_from"],
        email_to=values["email_to"],
        is_configured=is_configured,
    )


@router.put("", response_model=SmtpSettingsResponse)
async def update_smtp_settings(
    data: SmtpSettingsRequest,
    current_user: UserResponse = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    """Update SMTP settings in database (persists across redeployments)."""
    try:
        for key, meta in SMTP_KEYS.items():
            value = getattr(data, key)
            await _set_config_value(db, key, value, meta["description"])

        await db.commit()

        # Also update environment variables for the current process
        # so the email service picks up changes without restart
        import os
        for key, meta in SMTP_KEYS.items():
            value = getattr(data, key)
            os.environ[meta["env_key"]] = value

        # Update the email service in-memory cache so changes take effect immediately
        from services.email import update_smtp_cache
        update_smtp_cache(
            host=data.smtp_host,
            port=data.smtp_port,
            user=data.smtp_user,
            password=data.smtp_password,
            from_addr=data.email_from,
            to_addr=data.email_to,
        )

        is_configured = bool(data.smtp_host and data.email_to)

        logger.info(f"SMTP settings updated by admin {current_user.email}")
        return SmtpSettingsResponse(
            smtp_host=data.smtp_host,
            smtp_port=data.smtp_port,
            smtp_user=data.smtp_user,
            smtp_password=data.smtp_password,
            email_from=data.email_from,
            email_to=data.email_to,
            is_configured=is_configured,
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating SMTP settings: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка сохранения настроек SMTP: {str(e)}",
        )


async def load_smtp_config_from_db(db: AsyncSession) -> dict:
    """Load SMTP configuration from database into environment variables.

    Called at application startup to ensure SMTP env vars are populated
    from the persisted database values.
    """
    import os

    config = {}
    for key, meta in SMTP_KEYS.items():
        value = await _get_config_value(db, key)
        config[key] = value
        if value:
            os.environ[meta["env_key"]] = value

    return config