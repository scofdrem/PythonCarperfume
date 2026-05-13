import { createClient } from "@metagptx/web-sdk";
import type { Product, Category, Brand } from "@/data/products";
import type { SiteContent } from "@/data/siteContent";

const client = createClient();

// ─── Mapping helpers ───

function mapProductFromBackend(item: Record<string, any>): Product {
  return {
    id: item.id,
    name: item.name || "",
    brand: item.brand || "",
    category: item.category || "",
    gender: item.gender || "unisex",
    ageRange: item.age_range || "25-35",
    volumes: item.volumes
      ? String(item.volumes)
          .split(",")
          .map((v: string) => Number(v.trim()))
          .filter((v: number) => v > 0)
      : [],
    image: item.image || "",
    description: item.description || "",
    instagramUrl: item.instagram_url || "",
    isNew: item.is_new || undefined,
    isFeatured: item.is_featured || undefined,
  };
}

function mapProductToBackend(product: Partial<Product>): Record<string, any> {
  const data: Record<string, any> = {};
  if (product.name !== undefined) data.name = product.name;
  if (product.brand !== undefined) data.brand = product.brand;
  if (product.category !== undefined) data.category = product.category;
  if (product.gender !== undefined) data.gender = product.gender;
  if (product.ageRange !== undefined) data.age_range = product.ageRange;
  if (product.volumes !== undefined) data.volumes = product.volumes.join(",");
  if (product.image !== undefined) data.image = product.image;
  if (product.description !== undefined) data.description = product.description;
  if (product.instagramUrl !== undefined) data.instagram_url = product.instagramUrl;
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
    const response = await client.entities.products.create({ data });
    return response.data ? mapProductFromBackend(response.data) : null;
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
    const response = await client.entities.products.update({
      id: String(id),
      data,
    });
    console.log(`[updateProduct] Response:`, JSON.stringify(response.data));
    return response.data ? mapProductFromBackend(response.data) : null;
  } catch (e: any) {
    console.error(`[updateProduct] Failed for product ${id}:`, e?.message, e?.response?.status, JSON.stringify(e?.response?.data));
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await client.entities.products.delete({ id: String(id) });
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
    const response = await client.entities.categories.create({
      data: {
        name: category.name,
        slug: category.slug,
        image: category.image,
      },
    });
    return response.data ? mapCategoryFromBackend(response.data) : null;
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
    const response = await client.entities.categories.update({
      id: String(id),
      data,
    });
    return response.data ? mapCategoryFromBackend(response.data) : null;
  } catch (e) {
    console.error("Failed to update category:", e);
    return null;
  }
}

export async function deleteCategoryById(id: number): Promise<boolean> {
  try {
    await client.entities.categories.delete({ id: String(id) });
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

const CONTENT_KEYS = ["hero", "section_headings", "about", "footer"] as const;

function keyToField(key: string): keyof SiteContent {
  if (key === "section_headings") return "sectionHeadings";
  return key as keyof SiteContent;
}

function fieldToKey(field: keyof SiteContent): string {
  if (field === "sectionHeadings") return "section_headings";
  return field as string;
}

export async function fetchSiteContent(): Promise<SiteContent | null> {
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

    // Validate all sections present
    const hasAll = (["hero", "sectionHeadings", "about", "footer"] as const).every(
      (k) => k in result
    );
    return hasAll ? (result as SiteContent) : null;
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

    const sections: (keyof SiteContent)[] = ["hero", "sectionHeadings", "about", "footer"];

    for (const field of sections) {
      const key = fieldToKey(field);
      const value = JSON.stringify((content as Record<string, any>)[field]);
      const existing = existingByKey.get(key);

      try {
        if (existing) {
          // Remove existing entry first to avoid update issues
          await client.entities.site_content.delete({ id: String(existing.id) });
        }
        // Create new entry with updated content
        await client.entities.site_content.create({
          data: { content_key: key, content_value: value },
        });
      } catch (sectionErr: any) {
        console.error(`saveSiteContent: failed to persist section "${key}":`, sectionErr?.message || sectionErr);
        throw sectionErr; // Re-throw to fail the entire operation
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
    await client.entities.inquiries.create({ data });
    return true;
  } catch (e) {
    console.error("Failed to submit inquiry:", e);
    return false;
  }
}