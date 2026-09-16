import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import type { Category, ProductWithDetails } from '../types/database.types';
import { getCategories, getPublishedProducts } from '../services/catalogService';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { STORE_CONFIG } from '../config/store.config';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getCategories(), getPublishedProducts()])
      .then(([catsData, prodsData]) => {
        if (isMounted) {
          setCategories(catsData);
          setFeaturedProducts(prodsData);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Banner Editorial Minimalista */}
      <section className="relative bg-neutral-900 text-white py-20 sm:py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-neutral-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-300" /> E-commerce Autoral • Edição 2026
          </span>
          <h1 className="text-3xl sm:text-6xl font-light tracking-tight text-white mb-6 leading-tight">
            Camisetas com design essencial e modelagem autoral
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl mb-10 leading-relaxed">
            {STORE_CONFIG.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/loja"
              className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 text-xs uppercase tracking-widest font-medium px-8 py-4 hover:bg-neutral-200 transition-colors"
            >
              Ver camisetas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-neutral-200">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium block mb-1">
            Nossas Linhas
          </span>
          <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-900">
            Categorias do Acervo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/loja?categoria=${cat.slug}`}
              className="group bg-white p-6 border border-neutral-200 hover:border-neutral-900 transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest font-semibold text-neutral-900">
                    {cat.name}
                  </span>
                  <Layers className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                </div>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  {cat.description || 'Modelagens exclusivas e acabamento de alta qualidade.'}
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-900 font-medium inline-flex items-center gap-1 mt-4 group-hover:underline">
                Explorar linha <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium block mb-1">
              Catálogo
            </span>
            <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-900">
              Camisetas em Destaque
            </h2>
          </div>
          <Link
            to="/loja"
            className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-medium text-neutral-900 hover:underline inline-flex items-center gap-1"
          >
            Ver coleção completa <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Buscando camisetas..." />
        ) : error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-neutral-500 py-12">Nenhum produto em destaque no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
