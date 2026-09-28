export type Availability =
  | 'in_stock'
  | 'out_of_stock'
  | 'made_to_order'
  | 'inquiry_only';

export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  sku?: string;
  stock: number;
  active: boolean;
}

export interface ProductMedia {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  publicId?: string;
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
  createdAt: string;
  updatedAt: string;
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

export interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  productId?: string;
  productName?: string;
  size?: string;
  color?: string;
  quantity: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}
