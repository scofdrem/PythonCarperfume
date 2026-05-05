import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.inquiries import Inquiries

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class InquiriesService:
    """Service layer for Inquiries operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Inquiries]:
        """Create a new inquiries"""
        try:
            obj = Inquiries(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created inquiries with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating inquiries: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Inquiries]:
        """Get inquiries by ID"""
        try:
            query = select(Inquiries).where(Inquiries.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching inquiries {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of inquiriess"""
        try:
            query = select(Inquiries)
            count_query = select(func.count(Inquiries.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Inquiries, field):
                        query = query.where(getattr(Inquiries, field) == value)
                        count_query = count_query.where(getattr(Inquiries, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Inquiries, field_name):
                        query = query.order_by(getattr(Inquiries, field_name).desc())
                else:
                    if hasattr(Inquiries, sort):
                        query = query.order_by(getattr(Inquiries, sort))
            else:
                query = query.order_by(Inquiries.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching inquiries list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Inquiries]:
        """Update inquiries"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Inquiries {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated inquiries {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating inquiries {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete inquiries"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Inquiries {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted inquiries {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting inquiries {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Inquiries]:
        """Get inquiries by any field"""
        try:
            if not hasattr(Inquiries, field_name):
                raise ValueError(f"Field {field_name} does not exist on Inquiries")
            result = await self.db.execute(
                select(Inquiries).where(getattr(Inquiries, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching inquiries by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Inquiries]:
        """Get list of inquiriess filtered by field"""
        try:
            if not hasattr(Inquiries, field_name):
                raise ValueError(f"Field {field_name} does not exist on Inquiries")
            result = await self.db.execute(
                select(Inquiries)
                .where(getattr(Inquiries, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Inquiries.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching inquiriess by {field_name}: {str(e)}")
            raise