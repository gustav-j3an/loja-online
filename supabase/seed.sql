-- Missão 1: Seed de Desenvolvimento (Camisetas SUA MARCA)
-- Apenas para uso em ambiente dev/local

-- Limpeza preventiva de dados de teste antigos
TRUNCATE public.product_variants, public.product_images, public.products, public.categories CASCADE;

-- 1. CATEGORIAS
INSERT INTO public.categories (id, name, slug, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Básicas', 'basicas', 'Camisetas essenciais com corte reto e algodão premium.'),
('22222222-2222-2222-2222-222222222222', 'Oversized', 'oversized', 'Modelagem ampla, caimento encorpado e estilo urbano.'),
('33333333-3333-3333-3333-333333333333', 'Edição Limitada', 'edicao-limitada', 'Peças exclusivas com estampas minimalistas e tiragem reduzida.');

-- 2. PRODUTOS (Preço em centavos)
INSERT INTO public.products (id, category_id, name, slug, description, status, price_in_cents) VALUES
-- Produto 1 (Publicado)
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Camiseta Essential Off-White', 'camiseta-essential-off-white', 'Camiseta confeccionada em 100% algodão pima com toque ultra macio. Gola em ribana de 2cm, costuras reforçadas de ombro a ombro.', 'published', 12990),

-- Produto 2 (Publicado)
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Camiseta Essential Preteada Minimal', 'camiseta-essential-pretada-minimal', 'Modelagem clássica na cor preta profunda. Algodão penteado 30.1 de alta gramatura que mantém a estrutura mesmo após várias lavagens.', 'published', 11990),

-- Produto 3 (Publicado)
('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Camiseta Oversized Heavyweight Areia', 'camiseta-oversized-heavyweight-areia', 'Modelagem oversized contemporânea com gramatura de 240g/m². Caimento firme no corpo e ombros caídos.', 'published', 16990),

-- Produto 4 (Publicado)
('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Camiseta Graphic "SUA MARCA" Monogram', 'camiseta-graphic-sua-marca-monogram', 'Edição limitada com bordado sutil de alta densidade no peito esquerdo. Produzida em lote numerado.', 'published', 18990),

-- Produto 5 (Rascunho - Não deve aparecer publicamente)
('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Camiseta Prototype V1 (Rascunho)', 'camiseta-prototype-v1-rascunho', 'Produto em fase de teste e desenvolvimento.', 'draft', 9990);

-- 3. IMAGENS DE PRODUTOS
INSERT INTO public.product_images (id, product_id, image_url, alt_text, display_order) VALUES
-- Imagens Produto 1
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop', 'Camiseta Essential Off-White frente', 0),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop', 'Detalhe do tecido algodão pima off-white', 1),

-- Imagens Produto 2
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop', 'Camiseta Essential Preta frente', 0),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop', 'Camiseta Essential Preta modelo costas', 1),

-- Imagens Produto 3
(gen_random_uuid(), 'a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', 'Camiseta Oversized Heavyweight Areia', 0),

-- Imagens Produto 4
(gen_random_uuid(), 'a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop', 'Camiseta Graphic Monogram Edição Limitada', 0);

-- 4. VARIANTES DE PRODUTO (Estoque por Produto + Cor + Tamanho)
INSERT INTO public.product_variants (product_id, sku, color, size, stock, is_active) VALUES
-- Variantes Produto 1 (Off-White)
('a1111111-1111-1111-1111-111111111111', 'ESS-OFF-P', 'Off-White', 'P', 15, true),
('a1111111-1111-1111-1111-111111111111', 'ESS-OFF-M', 'Off-White', 'M', 20, true),
('a1111111-1111-1111-1111-111111111111', 'ESS-OFF-G', 'Off-White', 'G', 8, true),
('a1111111-1111-1111-1111-111111111111', 'ESS-OFF-GG', 'Off-White', 'GG', 0, true), -- Esgotado

-- Variantes Produto 2 (Preto)
('a2222222-2222-2222-2222-222222222222', 'ESS-BLK-P', 'Preta', 'P', 10, true),
('a2222222-2222-2222-2222-222222222222', 'ESS-BLK-M', 'Preta', 'M', 8, true),
('a2222222-2222-2222-2222-222222222222', 'ESS-BLK-G', 'Preta', 'G', 0, true),
('a2222222-2222-2222-2222-222222222222', 'ESS-BLK-GG', 'Preta', 'GG', 5, true),

-- Variantes Produto 3 (Areia)
('a3333333-3333-3333-3333-333333333333', 'OVR-SAN-P', 'Areia', 'P', 5, true),
('a3333333-3333-3333-3333-333333333333', 'OVR-SAN-M', 'Areia', 'M', 14, true),
('a3333333-3333-3333-3333-333333333333', 'OVR-SAN-G', 'Areia', 'G', 10, true),

-- Variantes Produto 4 (Grafite)
('a4444444-4444-4444-4444-444444444444', 'LTD-MNG-M', 'Grafite', 'M', 7, true),
('a4444444-4444-4444-4444-444444444444', 'LTD-MNG-G', 'Grafite', 'G', 3, true);
