# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> AromaAromas Application >> Homepage >> should display hero section
- Location: tests\e2e\app.spec.ts:24:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('[class*="hero"], [class*="banner"], main > div, section').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[class*="hero"], [class*="banner"], main > div, section').first()
    - locator resolved to <section tabindex="-1" aria-live="polite" aria-atomic="false" aria-relevant="additions text" aria-label="Notifications alt+T"></section>
    - unexpected value "hidden"

```

```yaml
- region "Notifications alt+T"
- banner:
  - link "1000 АРОМАТОВ 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ":
    - /url: /
    - img "1000 АРОМАТОВ"
    - text: 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ
  - navigation:
    - link "Каталог":
      - /url: /catalogue
    - link "Бренды":
      - /url: /catalogue?tab=brands
    - link "О нас":
      - /url: /#about
- main:
  - img "Luxury perfumes"
  - img "1000 Ароматов"
  - paragraph: ПАРФЮМ НА РАСПИВ
  - heading "Мир элитных ароматов" [level=1]
  - paragraph: Откройте для себя коллекцию нишевых и люксовых парфюмов в формате отливантов. Попробуйте легендарные ароматы от 2 мл.
  - link "Смотреть каталог":
    - /url: /catalogue
  - heading "Категории" [level=2]
  - link "Отливанты Отливанты":
    - /url: /catalogue?category=decants
    - img "Отливанты"
    - heading "Отливанты" [level=3]
  - link "Женская Женская":
    - /url: /catalogue?category=women
    - img "Женская"
    - heading "Женская" [level=3]
  - link "Мужская Мужская":
    - /url: /catalogue?category=men
    - img "Мужская"
    - heading "Мужская" [level=3]
  - link "Нишевая Нишевая":
    - /url: /catalogue?category=niche
    - img "Нишевая"
    - heading "Нишевая" [level=3]
  - link "Люксовая Люксовая":
    - /url: /catalogue?category=luxury
    - img "Люксовая"
    - heading "Люксовая" [level=3]
  - link "Унисекс Унисекс":
    - /url: /catalogue?category=unisex
    - img "Унисекс"
    - heading "Унисекс" [level=3]
  - heading "Хиты продаж" [level=2]
  - link "Все ароматы →":
    - /url: /catalogue
  - img "Bois Imperial"
  - paragraph: Essential Parfums
  - heading "Bois Imperial" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Древесный унисекс-аромат с яркими нотами бобов тонка, ветивера и амброксана. Идеальный выбор для тех, кто ценит элегантность и утончённость в каждом вдохе.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "This is Her!"
  - paragraph: Zadig & Voltaire
  - heading "This is Her!" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Роковой женский аромат с нотами розового перца, жасмина и кашемирового дерева. Чувственный и современный, он подчёркивает индивидуальность.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Atelier des Fleurs Cedrus"
  - paragraph: Chloé
  - heading "Atelier des Fleurs Cedrus" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Изысканный цветочный аромат от Chloé с нотами кедра и пионов. Нежный и утончённый, он переносит в атмосферу цветущего сада.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Angel's Share"
  - paragraph: By KILIAN
  - heading "Angel's Share" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Тёплый коньячный аромат с нотами корицы, дуба и пралине. Вдохновлён ирландскими традициями вискикурения — роскошь в каждой капле.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Spiky Muse"
  - paragraph: Ex Nihilo
  - heading "Spiky Muse" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Дерзкий и провокационный аромат с нотами чёрной смородины, розы и пачули. Для тех, кто не боится выделяться из толпы.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Toy 2"
  - paragraph: Moschino
  - heading "Toy 2" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Игривый и кокетливый аромат с нотами яблока, магнолии и белой амбры. Олицетворяет юность и беззаботную радость жизни.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Not a Perfume"
  - paragraph: Juliette Has A Gun
  - heading "Not a Perfume" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Минималистичный аромат на основе единственной ноты — кетала. Чистый, лаконичный и невероятно притягательный, он звучит уникально на каждом.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Hundred Silent Ways"
  - paragraph: Nishane
  - heading "Hundred Silent Ways" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Глубокий восточный аромат с нотами туберозы, иланга и сандала. Многогранный и обволакивающий, он раскрывается постепенно.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - heading "Новинки" [level=2]
  - link "Все новинки →":
    - /url: /catalogue?filter=new
  - img "Melody Of The Sun"
  - text: Новинка
  - paragraph: Mancera
  - heading "Melody Of The Sun" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Солнечный и энергичный аромат с нотами кокоса, ванили и белого мускуса. Идеальный компаньон для тёплых летних дней.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "The One For Men"
  - text: Новинка
  - paragraph: Dolce & Gabbana
  - heading "The One For Men" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Классический мужской аромат с нотами кардамона, имбиря и амбры. Уверенный и харизматичный — для настоящего джентльмена.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Banana Rush"
  - text: Новинка
  - paragraph: Juliette Has A Gun
  - heading "Banana Rush" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Весёлый и необычный аромат с нотами банана, жасмина и сандала. Сладкий, но не приторный — настоящий праздник для чувств.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Néroli Amara"
  - text: Новинка
  - paragraph: Van Cleef & Arpels
  - heading "Néroli Amara" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Утончённый цитрусовый аромат с нотами нероли, петитгрейна и мускуса. Элегантный и свежий, он подчёркивает безупречный вкус.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Another 13"
  - text: Новинка
  - paragraph: Le Labo
  - heading "Another 13" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Загадочный и притягательный аромат с нотами амбретты, жасмина и мускуса. Культовый нишевый аромат с характером.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Crush"
  - text: Новинка
  - paragraph: Akro
  - heading "Crush" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Страстный аромат с нотами малины, розы и пачули. Влюбляет с первого вдоха и не отпускает — настоящая парфюмерная страсть.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Limoncello Kiss"
  - text: Новинка
  - paragraph: Antonio Maretti
  - heading "Limoncello Kiss" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Яркий цитрусовый аромат с нотами лимончелло, бергамота и ванили. Как итальянское лето в одном флаконе — солнечно и радостно.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - img "Prive Thé Yulong"
  - text: Новинка
  - paragraph: Giorgio Armani
  - heading "Prive Thé Yulong" [level=3]
  - button "5 мл"
  - button "10 мл"
  - button "15 мл"
  - button "20 мл"
  - button "25 мл"
  - button "30 мл"
  - button "Уточнить наличие":
    - img
    - text: Уточнить наличие
  - button "Подробнее":
    - text: Подробнее
    - img
  - paragraph: Умиротворяющий аромат с нотами зелёного чая, жасмина и мускуса. Гармония и спокойствие в каждом вдохе, вдохновлён китайским чаем Юлун.
  - link "Обзор в Instagram":
    - /url: https://instagram.com
    - img
    - text: Обзор в Instagram
  - heading "О нас" [level=2]
  - link "Оригинальная продукция Оригинальная продукция":
    - /url: /catalogue
    - img "Оригинальная продукция"
    - heading "Оригинальная продукция" [level=3]
  - link "Безопасная упаковка Безопасная упаковка":
    - /url: /catalogue
    - img "Безопасная упаковка"
    - heading "Безопасная упаковка" [level=3]
  - link "Доставка по Беларуси Доставка по Беларуси":
    - /url: /catalogue
    - img "Доставка по Беларуси"
    - heading "Доставка по Беларуси" [level=3]
  - link "Более 950 ароматов Более 950 ароматов":
    - /url: /catalogue
    - img "Более 950 ароматов"
    - heading "Более 950 ароматов" [level=3]
  - heading "1000 Ароматов" [level=3]
  - paragraph: Мы — магазин парфюмерии на распив, который предлагает вам возможность познакомиться с элитными ароматами без необходимости покупать полный флакон. Каждый отливант разливается из оригинального флакона в стерильные условия с соблюдением всех стандартов качества.
  - paragraph: "В нашем каталоге более 950 ароматов от ведущих мировых брендов: нишевая, люксовая и селективная парфюмерия. Мы гарантируем подлинность каждого флакона и бережную доставку по всей Беларуси."
  - text: "📍 Минск, Беларусь 📞 +375 (29) 123-45-67 ✉️ info@1000aromatov.by 🕐 Пн–Пт: 10:00–20:00, Сб: 11:00–18:00"
  - iframe
- contentinfo:
  - link "1000 АРОМАТОВ 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ":
    - /url: /
    - img "1000 АРОМАТОВ"
    - text: 1000 АРОМАТОВ ПАРФЮМ НА РАСПИВ
  - paragraph: Интернет-магазин отливантов элитной парфюмерии. Оригинальные ароматы от 2 мл с доставкой по всей Беларуси.
  - heading "Навигация" [level=4]
  - list:
    - listitem:
      - link "Каталог":
        - /url: /catalogue
    - listitem:
      - link "Хиты продаж":
        - /url: /catalogue?filter=featured
    - listitem:
      - link "Новинки":
        - /url: /catalogue?filter=new
    - listitem:
      - link "О нас":
        - /url: /#about
  - heading "Бренды" [level=4]
  - list:
    - listitem:
      - link "Akro":
        - /url: /catalogue?brand=akro
    - listitem:
      - link "Antonio Maretti":
        - /url: /catalogue?brand=antonio-maretti
    - listitem:
      - link "Attar Collection":
        - /url: /catalogue?brand=attar-collection
    - listitem:
      - link "By KILIAN":
        - /url: /catalogue?brand=by-kilian
    - listitem:
      - link "Byredo":
        - /url: /catalogue?brand=byredo
    - listitem:
      - link "Chloé":
        - /url: /catalogue?brand=chlo
    - listitem:
      - link "Dolce & Gabbana":
        - /url: /catalogue?brand=dolce-and-gabbana
    - listitem:
      - link "Essential Parfums":
        - /url: /catalogue?brand=essential-parfums
  - heading "Контакты" [level=4]
  - list:
    - listitem:
      - text: "Telegram:"
      - link "@1000aromatov":
        - /url: https://t.me/1000aromatov
    - listitem:
      - text: "Viber:"
      - link "+375 (29) 123-45-67":
        - /url: viber://chat?number=+375291234567
    - listitem:
      - text: "Instagram:"
      - link "@1000aromatov":
        - /url: https://instagram.com/1000aromatov
    - listitem:
      - text: "Email:"
      - link "info@1000aromatov.by":
        - /url: mailto:info@1000aromatov.by
  - link:
    - /url: https://t.me/1000aromatov
    - img
  - link:
    - /url: viber://chat?number=+375291234567
    - img
  - link:
    - /url: https://instagram.com/1000aromatov
    - img
  - paragraph: © 2026 1000 АРОМАТОВ. Все права защищены.
  - link "Политика конфиденциальности":
    - /url: "#"
  - link "Оферта":
    - /url: "#"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * E2E Tests for AromaAromas Frontend Application
  5   |  *
  6   |  * These tests verify the core functionality of the application
  7   |  * including navigation, user interactions, and API integration.
  8   |  */
  9   | 
  10  | test.describe('AromaAromas Application', () => {
  11  | 
  12  |   test.describe('Homepage', () => {
  13  | 
  14  |     test('should load the homepage successfully', async ({ page }) => {
  15  |       await page.goto('/');
  16  | 
  17  |       // Check page loaded - body should be visible
  18  |       await expect(page.locator('body')).toBeVisible();
  19  | 
  20  |       // Check for main navigation
  21  |       await expect(page.locator('header, nav')).toBeVisible();
  22  |     });
  23  | 
  24  |     test('should display hero section', async ({ page }) => {
  25  |       await page.goto('/');
  26  | 
  27  |       // Check for hero banner content
  28  |       const heroBanner = page.locator('[class*="hero"], [class*="banner"], main > div, section').first();
> 29  |       await expect(heroBanner).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
  30  |     });
  31  | 
  32  |     test('should have working navigation links', async ({ page }) => {
  33  |       await page.goto('/');
  34  | 
  35  |       // Find and check navigation links exist
  36  |       const navLinks = page.locator('header a, nav a');
  37  |       await expect(navLinks).not.toHaveCount(0);
  38  |     });
  39  |   });
  40  | 
  41  |   test.describe('Catalogue', () => {
  42  | 
  43  |     test('should navigate to catalogue page', async ({ page }) => {
  44  |       await page.goto('/');
  45  | 
  46  |       // Click on catalogue link in navigation (text could be "Каталог" or similar)
  47  |       const catalogueLink = page.locator('a[href="/catalogue"]');
  48  |       if (await catalogueLink.count() > 0 && await catalogueLink.isVisible()) {
  49  |         await catalogueLink.click();
  50  |         await expect(page).toHaveURL(/.*catalogue.*/);
  51  |       } else {
  52  |         // Direct navigation fallback
  53  |         await page.goto('/catalogue');
  54  |         await expect(page).toHaveURL(/.*catalogue.*/);
  55  |       }
  56  |     });
  57  | 
  58  |     test('should display product cards', async ({ page }) => {
  59  |       await page.goto('/catalogue');
  60  | 
  61  |       // Wait for page to load
  62  |       await page.waitForLoadState('networkidle');
  63  | 
  64  |       // Check for product cards or grid
  65  |       const productCards = page.locator('[class*="card"], [class*="product"], article');
  66  |       // Product cards may be loaded async, so just check the page structure exists
  67  |       await expect(page.locator('main')).toBeVisible();
  68  |     });
  69  | 
  70  |     test('should have search functionality', async ({ page }) => {
  71  |       await page.goto('/catalogue');
  72  | 
  73  |       // Wait for page to load
  74  |       await page.waitForLoadState('networkidle');
  75  | 
  76  |       // Look for search input (Russian placeholder: "Поиск по названию или бренду...")
  77  |       const searchInput = page.locator('input[type="text"], input[placeholder*="Поиск"], input');
  78  |       const count = await searchInput.count();
  79  |       expect(count).toBeGreaterThan(0);
  80  |     });
  81  | 
  82  |     test('should filter products on search', async ({ page }) => {
  83  |       await page.goto('/catalogue');
  84  |       await page.waitForLoadState('networkidle');
  85  | 
  86  |       // Find search input and type
  87  |       const searchInput = page.locator('input[type="text"]').first();
  88  |       if (await searchInput.isVisible()) {
  89  |         await searchInput.fill('test');
  90  |         // Wait for filter to apply
  91  |         await page.waitForTimeout(500);
  92  |         // Results area should still be visible
  93  |         await expect(page.locator('main')).toBeVisible();
  94  |       }
  95  |     });
  96  |   });
  97  | 
  98  |   test.describe('Authentication', () => {
  99  | 
  100 |     test('should have login option in navigation', async ({ page }) => {
  101 |       await page.goto('/');
  102 | 
  103 |       // Look for login link or button (could be admin or OIDC login)
  104 |       const authLink = page.locator('a[href*="login"], a[href*="admin"], button:has-text("Login"), button:has-text("Вход")');
  105 |       // At minimum, the page should load without auth errors
  106 |       await expect(page.locator('body')).toBeVisible();
  107 |     });
  108 | 
  109 |     test('should display admin page', async ({ page }) => {
  110 |       await page.goto('/admin');
  111 | 
  112 |       // Admin page should load (may show login or dashboard)
  113 |       await expect(page.locator('body')).toBeVisible();
  114 |     });
  115 |   });
  116 | 
  117 |   test.describe('Product Detail', () => {
  118 | 
  119 |     test('should navigate to product detail from catalogue', async ({ page }) => {
  120 |       await page.goto('/catalogue');
  121 |       await page.waitForLoadState('networkidle');
  122 | 
  123 |       // Click on first product card if available
  124 |       const firstProduct = page.locator('a[href*="/catalogue/"], a[class*="card"], article a').first();
  125 |       if (await firstProduct.isVisible()) {
  126 |         await firstProduct.click();
  127 |         await page.waitForLoadState('networkidle');
  128 |       }
  129 | 
```