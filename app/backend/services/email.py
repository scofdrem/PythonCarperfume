"""Email service using Python's built-in smtplib — no third-party libraries required.

SMTP configuration is loaded from the database (app_configs table) first,
falling back to environment variables. This ensures settings persist across
redeployments.
"""

import logging
import os
import smtplib
import textwrap
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate
from typing import Optional

logger = logging.getLogger(__name__)

# In-memory cache for SMTP config (refreshed on save or startup)
_smtp_cache: dict = {}


def _get_smtp_config() -> dict:
    """Read SMTP configuration from cache, then environment variables."""
    if _smtp_cache:
        return _smtp_cache.copy()

    return {
        "host": os.environ.get("SMTP_HOST", ""),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "user": os.environ.get("SMTP_USER", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "from_addr": os.environ.get("EMAIL_FROM", os.environ.get("SMTP_USER", "")),
        "to_addr": os.environ.get("EMAIL_TO", ""),
    }


def update_smtp_cache(
    host: str = "",
    port: str = "",
    user: str = "",
    password: str = "",
    from_addr: str = "",
    to_addr: str = "",
) -> None:
    """Update the in-memory SMTP cache with new values."""
    _smtp_cache.clear()
    if host:
        _smtp_cache["host"] = host
    if port:
        _smtp_cache["port"] = int(port)
    else:
        _smtp_cache["port"] = 587
    _smtp_cache["user"] = user
    _smtp_cache["password"] = password
    _smtp_cache["from_addr"] = from_addr or user
    _smtp_cache["to_addr"] = to_addr

    # Also update env vars for any code that reads them directly
    os.environ["SMTP_HOST"] = host
    os.environ["SMTP_PORT"] = port or "587"
    os.environ["SMTP_USER"] = user
    os.environ["SMTP_PASSWORD"] = password
    os.environ["EMAIL_FROM"] = from_addr or user
    os.environ["EMAIL_TO"] = to_addr

    logger.info("SMTP cache updated from database")


def _is_configured() -> bool:
    """Check whether the minimum SMTP settings are present."""
    cfg = _get_smtp_config()
    return bool(cfg["host"] and cfg["to_addr"])


def _sanitize(text: str) -> str:
    """Strip potentially dangerous characters from user-supplied text."""
    # Remove null bytes and limit length to prevent header injection
    cleaned = text.replace("\x00", "")
    # Remove any bare CR/LF that could be used for header injection
    cleaned = cleaned.replace("\r", "").replace("\n", " ")
    return cleaned[:500]


def _build_inquiry_body(
    product_name: str,
    product_brand: str,
    volume: str,
    customer_name: str,
    telegram: str,
    customer_email: str,
    contact_method: str,
    message: str,
) -> str:
    """Build a plain-text email body for an inquiry notification."""
    contact_info = customer_email if contact_method == "email" else telegram
    body = textwrap.dedent(
        f"""\
        Новый запрос на наличие товара
        ==============================

        Товар:   {product_brand} — {product_name}
        Объём:   {volume or 'не указан'}

        Клиент:  {customer_name or 'Аноним'}
        Способ связи: {contact_method}
        Контакт: {contact_info or 'не указан'}

        Сообщение:
        {message or '—'}
        """
    )
    return body


async def send_inquiry_notification(
    product_name: str,
    product_brand: str,
    volume: str,
    customer_name: str,
    telegram: str,
    customer_email: str,
    contact_method: str,
    message: str,
) -> bool:
    """Send an inquiry notification email to the store admin.

    Returns True if the email was sent successfully, False otherwise.
    Failures are logged but do NOT raise — the inquiry is still saved to DB.
    """
    if not _is_configured():
        logger.warning("SMTP not configured — skipping email notification")
        return False

    cfg = _get_smtp_config()

    # Sanitize all user-supplied fields
    safe_product_name = _sanitize(product_name)
    safe_product_brand = _sanitize(product_brand)
    safe_volume = _sanitize(volume)
    safe_customer_name = _sanitize(customer_name)
    safe_telegram = _sanitize(telegram)
    safe_customer_email = _sanitize(customer_email)
    safe_contact_method = _sanitize(contact_method)
    safe_message = _sanitize(message)

    subject = f"Запрос: {safe_product_brand} — {safe_product_name}"
    body = _build_inquiry_body(
        safe_product_name,
        safe_product_brand,
        safe_volume,
        safe_customer_name,
        safe_telegram,
        safe_customer_email,
        safe_contact_method,
        safe_message,
    )

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = formataddr(("Parfum Store", cfg["from_addr"]))
    msg["To"] = cfg["to_addr"]
    msg["Date"] = formatdate(localtime=True)

    # Set Reply-To to the customer's email when available
    reply_to: Optional[str] = None
    if safe_customer_email:
        reply_to = safe_customer_email
    elif safe_telegram:
        reply_to = safe_telegram
    if reply_to:
        msg["Reply-To"] = reply_to

    try:
        port = cfg["port"]
        if port == 465:
            # Implicit SSL
            with smtplib.SMTP_SSL(cfg["host"], port, timeout=15) as server:
                if cfg["user"] and cfg["password"]:
                    server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_addr"], [cfg["to_addr"]], msg.as_string())
        else:
            # Explicit TLS (port 587 or others)
            with smtplib.SMTP(cfg["host"], port, timeout=15) as server:
                server.ehlo()
                if cfg["user"] and cfg["password"]:
                    server.starttls()
                    server.ehlo()
                    server.login(cfg["user"], cfg["password"])
                server.sendmail(cfg["from_addr"], [cfg["to_addr"]], msg.as_string())

        logger.info("Inquiry notification email sent to %s", cfg["to_addr"])
        return True
    except Exception as e:
        logger.error("Failed to send inquiry notification email: %s", e)
        return False


async def initialize_smtp_from_db() -> None:
    """Load SMTP configuration from database into cache at startup.

    This ensures email service works immediately after app restart
    without needing to re-enter SMTP settings.
    """
    try:
        from core.database import async_session
        from models.app_configs import App_configs
        from sqlalchemy import select

        SMTP_KEYS = {
            "smtp_host": "SMTP_HOST",
            "smtp_port": "SMTP_PORT",
            "smtp_user": "SMTP_USER",
            "smtp_password": "SMTP_PASSWORD",
            "email_from": "EMAIL_FROM",
            "email_to": "EMAIL_TO",
        }

        values = {}
        async with async_session() as db:
            for key in SMTP_KEYS:
                result = await db.execute(
                    select(App_configs).where(App_configs.config_key == key)
                )
                config = result.scalar_one_or_none()
                values[key] = config.config_value if config else ""

        if any(values.values()):
            update_smtp_cache(
                host=values.get("smtp_host", ""),
                port=values.get("smtp_port", ""),
                user=values.get("smtp_user", ""),
                password=values.get("smtp_password", ""),
                from_addr=values.get("email_from", ""),
                to_addr=values.get("email_to", ""),
            )
            logger.info("SMTP configuration loaded from database")
        else:
            logger.info("No SMTP configuration found in database, using env vars")
    except Exception as e:
        logger.warning(f"Could not load SMTP config from database: {e}")