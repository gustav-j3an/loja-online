import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import type { Category } from '../types/database.types';
import { getCategories, queryCatalog } from '../services/catalogService';
import type { CatalogQueryResult } from '../services/catalogService';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ler parâmetros da URL para estado inicial
  const categoryParam = searchParams.get('categoria') || '';
  const searchParam = searchParams.get('busca') || '';
  const colorParam = searchParams.get('cor') || '';
  const sizeParam = searchParams.get('tamanho') || '';
  const sortParam = (searchParams.get('ordem') as 'newest' | 'price_asc' | 'price_desc') || 'newest';
  const pageParam = parseInt(searchParams.get('pagina') || '1', 10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogResult, setCatalogResult] = useState<CatalogQueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchInput, setSearchInput] = useState(searchParam);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Carrega lista de categorias uma única vez
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Recarrega o catálogo sempre que os parâmetros da URL mudarem
  useEffect(() => {
    let isMounted = true;
    queryCatalog({
      categorySlug: categoryParam || undefined,
      searchQuery: searchParam || undefined,
      color: colorParam || undefined,
      size: sizeParam || undefined,
      sort: sortParam,
      page: pageParam,
      pageSize: 8,
    })
      .then((res) => {
        if (isMounted) setCatalogResult(res);
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
  }, [categoryParam, searchParam, colorParam, sizeParam, sortParam, pageParam]);

  // Função auxiliar para atualizar um ou mais parâmetros na URL preservando os demais
  const updateURLParams = (paramsToUpdate: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    // Resetar para página 1 ao alterar qualquer filtro (exceto ao mudar diretamente a página)
    if (!('pagina' in paramsToUpdate)) {
      newParams.delete('pagina');
    }

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams({ busca: searchInput.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    categoryParam || searchParam || colorParam || sizeParam || sortParam !== 'newest'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Título & Descrição */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900">
          Loja / Catálogo
        </h1>
        <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">
          Filtre por linha, tamanho, cor ou busque por modelos específicos
        </p>
      </div>

      {/* Barra de Busca e Botão de Filtro Mobile */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar camisetas por nome..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-300 text-xs tracking-wider text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            aria-label="Buscar camisetas por nome"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none stroke-1" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateURLParams({ busca: null });
              }}
              className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-900"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="sm:hidden flex items-center justify-center gap-2 py-3 px-4 border border-neutral-900 text-xs font-medium uppercase tracking-wider bg-neutral-900 text-white"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros & Ordenação
        </button>
      </div>

      {/* Painel de Filtros e Ordenação */}
      <div
        className={`mb-10 p-6 bg-white border border-neutral-200 space-y-6 ${
          showMobileFilters ? 'block' : 'hidden sm:block'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Categorias */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
              Categoria
            </label>
            <select
              value={categoryParam}
              onChange={(e) => updateURLParams({ categoria: e.target.value || null })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tamanho */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
              Tamanho
            </label>
            <select
              value={sizeParam}
              onChange={(e) => updateURLParams({ tamanho: e.target.value || null })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="">Todos os Tamanhos</option>
              {catalogResult?.availableSizes.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>

          {/* Cor */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
              Cor
            </label>
            <select
              value={colorParam}
              onChange={(e) => updateURLParams({ cor: e.target.value || null })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="">Todas as Cores</option>
              {catalogResult?.availableColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
              Ordenar por
            </label>
            <select
              value={sortParam}
              onChange={(e) => updateURLParams({ ordem: e.target.value })}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="newest">Mais Recentes (Novidades)</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Limpar Filtros se Ativos */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Filtros ativos aplicados ao acervo.
            </span>
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-900 uppercase tracking-wider font-semibold underline hover:text-neutral-600"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo Principal / Grade de Produtos */}
      {loading ? (
        <LoadingState message="Buscando camisetas no catálogo..." />
      ) : error ? (
        <ErrorState onRetry={() => window.location.reload()} />
      ) : !catalogResult || catalogResult.products.length === 0 ? (
        <EmptyState
          title="Nenhuma camiseta encontrada"
          message={
            hasActiveFilters
              ? 'Nenhum modelo corresponde aos filtros aplicados. Tente ajustar os termos da busca ou selecionar outras categorias.'
              : 'Não há produtos cadastrados ou publicados no momento.'
          }
          actionText={hasActiveFilters ? 'Limpar filtros' : 'Voltar ao início'}
          actionHref={hasActiveFilters ? '/loja' : '/'}
        />
      ) : (
        <div>
          {/* Contagem de itens */}
          <div className="text-xs text-neutral-500 uppercase tracking-widest mb-6">
            Exibindo {catalogResult.products.length} de {catalogResult.totalCount} camiseta(s)
          </div>

          {/* Grade Responsiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {catalogResult.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Controles de Paginação */}
          {catalogResult.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 pt-8 border-t border-neutral-200">
              <button
                disabled={pageParam <= 1}
                onClick={() => updateURLParams({ pagina: String(pageParam - 1) })}
                className={`p-2.5 border text-xs uppercase tracking-wider flex items-center gap-1 font-medium transition-colors ${
                  pageParam <= 1
                    ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                    : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                }`}
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <span className="text-xs font-medium text-neutral-600 tracking-wider">
                Página {pageParam} de {catalogResult.totalPages}
              </span>

              <button
                disabled={pageParam >= catalogResult.totalPages}
                onClick={() => updateURLParams({ pagina: String(pageParam + 1) })}
                className={`p-2.5 border text-xs uppercase tracking-wider flex items-center gap-1 font-medium transition-colors ${
                  pageParam >= catalogResult.totalPages
                    ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                    : 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                }`}
                aria-label="Próxima página"
              >
                Próxima <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
