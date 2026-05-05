"""Email service using Python's built-in smtplib — no third-party libraries required.

Relies on server-side SMTP configuration via environment variables:
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM, EMAIL_TO
"""

import logging
import os
import smtplib
import textwrap
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate
from typing import Optional

logger = logging.getLogger(__name__)


def _get_smtp_config() -> dict:
    """Read SMTP configuration from environment variables."""
    return {
        "host": os.environ.get("SMTP_HOST", ""),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "user": os.environ.get("SMTP_USER", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "from_addr": os.environ.get("EMAIL_FROM", os.environ.get("SMTP_USER", "")),
        "to_addr": os.environ.get("EMAIL_TO", ""),
    }


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