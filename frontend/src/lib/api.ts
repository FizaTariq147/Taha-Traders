const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export type Availability =
  | 'in_stock'
  | 'out_of_stock'
  | 'made_to_order'
  | 'inquiry_only';

export interface ProductMedia {
  id?: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id?: string;
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  sku: string;
  brand?: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  stockTotal?: number;
  availability: Availability;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  images: ProductMedia[];
  modelUrl?: string;
  variants: ProductVariant[];
  isDemo: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  isDemo: boolean;
}

export interface SiteSettings {
  id: string;
  businessNameEn: string;
  businessNameUr: string;
  tagline: string;
  phones: string[];
  whatsappNumber: string;
  email: string;
  address: string;
  addressUr: string;
  mapUrl: string;
  businessHours: string;
  proprietor: string;
  contactPerson: string;
}

export interface ContentBlocks {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroModelUrl: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImageUrl: string;
  whyChooseUs: { title: string; body: string }[];
  promoBanner: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const api = {
  getProducts: (params: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v));
    });
    const qs = q.toString();
    return request<ProductListResponse>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (slug: string) => request<Product>(`/products/slug/${slug}`),
  getRelated: (id: string, categoryId: string) =>
    request<Product[]>(`/products/${id}/related?categoryId=${categoryId}`),
  getCategories: () => request<Category[]>('/categories'),
  getCategory: (slug: string) => request<Category>(`/categories/slug/${slug}`),
  getSettings: () => request<SiteSettings>('/settings'),
  getContent: () => request<ContentBlocks>('/content'),
  createInquiry: (body: Record<string, unknown>) =>
    request('/inquiries', { method: 'POST', body: JSON.stringify(body) }),
};

export function resolveMediaUrl(
  url?: string,
  fallback = 'https://picsum.photos/seed/taha-fallback/800/800',
) {
  if (!url) return fallback;
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
  return fallback;
}

export function formatPrice(value: number) {
  return `Rs ${value.toLocaleString('en-PK')}`;
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string,
) {
  const digits = whatsappNumber.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? `92${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(product: Product, size?: string, color?: string) {
  return [
    'Hello, I am interested in ' + product.name + '.',
    size ? `Size: ${size}` : null,
    color ? `Color: ${color}` : null,
    'Please share availability and current price.',
  ]
    .filter(Boolean)
    .join('\n');
}
