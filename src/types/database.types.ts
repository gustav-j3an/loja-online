export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  price_in_cents: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProductWithDetails extends Product {
  category?: Category | null;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}
