import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from models.inquiries import Inquiries
from services.email import send_inquiry_notification

router = APIRouter(prefix="/api/v1/inquiry", tags=["inquiry"])

logger = logging.getLogger(__name__)


class InquiryRequest(BaseModel):
    product_name: str = Field(..., min_length=1, max_length=200)
    product_brand: str = Field(..., min_length=1, max_length=200)
    volume: str = Field(default="", max_length=50)
    customer_name: str = Field(default="", max_length=100)
    telegram: str = Field(default="", max_length=100)
    customer_email: str = Field(default="", max_length=100)
    contact_method: str = Field(default="email", max_length=20)
    message: str = Field(default="", max_length=1000)


class InquiryResponse(BaseModel):
    success: bool
    message: str


@router.post("/submit", response_model=InquiryResponse)
async def submit_inquiry(data: InquiryRequest, db: AsyncSession = Depends(get_db)):
    """Submit a product availability inquiry, save to database, and notify admin via email."""
    try:
        logger.info(
            "New inquiry: product=%s brand=%s volume=%s name=%s telegram=%s email=%s contact_method=%s message=%s",
            data.product_name,
            data.product_brand,
            data.volume,
            data.customer_name,
            data.telegram,
            data.customer_email,
            data.contact_method,
            data.message,
        )

        # Save to database
        inquiry = Inquiries(
            name=data.customer_name or "Аноним",
            email=data.customer_email or (data.telegram or "unknown"),
            phone=data.telegram,
            message=data.message,
            product_name=data.product_name,
            product_brand=data.product_brand,
        )
        db.add(inquiry)
        await db.commit()
        await db.refresh(inquiry)

        logger.info(f"Inquiry saved to database with id: {inquiry.id}")

        # Send email notification (non-blocking — failure does not affect the response)
        email_sent = await send_inquiry_notification(
            product_name=data.product_name,
            product_brand=data.product_brand,
            volume=data.volume,
            customer_name=data.customer_name,
            telegram=data.telegram,
            customer_email=data.customer_email,
            contact_method=data.contact_method,
            message=data.message,
        )
        if email_sent:
            logger.info("Admin notification email sent for inquiry %d", inquiry.id)
        else:
            logger.warning("Admin notification email not sent for inquiry %d (SMTP not configured or send failed)", inquiry.id)

        return InquiryResponse(
            success=True,
            message="Ваш запрос успешно отправлен. Мы свяжемся с вами в ближайшее время.",
        )
    except Exception as e:
        await db.rollback()
        logger.error(f"Inquiry submission error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")