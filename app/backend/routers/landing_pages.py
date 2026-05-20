import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from schemas.landing_page import (
    LandingPageCreate, LandingPageUpdate, LandingPageResponse, LandingPageListResponse,
)
from schemas.landing_catalogue import (
    LandingCatalogueCreate, LandingCatalogueUpdate, LandingCatalogueResponse,
)
from services.landing_page import LandingPageService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/landing-pages", tags=["landing-pages"])


# ---------- Landing Page CRUD ----------
@router.get("", response_model=LandingPageListResponse)
async def list_landing_pages(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=2000),
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    pages = await service.get_all()
    return {"items": pages, "total": len(pages), "skip": skip, "limit": limit}


@router.get("/by-domain", response_model=LandingPageResponse)
async def get_landing_page_by_domain(
    domain: str = Query(..., description="Domain name to look up"),
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    page = await service.get_by_domain(domain)
    if not page:
        raise HTTPException(status_code=404, detail=f"Landing page for domain '{domain}' not found")
    return page


@router.get("/by-slug/{slug}", response_model=LandingPageResponse)
async def get_landing_page_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    page = await service.get_by_slug(slug)
    if not page:
        raise HTTPException(status_code=404, detail=f"Landing page '{slug}' not found")
    return page


@router.get("/{id}", response_model=LandingPageResponse)
async def get_landing_page(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    page = await service.get_by_id(id)
    if not page:
        raise HTTPException(status_code=404, detail="Landing page not found")
    return page


@router.post("", response_model=LandingPageResponse, status_code=201)
async def create_landing_page(
    data: LandingPageCreate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    try:
        result = await service.create(data.model_dump())
        return result
    except Exception as e:
        logger.error(f"Error creating landing page: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/{id}", response_model=LandingPageResponse)
async def update_landing_page(
    id: int,
    data: LandingPageUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await service.update(id, update_dict)
    if not result:
        raise HTTPException(status_code=404, detail="Landing page not found")
    return result


@router.delete("/{id}")
async def delete_landing_page(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    success = await service.delete(id)
    if not success:
        raise HTTPException(status_code=404, detail="Landing page not found")
    return {"message": "Landing page deleted successfully", "id": id}


# ---------- Catalogue CRUD (nested under landing page) ----------
@router.get("/{id}/catalogue", response_model=LandingCatalogueResponse)
async def get_catalogue(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    catalogue = await service.get_or_create_catalogue(id)
    if not catalogue:
        raise HTTPException(status_code=404, detail="Landing page not found")
    return catalogue


@router.put("/{id}/catalogue", response_model=LandingCatalogueResponse)
async def update_catalogue(
    id: int,
    data: LandingCatalogueUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingPageService(db)
    catalogue = await service.get_or_create_catalogue(id)
    if not catalogue:
        raise HTTPException(status_code=404, detail="Landing page not found")
    update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
    for key, value in update_dict.items():
        setattr(catalogue, key, value)
    await db.commit()
    await db.refresh(catalogue)
    return catalogue