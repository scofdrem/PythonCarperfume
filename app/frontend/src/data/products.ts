export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  volumes: number[];
  image: string;
  description?: string;
  instagramUrl?: string;
  refillable?: boolean;
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
  image: string;
}

const HERO_IMG = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24hyqaaflq/hero-banner-luxury-perfume.png";
const PROD_1 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24dnyaafna/product-featured-perfume-1.png";
const PROD_2 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24fpiaafnq/product-featured-perfume-2.png";
const PROD_3 = "https://mgx-backend-cdn.metadl.com/generate/images/1170518/2026-05-03/nz24efyaafma/product-featured-perfume-3.png";

export const heroImage = HERO_IMG;

export const categories: Category[] = [];

export const brands: Brand[] = [
  { name: "PlaceholderBrand1", slug: "placeholderbrand1" },
  { name: "PlaceholderBrand2", slug: "placeholderbrand2" },
  { name: "PlaceholderBrand3", slug: "placeholderbrand3" },
  { name: "PlaceholderBrand4", slug: "placeholderbrand4" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Ocean Breeze Hanging Freshener",
    brand: "PlaceholderBrand1",
    category: "Hanging Air Freshener",
    price: 12.99,
    volumes: [0, 10, 20, 30],
    image: PROD_1,
    description: "Refreshing ocean scent for your car",
    instagramUrl: "https://instagram.com",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Vent Clip Lavender",
    brand: "PlaceholderBrand2",
    category: "Vent Clip Freshener",
    price: 9.99,
    volumes: [0, 15, 25, 35],
    image: PROD_2,
    description: "Calming lavender fragrance",
    instagramUrl: "https://instagram.com",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Gel Freshener Citrus",
    brand: "PlaceholderBrand3",
    category: "Gel Freshener",
    price: 7.99,
    volumes: [0, 50, 100, 150],
    image: PROD_3,
    description: "Long-lasting citrus gel",
    instagramUrl: "https://instagram.com",
    isFeatured: true,
  },
  {
    id: 4,
    name: "Car Diffusor Wood",
    brand: "PlaceholderBrand4",
    category: "Diffusor",
    price: 19.99,
    volumes: [0, 10, 20, 30],
    image: PROD_1,
    description: "Elegant wooden diffusor",
    instagramUrl: "https://instagram.com",
    isFeatured: true,
    refillable: true,
  },
  {
    id: 5,
    name: "Solid Freshener Vanilla",
    brand: "PlaceholderBrand1",
    category: "Solid Freshener",
    price: 6.99,
    volumes: [0, 30, 60, 90],
    image: PROD_2,
    description: "Sweet vanilla solid freshener",
    instagramUrl: "https://instagram.com",
    isFeatured: true,
  },
  {
    id: 6,
    name: "Pine Forest Hanging",
    brand: "PlaceholderBrand2",
    category: "Hanging Air Freshener",
    price: 11.99,
    volumes: [0, 10, 20, 30],
    image: PROD_3,
    description: "Natural pine forest scent",
    instagramUrl: "https://instagram.com",
    isNew: true,
  },
  {
    id: 7,
    name: "Vent Clip Ocean",
    brand: "PlaceholderBrand3",
    category: "Vent Clip Freshener",
    price: 8.99,
    volumes: [0, 15, 25, 35],
    image: PROD_1,
    description: "Fresh ocean breeze",
    instagramUrl: "https://instagram.com",
    isNew: true,
  },
  {
    id: 8,
    name: "Gel Freshener Lavender",
    brand: "PlaceholderBrand4",
    category: "Gel Freshener",
    price: 6.99,
    volumes: [0, 50, 100, 150],
    image: PROD_2,
    description: "Soothing lavender gel",
    instagramUrl: "https://instagram.com",
    isNew: true,
  },
  {
    id: 9,
    name: "Premium Diffusor Rose",
    brand: "PlaceholderBrand1",
    category: "Diffusor",
    price: 24.99,
    volumes: [0, 10, 20, 30],
    image: PROD_3,
    description: "Luxury rose diffusor",
    instagramUrl: "https://instagram.com",
    isNew: true,
    refillable: true,
  },
  {
    id: 10,
    name: "Solid Freshener Mint",
    brand: "PlaceholderBrand2",
    category: "Solid Freshener",
    price: 5.99,
    volumes: [0, 30, 60, 90],
    image: PROD_1,
    description: "Cool mint freshener",
    instagramUrl: "https://instagram.com",
    isNew: true,
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newProducts = products.filter((p) => p.isNew);