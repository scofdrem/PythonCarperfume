// Dynamic Brand Store — brands are derived exclusively from product data
// No hardcoded brand lists; all brands come from product.brand field
// Reactive: components subscribe via useDynamicBrands hook
// Persisted to localStorage for performance

import { useState, useCallback, useEffect } from "react";
import { products as staticProducts, type Product } from "@/data/products";

export interface DynamicBrand {
  name: string;
  slug: string;
}

const STORAGE_KEY = "dynamic_brands_cache";

function brandToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function extractBrands(productList: Product[]): DynamicBrand[] {
  const seen = new Map<string, string>(); // lowercase name -> original name
  for (const p of productList) {
    const trimmed = p.brand?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, trimmed);
    }
  }
  return Array.from(seen.entries())
    .map(([, name]) => ({ name, slug: brandToSlug(name) }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru", { sensitivity: "base" }));
}

// Initialize from localStorage or derive from static products
function loadInitialBrands(): DynamicBrand[] {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return extractBrands(staticProducts);
}

let currentBrands: DynamicBrand[] = loadInitialBrands();
const listeners: Set<() => void> = new Set();

function persistBrands(brands: DynamicBrand[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  } catch {
    // ignore storage errors
  }
}

export function getDynamicBrands(): DynamicBrand[] {
  return currentBrands;
}

/** Rebuild brand list from a product array and notify all subscribers */
export function rebuildBrandsFromProducts(productList: Product[]): DynamicBrand[] {
  const newBrands = extractBrands(productList);
  currentBrands = newBrands;
  persistBrands(newBrands);
  listeners.forEach((fn) => fn());
  return newBrands;
}

/** React hook — subscribes to brand list changes */
export function useDynamicBrands(): {
  brands: DynamicBrand[];
  rebuild: (products: Product[]) => void;
} {
  const [brands, setBrands] = useState<DynamicBrand[]>(currentBrands);

  // Subscribe on mount, unsubscribe on unmount
  useEffect(() => {
    const handler = () => setBrands([...currentBrands]);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const rebuild = useCallback((productList: Product[]) => {
    rebuildBrandsFromProducts(productList);
  }, []);

  return { brands, rebuild };
}