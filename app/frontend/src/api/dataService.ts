import type { Product, Category, Brand } from "@/data/products";
import type { SiteContent } from "@/data/siteContent";
import { client } from "@/lib/api";
import { authApi } from "@/lib/auth";

// ─── Mapping helpers ───

function mapProductFromBackend(item: Record<string, any>): Product {
  return {
    id: item.id,
    name: item.name || "",
    brand: item.brand || "",
    category: item.category || "",
    price: Number(item.price) || 0,
    volumes: item.volumes
      ? String(item.volumes)
          .split(",")
          .map((v: string) => Number(v.trim()))
          .filter((v: number) => !isNaN(v))
      : [],
    image: item.image || "",
    description: item.description || undefined,
    instagramUrl: item.instagram_url || undefined,
    refillable: item.refillable || undefined,
    isNew: item.is_new || undefined,
    isFeatured: item.is_featured || undefined,
  };
}

function mapProductToBackend(product: Partial<Product>): Record<string, any> {
  const data: Record<string, any> = {};
  if (product.name !== undefined) data.name = product.name;
  if (product.brand !== undefined) data.brand = product.brand;
  if (product.price !== undefined) data.price = product.price;
  if (product.category !== undefined) data.category = product.category;
  if (product.volumes !== undefined && product.volumes.length > 0) data.volumes = product.volumes.join(",");
  if (product.image !== undefined) data.image = product.image;
  if (product.description !== undefined) data.description = product.description;
  if (product.instagramUrl !== undefined) data.instagram_url = product.instagramUrl;
  if (product.refillable !== undefined) data.refillable = product.refillable;
  if (product.isNew !== undefined) data.is_new = product.isNew;
  if (product.isFeatured !== undefined) data.is_featured = product.isFeatured;
  return data;
}

// ─── Products ───

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await client.entities.products.query({ limit: 2000 });
    return (response.data.items || []).map(mapProductFromBackend);
  } catch (e) {
    console.error("Failed to fetch products:", e);
    return [];
  }
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product | null> {
  try {
    const data = mapProductToBackend(product);
    const response = await authApi.client.post(
      `${authApi.getBaseURL()}/api/v1/entities/products`,
      data
    );
    return mapProductFromBackend(response.data);
  } catch (e) {
    console.error("Failed to create product:", e);
    return null;
  }
}

export async function updateProduct(
  id: number,
  updates: Partial<Product>
): Promise<Product | null> {
  try {
    const data = mapProductToBackend(updates);
    console.log(`[updateProduct] PUT /api/v1/entities/products/${id}`, JSON.stringify(data));
    const response = await authApi.client.put(
      `${authApi.getBaseURL()}/api/v1/entities/products/${id}`,
      data
    );
    console.log(`[updateProduct] Response:`, JSON.stringify(response.data));
    return mapProductFromBackend(response.data);
  } catch (e: any) {
    console.error(`[updateProduct] Failed for product ${id}:`, e?.message);
    throw e;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await authApi.client.delete(
      `${authApi.getBaseURL()}/api/v1/entities/products/${id}`
    );
    return true;
  } catch (e) {
    console.error("Failed to delete product:", e);
    return false;
  }
}

// ─── Categories ───

function mapCategoryFromBackend(item: Record<string, any>): Category {
  return {
    name: item.name || "",
    slug: item.slug || "",
    image: item.image || "",
  };
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await client.entities.categories.query({ limit: 2000 });
    return (response.data.items || []).map(mapCategoryFromBackend);
  } catch (e) {
    console.error("Failed to fetch categories:", e);
    return [];
  }
}

export async function createCategory(
  category: Category
): Promise<Category | null> {
  try {
    const response = await authApi.client.post(
      `${authApi.getBaseURL()}/api/v1/entities/categories`,
      {
        name: category.name,
        slug: category.slug,
        image: category.image,
      }
    );
    return mapCategoryFromBackend(response.data);
  } catch (e) {
    console.error("Failed to create category:", e);
    return null;
  }
}

export async function updateCategoryById(
  id: number,
  updates: Partial<Category>
): Promise<Category | null> {
  try {
    const data: Record<string, any> = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.slug !== undefined) data.slug = updates.slug;
    if (updates.image !== undefined) data.image = updates.image;
    const response = await authApi.client.put(
      `${authApi.getBaseURL()}/api/v1/entities/categories/${id}`,
      data
    );
    return mapCategoryFromBackend(response.data);
  } catch (e) {
    console.error("Failed to update category:", e);
    return null;
  }
}

export async function deleteCategoryById(id: number): Promise<boolean> {
  try {
    await authApi.client.delete(
      `${authApi.getBaseURL()}/api/v1/entities/categories/${id}`
    );
    return true;
  } catch (e) {
    console.error("Failed to delete category:", e);
    return false;
  }
}

export async function findCategoryIdBySlug(
  slug: string
): Promise<number | null> {
  try {
    const response = await client.entities.categories.query({
      query: { slug },
      limit: 1,
    });
    const items = response.data.items || [];
    return items.length > 0 ? items[0].id : null;
  } catch (e) {
    console.error("Failed to find category:", e);
    return null;
  }
}

// ─── Brands ───

function mapBrandFromBackend(item: Record<string, any>): Brand {
  return { name: item.name || "", slug: item.slug || "" };
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await client.entities.brands.query({ limit: 2000 });
    return (response.data.items || []).map(mapBrandFromBackend);
  } catch (e) {
    console.error("Failed to fetch brands:", e);
    return [];
  }
}

// ─── Site Content ───
// The database stores site content as separate rows keyed by content_key:
// "hero", "section_headings", "about", "footer"
// Each row's content_value is a JSON string for that section.

const CONTENT_KEYS = ["hero", "section_headings", "about", "footer", "header"] as const;

function keyToField(key: string): keyof SiteContent {
  if (key === "section_headings") return "sectionHeadings";
  return key as keyof SiteContent;
}

function fieldToKey(field: keyof SiteContent): string {
  if (field === "sectionHeadings") return "section_headings";
  return field as string;
}

export async function fetchSiteContent(): Promise<Partial<SiteContent> | null> {
  try {
    const response = await client.entities.site_content.query({ limit: 100 });
    const items: Record<string, any>[] = response.data.items || [];
    if (items.length === 0) return null;

    const result: Partial<SiteContent> = {};
    for (const item of items) {
      const key = item.content_key as string;
      const value = item.content_value as string;
      if (!key || !value) continue;
      try {
        const field = keyToField(key);
        (result as Record<string, any>)[field] = JSON.parse(value);
      } catch {
        // skip unparseable rows
      }
    }

    // Return whatever sections were fetched — missing ones will be merged with defaults in siteContent.ts
    return Object.keys(result).length > 0 ? result : null;
  } catch (e) {
    console.error("Failed to fetch site content:", e);
    return null;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<boolean> {
  try {
    // Fetch existing rows to get their IDs for updates
    const response = await client.entities.site_content.query({ limit: 100 });
    const existingItems: Record<string, any>[] = response.data.items || [];
    const existingByKey = new Map<string, Record<string, any>>();
    for (const item of existingItems) {
      if (item.content_key) existingByKey.set(item.content_key, item);
    }

    const sections: (keyof SiteContent)[] = ["hero", "sectionHeadings", "about", "footer", "header"];

    for (const field of sections) {
      const key = fieldToKey(field);
      const value = JSON.stringify((content as Record<string, any>)[field]);
      const existing = existingByKey.get(key);

      try {
        if (existing) {
          // Update existing entry
          await authApi.client.put(
            `${authApi.getBaseURL()}/api/v1/entities/site_content/${existing.id}`,
            { content_key: key, content_value: value }
          );
        } else {
          // Create new entry
          await authApi.client.post(
            `${authApi.getBaseURL()}/api/v1/entities/site_content`,
            { content_key: key, content_value: value }
          );
        }
      } catch (sectionErr: any) {
        console.error(`saveSiteContent: failed to persist section "${key}":`, sectionErr?.message || sectionErr);
        throw sectionErr;
      }
    }
    return true;
  } catch (e: any) {
    console.error("saveSiteContent: overall failure:", e?.message || e);
    return false;
  }
}

// ─── Inquiries ───

export async function submitInquiry(data: {
  name: string;
  phone: string;
  message: string;
  product_name?: string;
  product_brand?: string;
}): Promise<boolean> {
  try {
    const response = await fetch('/api/v1/entities/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to submit inquiry: ${response.status}`);
    return true;
  } catch (e) {
    console.error("Failed to submit inquiry:", e);
    return false;
  }
}
