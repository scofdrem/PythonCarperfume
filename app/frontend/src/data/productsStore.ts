// Reactive Product & Category Store — similar pattern to siteContent.ts
// Admin panel modifies these values and they persist to the backend
// Components subscribe via useProductStore / useCategoryStore hooks

import { useState, useEffect } from "react";
import {
  products as staticProducts,
  categories as staticCategories,
  brands as staticBrands,
  type Product,
  type Category,
  type Brand,
} from "@/data/products";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
  fetchCategories,
  createCategory as createCategoryApi,
  updateCategoryById,
  deleteCategoryById,
  findCategoryIdBySlug,
} from "@/api/dataService";
import { rebuildBrandsFromProducts } from "@/data/brandsStore";

// ─── Product Store ───

let currentProducts: Product[] = [...staticProducts];
const productListeners: Set<() => void> = new Set();
let productsLoaded = false;

export function getProducts(): Product[] {
  return currentProducts;
}

export function getFeaturedProducts(): Product[] {
  return currentProducts.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return currentProducts.filter((p) => p.isNew);
}

function setProducts(products: Product[]) {
  currentProducts = [...products];
  productListeners.forEach((fn) => fn());
}

/** Load products from backend into the reactive store (call once on app init) */
export async function initProductsFromBackend(): Promise<void> {
  if (productsLoaded) return;
  productsLoaded = true;
  try {
    const data = await fetchProducts();
    currentProducts = data && data.length > 0 ? data : [...staticProducts];
    productListeners.forEach((fn) => fn());
  } catch {
    currentProducts = [...staticProducts];
    productListeners.forEach((fn) => fn());
  }
}

/** Add a product and persist to backend */
export async function addProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    const created = await createProduct(product);
    if (created) {
      setProducts([...currentProducts, created]);
      rebuildBrandsFromProducts(currentProducts);
      return created;
    }
  } catch (e) {
    console.error("Failed to add product:", e);
  }
  return null;
}

/** Update a product and persist to backend */
export async function persistProductUpdate(
  id: number,
  updates: Partial<Product>
): Promise<Product | null> {
  try {
    const updated = await updateProduct(id, updates);
    if (updated) {
      setProducts(
        currentProducts.map((p) => (p.id === id ? updated : p))
      );
      rebuildBrandsFromProducts(currentProducts);
      return updated;
    }
  } catch (e) {
    console.error("Failed to update product:", e);
  }
  return null;
}

/** Delete a product and persist to backend */
export async function persistProductDelete(id: number): Promise<boolean> {
  try {
    const ok = await deleteProductApi(id);
    if (ok) {
      setProducts(currentProducts.filter((p) => p.id !== id));
      rebuildBrandsFromProducts(currentProducts);
      return true;
    }
  } catch (e) {
    console.error("Failed to delete product:", e);
  }
  return false;
}

/** Bulk update products and persist to backend */
export async function persistBulkProductUpdate(
  ids: number[],
  updates: Partial<Product>
): Promise<boolean> {
  let allOk = true;
  const newProducts = [...currentProducts];
  for (let i = 0; i < newProducts.length; i++) {
    if (ids.includes(newProducts[i].id)) {
      const updated = await updateProduct(newProducts[i].id, updates);
      if (updated) {
        newProducts[i] = updated;
      } else {
        // Apply locally even if backend fails
        newProducts[i] = { ...newProducts[i], ...updates };
        allOk = false;
      }
    }
  }
  setProducts(newProducts);
  rebuildBrandsFromProducts(currentProducts);
  return allOk;
}

/** React hook — subscribes to product list changes */
export function useProductStore(): {
  products: Product[];
  featuredProducts: Product[];
  newProducts: Product[];
} {
  const [products, setProductsState] = useState<Product[]>(currentProducts);

  useEffect(() => {
    const handler = () => setProductsState([...currentProducts]);
    productListeners.add(handler);
    return () => {
      productListeners.delete(handler);
    };
  }, []);

  return {
    products,
    featuredProducts: products.filter((p) => p.isFeatured),
    newProducts: products.filter((p) => p.isNew),
  };
}

// ─── Category Store ───

let currentCategories: Category[] = [...staticCategories];
const categoryListeners: Set<() => void> = new Set();
let categoriesLoaded = false;

export function getCategories(): Category[] {
  return currentCategories;
}

function setCategories(categories: Category[]) {
  currentCategories = [...categories];
  categoryListeners.forEach((fn) => fn());
}

/** Load categories from backend into the reactive store (call once on app init) */
export async function initCategoriesFromBackend(): Promise<void> {
  if (categoriesLoaded) return;
  categoriesLoaded = true;
  try {
    const data = await fetchCategories();
    currentCategories = data && data.length > 0 ? data : [...staticCategories];
    categoryListeners.forEach((fn) => fn());
  } catch {
    currentCategories = [...staticCategories];
    categoryListeners.forEach((fn) => fn());
  }
}

/** Add a category and persist to backend */
export async function addCategory(category: Category): Promise<Category | null> {
  try {
    const created = await createCategoryApi(category);
    if (created) {
      setCategories([...currentCategories, created]);
      return created;
    }
  } catch (e) {
    console.error("Failed to add category:", e);
  }
  return null;
}

/** Update a category and persist to backend */
export async function persistCategoryUpdate(
  oldSlug: string,
  updates: Partial<Category>
): Promise<Category | null> {
  try {
    const id = await findCategoryIdBySlug(oldSlug);
    if (id !== null) {
      const updated = await updateCategoryById(id, updates);
      if (updated) {
        setCategories(
          currentCategories.map((c) => (c.slug === oldSlug ? updated : c))
        );
        return updated;
      }
    }
  } catch (e) {
    console.error("Failed to update category:", e);
  }
  return null;
}

/** Delete a category and persist to backend */
export async function persistCategoryDelete(slug: string): Promise<boolean> {
  try {
    const id = await findCategoryIdBySlug(slug);
    if (id !== null) {
      const ok = await deleteCategoryById(id);
      if (ok) {
        setCategories(currentCategories.filter((c) => c.slug !== slug));
        return true;
      }
    }
  } catch (e) {
    console.error("Failed to delete category:", e);
  }
  return false;
}

/** React hook — subscribes to category list changes */
export function useCategoryStore(): {
  categories: Category[];
} {
  const [categories, setCategoriesState] = useState<Category[]>(currentCategories);

  useEffect(() => {
    const handler = () => setCategoriesState([...currentCategories]);
    categoryListeners.add(handler);
    return () => {
      categoryListeners.delete(handler);
    };
  }, []);

  return { categories };
}

// ─── Convenience hooks ───

/** Simple hook that returns just the products array */
export function useProducts(): Product[] {
  const { products } = useProductStore();
  return products;
}

/** Simple hook that returns just the categories array */
export function useCategories(): Category[] {
  const { categories } = useCategoryStore();
  return categories;
}