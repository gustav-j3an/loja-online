import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductWithDetails } from '../../types/database.types';
import { formatPrice } from '../../services/catalogService';

interface ProductCardProps {
  product: ProductWithDetails;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000';
  const secondaryImage = product.product_images?.[1]?.image_url;

  const totalStock = product.product_variants?.reduce((acc, v) => acc + (v.is_active ? v.stock : 0), 0) ?? 0;
  const isSoldOut = totalStock === 0;

  return (
    <div className="group flex flex-col">
      <Link to={`/produto/${product.slug}`} className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-3">
        <img
          src={primaryImage}
          alt={product.product_images?.[0]?.alt_text || product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}
        {isSoldOut && (
          <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
            Esgotado
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-grow">
        {product.category && (
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 font-medium">
            {product.category.name}
          </span>
        )}
        <Link to={`/produto/${product.slug}`} className="group-hover:underline">
          <h3 className="text-sm font-medium text-neutral-900 tracking-tight leading-snug">
            {product.name}
          </h3>
        </Link>
        <span className="text-sm text-neutral-600 font-normal mt-1">
          {formatPrice(product.price_in_cents)}
        </span>
      </div>
    </div>
  );
};
