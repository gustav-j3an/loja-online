import { supabase, isSupabaseConfigured, isDemoMode } from './supabaseClient';
import type { Category, ProductWithDetails } from '../types/database.types';

export interface CatalogQueryOptions {
  searchQuery?: string;
  categorySlug?: string;
  color?: string;
  size?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  pageSize?: number;
}

export interface CatalogQueryResult {
  products: ProductWithDetails[];
  totalCount: number;
  totalPages: number;
  availableColors: string[];
  availableSizes: string[];
}

// Mock Data idêntico ao seed.sql usado EXCLUSIVAMENTE quando VITE_DEMO_MODE=true em ambiente de desenvolvimento (DEV)
const MOCK_CATEGORIES: Category[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Básicas',
    slug: 'basicas',
    description: 'Camisetas essenciais com corte reto e algodão premium.',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Oversized',
    slug: 'oversized',
    description: 'Modelagem ampla, caimento encorpado e estilo urbano.',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Edição Limitada',
    slug: 'edicao-limitada',
    description: 'Peças exclusivas com estampas minimalistas e tiragem reduzida.',
  },
];

const MOCK_PRODUCTS: ProductWithDetails[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Camiseta Essential Off-White',
    slug: 'camiseta-essential-off-white',
    description: 'Camiseta confeccionada em 100% algodão pima com toque ultra macio. Gola em ribana de 2cm, costuras reforçadas de ombro a ombro.',
    status: 'published',
    price_in_cents: 12990,
    created_at: '2026-09-10T10:00:00Z',
    category: MOCK_CATEGORIES[0],
    product_images: [
      {
        id: 'img1',
        product_id: 'a1111111-1111-1111-1111-111111111111',
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Camiseta Essential Off-White frente',
        display_order: 0,
      },
      {
        id: 'img2',
        product_id: 'a1111111-1111-1111-1111-111111111111',
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Detalhe do tecido algodão pima off-white',
        display_order: 1,
      },
    ],
    product_variants: [
      { id: 'v1', product_id: 'a1111111-1111-1111-1111-111111111111', sku: 'ESS-OFF-P', color: 'Off-White', size: 'P', stock: 15, is_active: true },
      { id: 'v2', product_id: 'a1111111-1111-1111-1111-111111111111', sku: 'ESS-OFF-M', color: 'Off-White', size: 'M', stock: 20, is_active: true },
      { id: 'v3', product_id: 'a1111111-1111-1111-1111-111111111111', sku: 'ESS-OFF-G', color: 'Off-White', size: 'G', stock: 8, is_active: true },
      { id: 'v4', product_id: 'a1111111-1111-1111-1111-111111111111', sku: 'ESS-OFF-GG', color: 'Off-White', size: 'GG', stock: 0, is_active: true },
    ],
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Camiseta Essential Preta Minimal',
    slug: 'camiseta-essential-preta-minimal',
    description: 'Modelagem clássica na cor preta profunda. Algodão penteado 30.1 de alta gramatura que mantém a estrutura mesmo após várias lavagens.',
    status: 'published',
    price_in_cents: 11990,
    created_at: '2026-09-12T10:00:00Z',
    category: MOCK_CATEGORIES[0],
    product_images: [
      {
        id: 'img3',
        product_id: 'a2222222-2222-2222-2222-222222222222',
        image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Camiseta Essential Preta frente',
        display_order: 0,
      },
      {
        id: 'img4',
        product_id: 'a2222222-2222-2222-2222-222222222222',
        image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Camiseta Essential Preta modelo costas',
        display_order: 1,
      },
    ],
    product_variants: [
      { id: 'v5', product_id: 'a2222222-2222-2222-2222-222222222222', sku: 'ESS-BLK-P', color: 'Preta', size: 'P', stock: 10, is_active: true },
      { id: 'v6', product_id: 'a2222222-2222-2222-2222-222222222222', sku: 'ESS-BLK-M', color: 'Preta', size: 'M', stock: 8, is_active: true },
      { id: 'v7', product_id: 'a2222222-2222-2222-2222-222222222222', sku: 'ESS-BLK-G', color: 'Preta', size: 'G', stock: 0, is_active: true },
      { id: 'v8', product_id: 'a2222222-2222-2222-2222-222222222222', sku: 'ESS-BLK-GG', color: 'Preta', size: 'GG', stock: 5, is_active: true },
    ],
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Camiseta Oversized Heavyweight Areia',
    slug: 'camiseta-oversized-heavyweight-areia',
    description: 'Modelagem oversized contemporânea com gramatura de 240g/m². Caimento firme no corpo e ombros caídos.',
    status: 'published',
    price_in_cents: 16990,
    created_at: '2026-09-14T10:00:00Z',
    category: MOCK_CATEGORIES[1],
    product_images: [
      {
        id: 'img5',
        product_id: 'a3333333-3333-3333-3333-333333333333',
        image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Camiseta Oversized Heavyweight Areia',
        display_order: 0,
      },
    ],
    product_variants: [
      { id: 'v9', product_id: 'a3333333-3333-3333-3333-333333333333', sku: 'OVR-SAN-P', color: 'Areia', size: 'P', stock: 5, is_active: true },
      { id: 'v10', product_id: 'a3333333-3333-3333-3333-333333333333', sku: 'OVR-SAN-M', color: 'Areia', size: 'M', stock: 14, is_active: true },
      { id: 'v11', product_id: 'a3333333-3333-3333-3333-333333333333', sku: 'OVR-SAN-G', color: 'Areia', size: 'G', stock: 10, is_active: true },
    ],
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'Camiseta Graphic Monogram Edição Limitada',
    slug: 'camiseta-graphic-monogram-edicao-limitada',
    description: 'Edição limitada com bordado sutil de alta densidade no peito esquerdo. Produzida em lote numerado.',
    status: 'published',
    price_in_cents: 18990,
    created_at: '2026-09-15T10:00:00Z',
    category: MOCK_CATEGORIES[2],
    product_images: [
      {
        id: 'img6',
        product_id: 'a4444444-4444-4444-4444-444444444444',
        image_url: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop',
        alt_text: 'Camiseta Graphic Monogram Edição Limitada',
        display_order: 0,
      },
    ],
    product_variants: [
      { id: 'v12', product_id: 'a4444444-4444-4444-4444-444444444444', sku: 'LTD-MNG-M', color: 'Grafite', size: 'M', stock: 7, is_active: true },
      { id: 'v13', product_id: 'a4444444-4444-4444-4444-444444444444', sku: 'LTD-MNG-G', color: 'Grafite', size: 'G', stock: 3, is_active: true },
    ],
  },
];

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode) {
    return MOCK_CATEGORIES;
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para conectar ao banco.');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Falha na consulta de categorias no Supabase: ${error.message}`);
  }

  return data as Category[];
}

export async function queryCatalog(options: CatalogQueryOptions = {}): Promise<CatalogQueryResult> {
  const {
    searchQuery,
    categorySlug,
    color,
    size,
    sort = 'newest',
    page = 1,
    pageSize = 8,
  } = options;

  if (isDemoMode) {
    return queryCatalogMock(options);
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para conectar ao banco.');
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_images(*),
      product_variants(*)
    `, { count: 'exact' })
    .eq('status', 'published');

  if (categorySlug) {
    const { data: cat, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (catErr) {
      throw new Error(`Erro ao buscar categoria por slug (${categorySlug}): ${catErr.message}`);
    }

    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (searchQuery && searchQuery.trim()) {
    query = query.ilike('name', `%${searchQuery.trim()}%`);
  }

  if (sort === 'price_asc') {
    query = query.order('price_in_cents', { ascending: true });
  } else if (sort === 'price_desc') {
    query = query.order('price_in_cents', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`Erro ao consultar o catálogo no Supabase: ${error.message}`);
  }

  let items = (data || []) as ProductWithDetails[];

  if (color) {
    items = items.filter(p => p.product_variants.some(v => v.color.toLowerCase() === color.toLowerCase() && v.is_active));
  }
  if (size) {
    items = items.filter(p => p.product_variants.some(v => v.size.toLowerCase() === size.toLowerCase() && v.is_active));
  }

  const totalCount = count ?? items.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const availableColors = Array.from(
    new Set(items.flatMap(p => p.product_variants.filter(v => v.is_active).map(v => v.color)))
  );
  const availableSizes = Array.from(
    new Set(items.flatMap(p => p.product_variants.filter(v => v.is_active).map(v => v.size)))
  );

  return {
    products: items,
    totalCount,
    totalPages: Math.max(1, totalPages),
    availableColors,
    availableSizes,
  };
}

function queryCatalogMock(options: CatalogQueryOptions = {}): CatalogQueryResult {
  const {
    searchQuery,
    categorySlug,
    color,
    size,
    sort = 'newest',
    page = 1,
    pageSize = 8,
  } = options;

  let filtered = MOCK_PRODUCTS.filter(p => p.status === 'published');

  if (categorySlug) {
    filtered = filtered.filter(p => p.category?.slug === categorySlug);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }

  if (color) {
    filtered = filtered.filter(p =>
      p.product_variants.some(v => v.color.toLowerCase() === color.toLowerCase() && v.is_active)
    );
  }

  if (size) {
    filtered = filtered.filter(p =>
      p.product_variants.some(v => v.size.toLowerCase() === size.toLowerCase() && v.is_active)
    );
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price_in_cents - b.price_in_cents);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price_in_cents - a.price_in_cents);
  } else {
    filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  }

  const allPublished = MOCK_PRODUCTS.filter(p => p.status === 'published');
  const availableColors = Array.from(
    new Set(allPublished.flatMap(p => p.product_variants.filter(v => v.is_active).map(v => v.color)))
  );
  const availableSizes = Array.from(
    new Set(allPublished.flatMap(p => p.product_variants.filter(v => v.is_active).map(v => v.size)))
  );

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filtered.slice(startIndex, startIndex + pageSize);

  return {
    products: paginatedProducts,
    totalCount,
    totalPages: Math.max(1, totalPages),
    availableColors,
    availableSizes,
  };
}

export async function getPublishedProducts(categorySlug?: string): Promise<ProductWithDetails[]> {
  const result = await queryCatalog({ categorySlug, pageSize: 50 });
  return result.products;
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  if (isDemoMode) {
    const item = MOCK_PRODUCTS.find(p => p.slug === slug && p.status === 'published');
    return item || null;
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env para conectar ao banco.');
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      product_images(*),
      product_variants(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Erro ao buscar produto por slug (${slug}) no Supabase: ${error.message}`);
  }

  return data as ProductWithDetails;
}

export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
