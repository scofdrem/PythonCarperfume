## Design Reference
- Reference site: https://taina.by/ — perfume e-commerce with hero, category grid, product cards, brands, about section
- Logo: "1000 АРОМАТОВ" / "ПАРФЮМ НА РАСПИВ" — geometric perfume bottle icon
- Color palette: Black (#000000), Gold (#C69B56), Dark gray (#1A1A1A), Off-white (#F5F0EB), White (#FFFFFF)
- Typography: Clean sans-serif, wide letter-spacing for headings, elegant and minimal
- Key component styles: Dark luxury aesthetic, gold accents, generous spacing, product cards with hover effects

## Images to Generate
1. hero-banner-luxury-perfume.jpg — Cinematic hero banner with elegant perfume bottles on dark reflective surface, gold lighting, luxury atmosphere (1024x576)
2. product-featured-perfume-1.jpg — Elegant perfume bottle product shot on dark background, warm gold lighting (1024x1024)
3. product-featured-perfume-2.jpg — Luxury perfume bottle product shot on dark background, amber lighting (1024x1024)
4. product-featured-perfume-3.jpg — Premium perfume bottle product shot on dark background, soft lighting (1024x1024)

## Development Tasks
- [x] Copy user logo image to public folder
- [x] Generate hero and product images
- [x] Create src/data/products.ts — mock product data with brands, categories, prices
- [x] Create src/components/Header.tsx — logo, navigation, search icon
- [x] Create src/components/HeroBanner.tsx — hero section with banner image and tagline
- [x] Create src/components/ProductCard.tsx — reusable product card (image, name, brand, volumes, price)
- [x] Create src/components/HomeSections.tsx — CategoryGrid, FeaturedProducts, Brands, NewArrivals, About sections
- [x] Create src/components/Footer.tsx — contacts, social links, service info
- [x] Create src/pages/Index.tsx — assemble homepage from all sections
- [x] Create src/pages/Catalogue.tsx — filterable product grid page with search
- [x] Add age-range filter to Catalogue.tsx
- [x] Add Log In button to Header.tsx
- [x] Update src/App.tsx — add routes for homepage and catalogue
- [x] Update src/index.css — global dark theme styles and custom fonts
- [x] Remove Russia mentions and change currency to Belarusian ruble (BYN)
- [x] Run lint and build, fix any issues
- [x] Update HeroBanner.tsx — integrate uploaded logo into hero banner
- [x] Remove "в корзину" button from ProductCard.tsx
- [x] Add About Us section with map widget to HomeSections.tsx
- [x] Create Admin panel page with CRUD for products (src/pages/Admin.tsx)
- [x] Add Admin route to App.tsx
- [x] Run lint and build, fix any issues
- [x] Remove "количество ароматов" from category cards
- [x] Add "Обзор в Instagram" hyperlink to product cards
- [x] Add description text field on product cards (accordion)
- [x] Create accordion on product cards with "Подробнее" toggle
- [x] Remove "Цена от" / "Цена до" price range filters
- [x] Delete "Популярные Бренды" section from homepage
- [x] Adjust volume range starting at 5 with step by 5 units
- [x] Run lint and build, fix any issues
- [x] Create src/data/siteContent.ts — centralized editable content for Hero, Section Headings, About Us, Footer
- [x] Expand Admin panel with new tabs: Hero Banner, Заголовки, О нас, Подвал
- [x] Add image upload support in Admin panel (file input → base64 data URL)
- [x] Update Footer social icons to Telegram, Viber, Instagram
- [x] Ensure Header (sticky with logo) and Footer render on all pages
- [x] Wire siteContent data to HeroBanner, HomeSections, Footer components
- [x] Run lint and build, fix any issues
- [x] Create backend router for admin account management (email, name, password update)
- [x] Create backend endpoint for feedback email settings (GET/PUT)
- [x] Add Pydantic validation schemas for email, password, and name inputs
- [x] Secure admin endpoints with get_admin_user dependency
- [x] Wire frontend Admin.tsx to backend account and feedback email APIs
- [x] Add CRUD controls for Brands tab in Admin panel (add, edit, delete brands)
- [x] Add CRUD controls for Categories tab in Admin panel (add, edit, delete categories with image)
- [x] Create src/data/brandsStore.ts — dynamic brand store derived from product data with reactive hook
- [x] Wire Admin.tsx to rebuild brands on every productList change via useEffect
- [x] Switch Footer.tsx from static brands import to useDynamicBrands hook
- [x] Catalogue.tsx already uses useDynamicBrands (confirmed)
- [x] Run lint and build, fix any issues