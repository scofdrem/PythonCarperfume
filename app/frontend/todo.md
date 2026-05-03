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