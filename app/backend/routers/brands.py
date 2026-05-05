import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.brands import BrandsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/brands", tags=["brands"])


# ---------- Pydantic Schemas ----------
class BrandsData(BaseModel):
    """Entity data schema (for create/update)"""
    name: str
    slug: str


class BrandsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    name: Optional[str] = None
    slug: Optional[str] = None


class BrandsResponse(BaseModel):
    """Entity response schema"""
    id: int
    name: str
    slug: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BrandsListResponse(BaseModel):
    """List response schema"""
    items: List[BrandsResponse]
    total: int
    skip: int
    limit: int


class BrandsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[BrandsData]


class BrandsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: BrandsUpdateData


class BrandsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[BrandsBatchUpdateItem]


class BrandsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=BrandsListResponse)
async def query_brandss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query brandss with filtering, sorting, and pagination"""
    logger.debug(f"Querying brandss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = BrandsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} brandss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying brandss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=BrandsListResponse)
async def query_brandss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query brandss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying brandss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = BrandsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} brandss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying brandss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=BrandsResponse)
async def get_brands(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single brands by ID"""
    logger.debug(f"Fetching brands with id: {id}, fields={fields}")
    
    service = BrandsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Brands with id {id} not found")
            raise HTTPException(status_code=404, detail="Brands not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching brands {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=BrandsResponse, status_code=201)
async def create_brands(
    data: BrandsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new brands"""
    logger.debug(f"Creating new brands with data: {data}")
    
    service = BrandsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create brands")
        
        logger.info(f"Brands created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating brands: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating brands: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[BrandsResponse], status_code=201)
async def create_brandss_batch(
    request: BrandsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple brandss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} brandss")
    
    service = BrandsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} brandss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[BrandsResponse])
async def update_brandss_batch(
    request: BrandsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple brandss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} brandss")
    
    service = BrandsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} brandss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=BrandsResponse)
async def update_brands(
    id: int,
    data: BrandsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing brands"""
    logger.debug(f"Updating brands {id} with data: {data}")

    service = BrandsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Brands with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Brands not found")
        
        logger.info(f"Brands {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating brands {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating brands {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_brandss_batch(
    request: BrandsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple brandss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} brandss")
    
    service = BrandsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} brandss successfully")
        return {"message": f"Successfully deleted {deleted_count} brandss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_brands(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single brands by ID"""
    logger.debug(f"Deleting brands with id: {id}")
    
    service = BrandsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Brands with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Brands not found")
        
        logger.info(f"Brands {id} deleted successfully")
        return {"message": "Brands deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting brands {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")