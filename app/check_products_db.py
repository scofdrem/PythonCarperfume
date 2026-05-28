import asyncio
import sys
sys.path.insert(0, "backend")

from core.database import AsyncSessionLocal
from models.products import Products
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Products))
        products = result.scalars().all()
        print(f'Total products: {len(products)}')
        for p in products:
            print(f'  {p.id}: {p.name} ({p.brand}), price={p.price}')

if __name__ == "__main__":
    asyncio.run(main())