import logging
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

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
async def submit_inquiry(data: InquiryRequest):
    """Submit a product availability inquiry."""
    try:
        # Log the inquiry for admin review
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

        # In production, you could send an email notification here
        # using the FEEDBACK_EMAIL configured in settings.
        # For now, we store it in the log and return success.

        return InquiryResponse(
            success=True,
            message="Ваш запрос успешно отправлен. Мы свяжемся с вами в ближайшее время.",
        )
    except Exception as e:
        logger.error(f"Inquiry submission error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit inquiry: {str(e)}")