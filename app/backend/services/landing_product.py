import logging
from typing import Optional, Dict, Any, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models.landing_product import LandingProduct

logger = logging.getLogger(__name__)


class LandingProductService:
    """Service for LandingProduct operations — scoped to catalogue_id"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[LandingProduct]:
        try:
            obj = LandingProduct(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created landing product with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating landing product: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[LandingProduct]:
        try:
            query = select(LandingProduct).where(LandingProduct.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching landing product {obj_id}: {str(e)}")
            raise

    async def get_list(
        self,
        catalogue_id: int,
        skip: int = 0,
        limit: int = 20,
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list — always scoped to catalogue_id"""
        try:
            query = select(LandingProduct).where(LandingProduct.catalogue_id == catalogue_id)
            count_query = select(func.count(LandingProduct.id)).where(
                LandingProduct.catalogue_id == catalogue_id
            )

            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(LandingProduct, field):
                        query = query.where(getattr(LandingProduct, field) == value)
                        count_query = count_query.where(getattr(LandingProduct, field) == value)

            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(LandingProduct, field_name):
                        query = query.order_by(getattr(LandingProduct, field_name).desc())
                else:
                    if hasattr(LandingProduct, sort):
                        query = query.order_by(getattr(LandingProduct, sort))
            else:
                query = query.order_by(LandingProduct.sort_order.asc(), LandingProduct.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching landing products for catalogue {catalogue_id}: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[LandingProduct]:
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Landing product {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated landing product {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating landing product {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Landing product {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted landing product {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting landing product {obj_id}: {str(e)}")
            raise