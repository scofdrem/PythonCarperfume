export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  gender: "women" | "men" | "unisex";
  volumes: number[];
  priceRange: [number, number];
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Brand {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  image: string;
}

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24hyqaaflq/hero-banner-luxury-perfume.png";
const PROD_1 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24dnyaafna/product-featured-perfume-1.png";
const PROD_2 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24fpiaafnq/product-featured-perfume-2.png";
const PROD_3 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24efyaafma/product-featured-perfume-3.png";

export const heroImage = HERO_IMG;

export const categories: Category[] = [
  { name: "Отливанты", slug: "decants", count: 950, image: PROD_1 },
  { name: "Женская", slug: "women", count: 6700, image: PROD_2 },
  { name: "Мужская", slug: "men", count: 5400, image: PROD_3 },
  { name: "Нишевая", slug: "niche", count: 4100, image: PROD_1 },
  { name: "Люксовая", slug: "luxury", count: 4000, image: PROD_2 },
  { name: "Унисекс", slug: "unisex", count: 3850, image: PROD_3 },
];

export const brands: Brand[] = [
  { name: "Byredo", slug: "byredo" },
  { name: "Tom Ford", slug: "tom-ford" },
  { name: "By KILIAN", slug: "kilian" },
  { name: "Nishane", slug: "nishane" },
  { name: "Ex Nihilo", slug: "ex-nihilo" },
  { name: "Mancera", slug: "mancera" },
  { name: "Montale", slug: "montale" },
  { name: "Jo Malone London", slug: "jo-malone" },
  { name: "Maison Francis Kurkdjian", slug: "mfk" },
  { name: "Le Labo", slug: "le-labo" },
  { name: "Juliette Has A Gun", slug: "jhag" },
  { name: "Xerjoff", slug: "xerjoff" },
  { name: "Essential Parfums", slug: "essential-parfums" },
  { name: "Zadig & Voltaire", slug: "zadig-voltaire" },
  { name: "Chloé", slug: "chloe" },
  { name: "Burberry", slug: "burberry" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Bois Imperial",
    brand: "Essential Parfums",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [15, 519],
    image: PROD_1,
    isFeatured: true,
  },
  {
    id: 2,
    name: "This is Her!",
    brand: "Zadig & Voltaire",
    category: "women",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [14, 210],
    image: PROD_2,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Atelier des Fleurs Cedrus",
    brand: "Chloé",
    category: "luxury",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [30, 450],
    image: PROD_3,
    isFeatured: true,
  },
  {
    id: 4,
    name: "Angel's Share",
    brand: "By KILIAN",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [35, 1073],
    image: PROD_1,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Spiky Muse",
    brand: "Ex Nihilo",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [35, 525],
    image: PROD_2,
    isFeatured: true,
  },
  {
    id: 6,
    name: "Toy 2",
    brand: "Moschino",
    category: "women",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [10, 350],
    image: PROD_3,
    isFeatured: true,
  },
  {
    id: 7,
    name: "Not a Perfume",
    brand: "Juliette Has A Gun",
    category: "niche",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [10, 280],
    image: PROD_1,
    isFeatured: true,
  },
  {
    id: 8,
    name: "Hundred Silent Ways",
    brand: "Nishane",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [24, 580],
    image: PROD_2,
    isFeatured: true,
  },
  {
    id: 9,
    name: "Musk Kashmir",
    brand: "Attar Collection",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [12, 320],
    image: PROD_3,
    isFeatured: true,
  },
  {
    id: 10,
    name: "Bal D'Afrique",
    brand: "Byredo",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [21, 490],
    image: PROD_1,
    isFeatured: true,
  },
  {
    id: 11,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 200],
    priceRange: [28, 1536],
    image: PROD_2,
    isFeatured: true,
  },
  {
    id: 12,
    name: "Ganymede",
    brand: "Marc-Antoine Barrois",
    category: "niche",
    gender: "men",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [25, 610],
    image: PROD_3,
    isFeatured: true,
  },
  {
    id: 13,
    name: "Melody Of The Sun",
    brand: "Mancera",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 60, 120],
    priceRange: [12, 375],
    image: PROD_1,
    isNew: true,
  },
  {
    id: 14,
    name: "The One For Men",
    brand: "Dolce & Gabbana",
    category: "luxury",
    gender: "men",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [10, 312],
    image: PROD_2,
    isNew: true,
  },
  {
    id: 15,
    name: "Banana Rush",
    brand: "Juliette Has A Gun",
    category: "niche",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [12, 180],
    image: PROD_3,
    isNew: true,
  },
  {
    id: 16,
    name: "Néroli Amara",
    brand: "Van Cleef & Arpels",
    category: "luxury",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [30, 450],
    image: PROD_1,
    isNew: true,
  },
  {
    id: 17,
    name: "Another 13",
    brand: "Le Labo",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [40, 1536],
    image: PROD_2,
    isNew: true,
  },
  {
    id: 18,
    name: "Crush",
    brand: "Akro",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [15, 225],
    image: PROD_3,
    isNew: true,
  },
  {
    id: 19,
    name: "Limoncello Kiss",
    brand: "Antonio Maretti",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30],
    priceRange: [19, 285],
    image: PROD_1,
    isNew: true,
  },
  {
    id: 20,
    name: "Prive Thé Yulong",
    brand: "Giorgio Armani",
    category: "luxury",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [22, 953],
    image: PROD_2,
    isNew: true,
  },
  {
    id: 21,
    name: "Red Tobacco",
    brand: "Mancera",
    category: "niche",
    gender: "men",
    volumes: [2, 3, 5, 10, 15, 20, 30, 60, 120],
    priceRange: [12, 380],
    image: PROD_3,
    isFeatured: true,
  },
  {
    id: 22,
    name: "No.4 Après L'amour",
    brand: "Thomas Kosmala",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [14, 340],
    image: PROD_1,
    isFeatured: true,
  },
  {
    id: 23,
    name: "Kirke",
    brand: "Tiziana Terenzi",
    category: "niche",
    gender: "women",
    volumes: [2, 3, 5, 10, 15, 20, 30, 100],
    priceRange: [15, 420],
    image: PROD_2,
    isFeatured: true,
  },
  {
    id: 24,
    name: "Blue Talisman",
    brand: "Ex Nihilo",
    category: "niche",
    gender: "unisex",
    volumes: [2, 3, 5, 10, 15, 20, 30, 50, 100],
    priceRange: [35, 525],
    image: PROD_3,
    isFeatured: true,
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newProducts = products.filter((p) => p.isNew);