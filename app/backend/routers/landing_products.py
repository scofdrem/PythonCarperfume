import json
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from schemas.landing_product import (
    LandingProductCreate, LandingProductUpdate, LandingProductResponse,
    LandingProductListResponse, LandingProductBatchCreateRequest,
    LandingProductBatchUpdateRequest, LandingProductBatchDeleteRequest,
)
from services.landing_product import LandingProductService
from services.landing_page import LandingPageService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/landing-products", tags=["landing-products"])


# ---------- Landing Product CRUD (scoped to catalogue_id) ----------
@router.get("", response_model=LandingProductListResponse)
async def list_landing_products(
    catalogue_id: int = Query(..., description="Catalogue ID to filter by"),
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=2000),
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    try:
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            catalogue_id=catalogue_id,
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing landing products: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=LandingProductListResponse)
async def list_all_landing_products(
    catalogue_id: int = Query(..., description="Catalogue ID to filter by"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(2000, ge=1, le=2000),
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    try:
        result = await service.get_list(
            catalogue_id=catalogue_id,
            skip=skip,
            limit=limit,
            sort=sort,
        )
        return result
    except Exception as e:
        logger.error(f"Error listing all landing products: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=LandingProductResponse)
async def get_landing_product(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Landing product not found")
    return result


@router.post("", response_model=LandingProductResponse, status_code=201)
async def create_landing_product(
    data: LandingProductCreate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create landing product")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating landing product: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[LandingProductResponse], status_code=201)
async def batch_create_landing_products(
    request: LandingProductBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    results = []
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/{id}", response_model=LandingProductResponse)
async def update_landing_product(
    id: int,
    data: LandingProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
    result = await service.update(id, update_dict)
    if not result:
        raise HTTPException(status_code=404, detail="Landing product not found")
    return result


@router.put("/batch", response_model=List[LandingProductResponse])
async def batch_update_landing_products(
    request: LandingProductBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    results = []
    try:
        for item in request.items:
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.delete("/batch")
async def batch_delete_landing_products(
    request: LandingProductBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    deleted_count = 0
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        return {"message": f"Successfully deleted {deleted_count} landing products", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_landing_product(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    service = LandingProductService(db)
    success = await service.delete(id)
    if not success:
        raise HTTPException(status_code=404, detail="Landing product not found")
    return {"message": "Landing product deleted successfully", "id": id}