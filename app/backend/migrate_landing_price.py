"""Migration: Add price column to landing_products table (SQLite-compatible)."""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.database import db_manager
from sqlalchemy import text


async def run_migration():
    try:
        await db_manager.init_db()
        await db_manager.create_tables()

        dialect = db_manager.engine.dialect.name
        print(f"Database dialect: {dialect}")

        if dialect == "sqlite":
            # Check if column exists via PRAGMA
            async with db_manager.engine.begin() as conn:
                result = await conn.execute(text("PRAGMA table_info(landing_products)"))
                columns = [row[1] for row in result.fetchall()]
                print(f"Existing columns: {columns}")

                if "price" not in columns:
                    print("Adding price column...")
                    await conn.execute(text(
                        "ALTER TABLE landing_products ADD COLUMN price FLOAT"
                    ))
                    print("price column added successfully.")
                else:
                    print("price column already exists.")

        elif dialect == "postgresql":
            async with db_manager.engine.begin() as conn:
                check = await conn.execute(text(
                    "SELECT column_name FROM information_schema.columns "
                    "WHERE table_name = 'landing_products' AND column_name = 'price'"
                ))
                if check.fetchone() is None:
                    print("Adding price column...")
                    await conn.execute(text(
                        "ALTER TABLE landing_products ADD COLUMN price DOUBLE PRECISION"
                    ))
                    print("price column added successfully.")
                else:
                    print("price column already exists.")
        else:
            print(f"Unsupported dialect: {dialect}")

        print("\nMigration completed successfully!")

    except Exception as e:
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await db_manager.close_db()


if __name__ == "__main__":
    asyncio.run(run_migration())