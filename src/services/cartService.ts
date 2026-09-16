import { queryCatalog } from './catalogService';
import type { ProductWithDetails, ProductVariant } from '../types/database.types';

export interface LocalCartItem {
  variantId: string;
  quantity: number;
}

export interface ValidatedCartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  color: string;
  size: string;
  unitPriceInCents: number;
  subtotalInCents: number;
  quantity: number;
  availableStock: number;
  isAvailable: boolean;
}

export interface CartValidationResult {
  items: ValidatedCartItem[];
  subtotalInCents: number;
  totalUnits: number;
  warnings: string[];
}

const LOCAL_STORAGE_KEY = 'sua_marca_cart_items_v1';

export function getLocalCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Sanitização rigorosa: garantir que possui apenas variantId e quantidade positiva
    return parsed
      .filter((item): item is LocalCartItem => 
        Boolean(item && typeof item.variantId === 'string' && typeof item.quantity === 'number' && item.quantity > 0)
      )
      .map(item => ({
        variantId: String(item.variantId),
        quantity: Math.floor(item.quantity),
      }));
  } catch (err) {
    console.error('Erro ao ler carrinho do localStorage:', err);
    return [];
  }
}

export function saveLocalCart(items: LocalCartItem[]): void {
  try {
    const cleanItems = items.map(i => ({
      variantId: i.variantId,
      quantity: i.quantity,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanItems));
  } catch (err) {
    console.error('Erro ao salvar carrinho no localStorage:', err);
  }
}

/**
 * Revalida os itens salvos localmente contra o banco de dados/serviço.
 * NUNCA confia em preços ou nomes salvos no navegador.
 */
export async function fetchAndValidateCart(localItems: LocalCartItem[]): Promise<CartValidationResult> {
  const warnings: string[] = [];
  const validatedItems: ValidatedCartItem[] = [];

  if (localItems.length === 0) {
    return { items: [], subtotalInCents: 0, totalUnits: 0, warnings: [] };
  }

  // Buscar todos os produtos publicados (ou do Supabase ou do fallback mock)
  const catalogRes = await queryCatalog({ pageSize: 100 });
  const allProducts = catalogRes.products;

  for (const localItem of localItems) {
    // Localizar a variante entre todos os produtos
    let foundProduct: ProductWithDetails | null = null;
    let foundVariant: ProductVariant | null = null;

    for (const prod of allProducts) {
      const v = prod.product_variants.find(varItem => varItem.id === localItem.variantId);
      if (v) {
        foundProduct = prod;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant || !foundVariant.is_active || foundProduct.status !== 'published') {
      warnings.push(`Um dos itens adicionados anteriormente não está mais disponível em nosso acervo.`);
      continue; // Ignora o item indisponível
    }

    let finalQuantity = localItem.quantity;
    const stock = foundVariant.stock;

    if (stock <= 0) {
      warnings.push(`A variante ${foundProduct.name} (${foundVariant.color} / ${foundVariant.size}) esgotou em estoque.`);
      continue;
    }

    if (finalQuantity > stock) {
      warnings.push(
        `O estoque disponível para ${foundProduct.name} (${foundVariant.color} / ${foundVariant.size}) foi alterado para ${stock} unidade(s). A quantidade no seu carrinho foi ajustada.`
      );
      finalQuantity = stock;
    }

    const primaryImage = foundProduct.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000';
    const unitPrice = foundProduct.price_in_cents;
    const lineSubtotal = unitPrice * finalQuantity;

    validatedItems.push({
      variantId: foundVariant.id,
      productId: foundProduct.id,
      productName: foundProduct.name,
      productSlug: foundProduct.slug,
      imageUrl: primaryImage,
      color: foundVariant.color,
      size: foundVariant.size,
      unitPriceInCents: unitPrice,
      subtotalInCents: lineSubtotal,
      quantity: finalQuantity,
      availableStock: stock,
      isAvailable: true,
    });
  }

  const subtotalInCents = validatedItems.reduce((acc, item) => acc + item.subtotalInCents, 0);
  const totalUnits = validatedItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items: validatedItems,
    subtotalInCents,
    totalUnits,
    warnings,
  };
}
