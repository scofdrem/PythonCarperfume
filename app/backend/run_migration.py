"""Standalone migration script to add content_value column and populate site_content data."""
import asyncio
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.database import db_manager


async def run_migration():
    """Run the site_content migration."""
    try:
        await db_manager.init_db()
        await db_manager.create_tables()

        from sqlalchemy import text

        # Step 1: Add content_value column if missing (separate transaction)
        async with db_manager.engine.begin() as conn:
            check_col = text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'site_content' AND column_name = 'content_value'"
            )
            col_result = await conn.execute(check_col)
            col_exists = col_result.fetchone() is not None

            if not col_exists:
                print("Adding content_value column (nullable)...")
                await conn.execute(text(
                    "ALTER TABLE site_content ADD COLUMN content_value VARCHAR"
                ))
                print("Column added successfully.")
            else:
                print("content_value column already exists.")

        # Step 2: Add unique constraint on content_key if missing (separate transaction)
        async with db_manager.engine.begin() as conn:
            check_constraint = text(
                "SELECT constraint_name FROM information_schema.table_constraints "
                "WHERE table_name = 'site_content' AND constraint_type = 'UNIQUE' "
                "AND constraint_name = 'site_content_content_key_key'"
            )
            constraint_result = await conn.execute(check_constraint)
            constraint_exists = constraint_result.fetchone() is not None

            if not constraint_exists:
                print("Adding unique constraint on content_key...")
                # First, handle duplicate content_keys by keeping only the first one
                await conn.execute(text(
                    "DELETE FROM site_content a USING site_content b "
                    "WHERE a.id > b.id AND a.content_key = b.content_key AND a.content_key IS NOT NULL"
                ))
                await conn.execute(text(
                    "ALTER TABLE site_content ADD CONSTRAINT site_content_content_key_key UNIQUE (content_key)"
                ))
                print("Unique constraint added.")
            else:
                print("Unique constraint on content_key already exists.")

        # Step 3: Populate site_content data using UPSERT (separate transaction)
        site_data = [
            {
                "content_key": "hero",
                "content_value": json.dumps({
                    "backgroundImage": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&q=80",
                    "subtitle": "ПАРФЮМ НА РАСПИВ",
                    "headingLine1": "Мир элитных",
                    "headingLine2": "ароматов",
                    "description": "Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте легендарные ароматы от 2 мл.",
                    "buttonText": "Смотреть каталог",
                    "buttonLink": "/catalogue"
                }, ensure_ascii=False)
            },
            {
                "content_key": "section_headings",
                "content_value": json.dumps({
                    "categories": "Категории",
                    "featured": "Хиты продаж",
                    "newArrivals": "Новинки",
                    "about": "О нас"
                }, ensure_ascii=False)
            },
            {
                "content_key": "about",
                "content_value": json.dumps({
                    "cards": [
                        {"icon": "🧪", "title": "Оригинальная продукция", "desc": "Все отливанты создаются исключительно из оригинальных флаконов с сертификатами подлинности"},
                        {"icon": "📦", "title": "Безопасная упаковка", "desc": "Каждый отливант разливается в стерильные стеклянные флаконы с распылителем"},
                        {"icon": "🚚", "title": "Доставка по Беларуси", "desc": "Отправляем заказы в любой город Беларуси. Бесплатная доставка от 100 BYN"},
                        {"icon": "💎", "title": "Более 950 ароматов", "desc": "Нишевая, люксовая и селективная парфюмерия от мировых брендов"}
                    ],
                    "title": "1000 Ароматов",
                    "description1": "Мы — магазин парфюмерии на распив, который предлагает вам возможность познакомиться с элитными ароматами без необходимости покупать полный флакон. Каждый отливант разливается из оригинального флакона в стерильные условия с соблюдением всех стандартов качества.",
                    "description2": "В нашем каталоге более 950 ароматов от ведущих мировых брендов: нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность каждого флакона и бережную доставку по всей Беларуси.",
                    "location": "Минск, Беларусь",
                    "phone": "+375 (29) 123-45-67",
                    "email": "info@1000aromatov.by",
                    "workingHours": "Пн–Пт: 10:00–20:00, Сб: 11:00–18:00",
                    "mapUrl": "https://www.openstreetmap.org/export/embed.html?bbox=27.4%2C53.85%2C27.7%2C53.97&layer=mapnik"
                }, ensure_ascii=False)
            },
            {
                "content_key": "footer",
                "content_value": json.dumps({
                    "brandDescription": "Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы от 2 мл с доставкой по всей Беларуси.",
                    "telegram": "@1000aromatov",
                    "viber": "+375 (29) 123-45-67",
                    "instagram": "@1000aromatov",
                    "email": "info@1000aromatov.by",
                    "phone": "+375 (29) 123-45-67",
                    "copyright": "© 2026 1000 АРОМАТОВ. Все права защищены.",
                    "privacyPolicyText": "Политика конфиденциальности",
                    "offerText": "Оферта"
                }, ensure_ascii=False)
            }
        ]

        async with db_manager.engine.begin() as conn:
            for item in site_data:
                upsert_sql = text(
                    "INSERT INTO site_content (content_key, content_value) VALUES (:key, :value) "
                    "ON CONFLICT (content_key) DO UPDATE SET content_value = EXCLUDED.content_value"
                )
                await conn.execute(upsert_sql, {"key": item["content_key"], "value": item["content_value"]})
                print(f"Upserted {item['content_key']}")

        print("\nMigration completed successfully!")

    except Exception as e:
        print(f"Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await db_manager.close_db()


if __name__ == "__main__":
    asyncio.run(run_migration())