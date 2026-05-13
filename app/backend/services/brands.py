import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.brands import Brands

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class BrandsService:
    """Service layer for Brands operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Brands]:
        """Create a new brands"""
        try:
            obj = Brands(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created brands with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating brands: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Brands]:
        """Get brands by ID"""
        try:
            query = select(Brands).where(Brands.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching brands {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of brandss"""
        try:
            query = select(Brands)
            count_query = select(func.count(Brands.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Brands, field):
                        query = query.where(getattr(Brands, field) == value)
                        count_query = count_query.where(getattr(Brands, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Brands, field_name):
                        query = query.order_by(getattr(Brands, field_name).desc())
                else:
                    if hasattr(Brands, sort):
                        query = query.order_by(getattr(Brands, sort))
            else:
                query = query.order_by(Brands.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching brands list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Brands]:
        """Update brands"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Brands {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated brands {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating brands {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete brands"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Brands {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted brands {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting brands {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Brands]:
        """Get brands by any field"""
        try:
            if not hasattr(Brands, field_name):
                raise ValueError(f"Field {field_name} does not exist on Brands")
            result = await self.db.execute(
                select(Brands).where(getattr(Brands, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching brands by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Brands]:
        """Get list of brandss filtered by field"""
        try:
            if not hasattr(Brands, field_name):
                raise ValueError(f"Field {field_name} does not exist on Brands")
            result = await self.db.execute(
                select(Brands)
                .where(getattr(Brands, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Brands.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching brandss by {field_name}: {str(e)}")
            raise