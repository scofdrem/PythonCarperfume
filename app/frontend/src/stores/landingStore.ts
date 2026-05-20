import { config } from '@/lib/config';

export interface LandingPage {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  theme_primary?: string;
  theme_secondary?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LandingCatalogue {
  id: number;
  landing_page_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LandingProduct {
  id: number;
  catalogue_id: number;
  name: string;
  category?: string;
  description?: string;
  price?: number;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
  attributes?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

const API = () => config.API_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API()}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });
    if (!res.ok) {
      console.error(`[landingStore] ${path} failed: ${res.status}`);
      return null;
    }
    // Handle 204 No Content
    if (res.status === 204) return null as T;
    return res.json();
  } catch (e) {
    console.error(`[landingStore] ${path} error:`, e);
    return null;
  }
}

// ─── Landing Pages ───

export async function fetchLandingPages(): Promise<LandingPage[]> {
  const result = await request<{ items: LandingPage[] }>('/api/v1/landing-pages');
  return result?.items || [];
}

export async function fetchLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  return request<LandingPage>(`/api/v1/landing-pages/by-slug/${slug}`);
}

export async function fetchLandingPageByDomain(domain: string): Promise<LandingPage | null> {
  return request<LandingPage>(`/api/v1/landing-pages/by-domain?domain=${encodeURIComponent(domain)}`);
}

export async function fetchLandingPageById(id: number): Promise<LandingPage | null> {
  return request<LandingPage>(`/api/v1/landing-pages/${id}`);
}

export async function createLandingPage(data: Partial<LandingPage>): Promise<LandingPage | null> {
  return request<LandingPage>('/api/v1/landing-pages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLandingPage(id: number, data: Partial<LandingPage>): Promise<LandingPage | null> {
  return request<LandingPage>(`/api/v1/landing-pages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLandingPage(id: number): Promise<boolean> {
  const result = await request(`/api/v1/landing-pages/${id}`, { method: 'DELETE' });
  return result !== null;
}

// ─── Catalogue ───

export async function fetchCatalogue(pageId: number): Promise<LandingCatalogue | null> {
  return request<LandingCatalogue>(`/api/v1/landing-pages/${pageId}/catalogue`);
}

export async function updateCatalogue(pageId: number, data: Partial<LandingCatalogue>): Promise<LandingCatalogue | null> {
  return request<LandingCatalogue>(`/api/v1/landing-pages/${pageId}/catalogue`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Products ───

export async function fetchLandingProducts(catalogueId: number): Promise<LandingProduct[]> {
  const result = await request<{ items: LandingProduct[] }>(`/api/v1/landing-products?catalogue_id=${catalogueId}`);
  return result?.items || [];
}

export async function fetchLandingProductById(id: number): Promise<LandingProduct | null> {
  return request<LandingProduct>(`/api/v1/landing-products/${id}`);
}

export async function createLandingProduct(data: Partial<LandingProduct>): Promise<LandingProduct | null> {
  return request<LandingProduct>('/api/v1/landing-products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLandingProduct(id: number, data: Partial<LandingProduct>): Promise<LandingProduct | null> {
  return request<LandingProduct>(`/api/v1/landing-products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLandingProduct(id: number): Promise<boolean> {
  const result = await request(`/api/v1/landing-products/${id}`, { method: 'DELETE' });
  return result !== null;
}