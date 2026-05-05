"""Migration: Add content_value column to site_content table and populate it."""
import logging
from sqlalchemy import text
from core.database import get_db, db_manager
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["migration"])


@router.post("/migrate-site-content")
async def migrate_site_content(db: AsyncSession = Depends(get_db)):
    """Add content_value column to site_content if missing, then populate data."""
    results = {"steps": []}

    try:
        # Step 1: Check if content_value column exists
        check_col = text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name = 'site_content' AND column_name = 'content_value'"
        )
        col_result = await db.execute(check_col)
        col_exists = col_result.fetchone() is not None

        if not col_exists:
            # Add column as nullable first
            await db.execute(text(
                "ALTER TABLE site_content ADD COLUMN content_value VARCHAR"
            ))
            await db.commit()
            results["steps"].append("Added content_value column (nullable)")
            logger.info("Added content_value column as nullable")
        else:
            results["steps"].append("content_value column already exists")

        # Step 2: Populate site_content data (upsert by content_key)
        site_data = [
            {
                "content_key": "hero",
                "content_value": '{"backgroundImage":"https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80","subtitle":"ПАРФЮМ НА РАСПИВ","headingLine1":"Мир элитных","headingLine2":"ароматов","description":"Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте легендарные ароматы от 2 мл.","buttonText":"Смотреть каталог","buttonLink":"/catalogue"}'
            },
            {
                "content_key": "section_headings",
                "content_value": '{"categories":"Категории","featured":"Хиты продаж","newArrivals":"Новинки","about":"О нас"}'
            },
            {
                "content_key": "about",
                "content_value": '{"cards":[{"icon":"🧪","title":"Оригинальная продукция","desc":"Все отливанты создаются исключительно из оригинальных флаконов с сертификатами подлинности"},{"icon":"📦","title":"Безопасная упаковка","desc":"Каждый отливант разливается в стерильные стеклянные флаконы с распылителем"},{"icon":"🚚","title":"Доставка по Беларуси","desc":"Отправляем заказы в любой город Беларуси. Бесплатная доставка от 100 BYN"},{"icon":"💎","title":"Более 950 ароматов","desc":"Нишевая, люксовая и селективная парфюмерия от мировых брендов"}],"title":"1000 Ароматов","description1":"Мы — магазин парфюмерии на распив, который предлагает вам возможность познакомиться с элитными ароматами без необходимости покупать полный флакон. Каждый отливант разливается из оригинального флакона в стерильные условия с соблюдением всех стандартов качества.","description2":"В нашем каталоге более 950 ароматов от ведущих мировых брендов: нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность каждого флакона и бережную доставку по всей Беларуси.","location":"Минск, Беларусь","phone":"+375 (29) 123-45-67","email":"info@1000aromatov.by","workingHours":"Пн–Пт: 10:00–20:00, Сб: 11:00–18:00","mapUrl":"https://www.openstreetmap.org/export/embed.html?bbox=27.4%2C53.85%2C27.7%2C53.97&layer=mapnik"}'
            },
            {
                "content_key": "footer",
                "content_value": '{"brandDescription":"Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы от 2 мл с доставкой по всей Беларуси.","telegram":"@1000aromatov","viber":"+375 (29) 123-45-67","instagram":"@1000aromatov","email":"info@1000aromatov.by","phone":"+375 (29) 123-45-67","copyright":"© 2026 1000 АРОМАТОВ. Все права защищены.","privacyPolicyText":"Политика конфиденциальности","offerText":"Оферта"}'
            }
        ]

        for item in site_data:
            # Check if this content_key already exists with a value
            check = text(
                "SELECT id FROM site_content WHERE content_key = :key AND content_value IS NOT NULL AND content_value != ''"
            )
            existing = await db.execute(check, {"key": item["content_key"]})
            if existing.fetchone():
                results["steps"].append(f"Skipped {item['content_key']} (already has content_value)")
                continue

            # Update existing row or insert new
            update_sql = text(
                "UPDATE site_content SET content_value = :value WHERE content_key = :key"
            )
            result = await db.execute(update_sql, {"value": item["content_value"], "key": item["content_key"]})
            
            if result.rowcount == 0:
                # No row with this key, insert new
                insert_sql = text(
                    "INSERT INTO site_content (content_key, content_value) VALUES (:key, :value)"
                )
                await db.execute(insert_sql, {"key": item["content_key"], "value": item["content_value"]})
                results["steps"].append(f"Inserted {item['content_key']}")
            else:
                results["steps"].append(f"Updated {item['content_key']}")

        await db.commit()
        results["status"] = "success"
        logger.info("Site content migration completed successfully")

    except Exception as e:
        await db.rollback()
        logger.error(f"Migration failed: {e}")
        results["status"] = "error"
        results["error"] = str(e)

    return results