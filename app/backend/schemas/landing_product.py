from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime, date


class LandingProductBase(BaseModel):
    catalogue_id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    attributes: Optional[List[Dict[str, Any]]] = None  # configurable variants: [{name, options:[{label, price, inventory}]}]
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class LandingProductCreate(LandingProductBase):
    pass


class LandingProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    attributes: Optional[List[Dict[str, Any]]] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class LandingProductResponse(LandingProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LandingProductBatchCreateRequest(BaseModel):
    items: List[LandingProductCreate]


class LandingProductBatchUpdateItem(BaseModel):
    id: int
    updates: LandingProductUpdate


class LandingProductBatchUpdateRequest(BaseModel):
    items: List[LandingProductBatchUpdateItem]


class LandingProductBatchDeleteRequest(BaseModel):
    ids: List[int]


class LandingProductListResponse(BaseModel):
    items: List[LandingProductResponse]
    total: int