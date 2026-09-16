-- Missão 1: Schema do Banco de Dados para E-commerce de Camisetas (SUA MARCA)
-- PostgreSQL / Supabase Migration

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    price_in_cents BIGINT NOT NULL CHECK (price_in_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE IMAGENS DO PRODUTO
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL DEFAULT '',
    display_order INT NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE VARIANTES DO PRODUTO (Estoque por Produto + Cor + Tamanho)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_color_size UNIQUE (product_id, color, size)
);

-- 6. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- 7. ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT EM PRODUCTS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE RLS: LEITURA PÚBLICA (ANON / AUTHENTICATED) APENAS PARA PRODUTOS PUBLICADOS

-- Categories: Leitura pública permitida para todos
DROP POLICY IF EXISTS "Categorias visíveis publicamente" ON public.categories;
CREATE POLICY "Categorias visíveis publicamente" 
ON public.categories FOR SELECT 
USING (true);

-- Products: Apenas produtos com status = 'published' são visíveis para visitantes e clientes
DROP POLICY IF EXISTS "Produtos publicados visíveis publicamente" ON public.products;
CREATE POLICY "Produtos publicados visíveis publicamente" 
ON public.products FOR SELECT 
USING (status = 'published');

-- Product Images: Visíveis publicamente apenas se o produto pai estiver publicado
DROP POLICY IF EXISTS "Imagens de produtos publicados visíveis publicamente" ON public.product_images;
CREATE POLICY "Imagens de produtos publicados visíveis publicamente" 
ON public.product_images FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.products p 
        WHERE p.id = product_images.product_id 
        AND p.status = 'published'
    )
);

-- Product Variants: Apenas variantes ativas de produtos publicados são visíveis
DROP POLICY IF EXISTS "Variantes ativas de produtos publicados visíveis publicamente" ON public.product_variants;
CREATE POLICY "Variantes ativas de produtos publicados visíveis publicamente" 
ON public.product_variants FOR SELECT 
USING (
    is_active = true AND EXISTS (
        SELECT 1 FROM public.products p 
        WHERE p.id = product_variants.product_id 
        AND p.status = 'published'
    )
);

-- Nenhuma política de INSERT/UPDATE/DELETE pública é adicionada.
-- Alterações no catálogo e no estoque somente via Service Role Key (backend seguro) ou Supabase Dashboard.
