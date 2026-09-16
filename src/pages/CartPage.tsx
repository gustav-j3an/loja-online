import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/useCart';
import { formatPrice } from '../services/catalogService';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const {
    items,
    totalUnits,
    subtotalInCents,
    isLoading,
    warnings,
    updateQuantity,
    removeFromCart,
    dismissWarning,
  } = useCart();

  if (isLoading) {
    return <LoadingState message="Revalidando sacola de compras..." />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Sua sacola está vazia"
          message="Você ainda não adicionou nenhuma camiseta à sua sacola de compras."
          actionText="Explorar camisetas"
          actionHref="/loja"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Título & Subtítulo */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-neutral-900 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-neutral-900 stroke-1" /> Sacola de Compras
        </h1>
        <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">
          {totalUnits} {totalUnits === 1 ? 'item selecionado' : 'itens selecionados'}
        </p>
      </div>

      {/* Alertas de Revalidação de Estoque / Preço */}
      {warnings.length > 0 && (
        <div className="mb-8 space-y-2">
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>{warning}</span>
              </div>
              <button
                onClick={() => dismissWarning(idx)}
                className="text-amber-700 hover:text-amber-950 font-bold ml-4"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Lista de Itens do Carrinho */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {items.map((item) => (
              <div key={item.variantId} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Imagem + Nome + Cor/Tamanho */}
                <div className="flex items-center gap-4">
                  <Link to={`/produto/${item.productSlug}`} className="w-20 h-24 bg-neutral-100 flex-shrink-0 overflow-hidden block border border-neutral-200">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover object-center"
                      width="80"
                      height="96"
                    />
                  </Link>
                  <div className="flex flex-col space-y-1">
                    <Link
                      to={`/produto/${item.productSlug}`}
                      className="text-sm font-medium text-neutral-900 hover:underline tracking-tight"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-neutral-500 font-light flex items-center gap-3">
                      <span>Cor: <strong className="font-normal text-neutral-800">{item.color}</strong></span>
                      <span>•</span>
                      <span>Tamanho: <strong className="font-normal text-neutral-800">{item.size}</strong></span>
                    </div>
                    <span className="text-xs font-medium text-neutral-900 pt-1">
                      {formatPrice(item.unitPriceInCents)} un.
                    </span>
                  </div>
                </div>

                {/* Controles de Quantidade + Subtotal + Exclusão */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Seletor de Quantidade */}
                  <div className="flex items-center border border-neutral-300 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 text-neutral-600 hover:text-neutral-900"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal da Linha */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-sm font-semibold text-neutral-900 block">
                      {formatPrice(item.subtotalInCents)}
                    </span>
                  </div>

                  {/* Botão Remover */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.variantId)}
                    className="p-2 text-neutral-400 hover:text-rose-600 transition-colors"
                    title="Remover item da sacola"
                    aria-label={`Remover ${item.productName} (${item.color}/${item.size})`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/loja"
              className="text-xs uppercase tracking-widest text-neutral-900 font-medium hover:underline inline-flex items-center gap-1"
            >
              ← Continuar comprando
            </Link>
          </div>
        </div>

        {/* Resumo Financeiro da Sacola */}
        <div className="lg:col-span-4 bg-white p-6 border border-neutral-200 space-y-6">
          <h2 className="text-base font-medium tracking-tight text-neutral-900 border-b border-neutral-200 pb-3">
            Resumo do Pedido
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal ({totalUnits} unidades)</span>
              <span className="font-semibold text-neutral-900">{formatPrice(subtotalInCents)}</span>
            </div>

            <div className="flex justify-between text-neutral-600 pt-2 border-t border-neutral-100">
              <span>Frete</span>
              <span className="text-neutral-500 font-light italic">Calculado no checkout</span>
            </div>

            <div className="flex justify-between text-neutral-900 text-sm font-bold pt-4 border-t border-neutral-200">
              <span>Total Estimado</span>
              <span>{formatPrice(subtotalInCents)}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                alert('A etapa de Checkout será disponibilizada nas próximas missões.');
              }}
              className="w-full py-4 bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              Finalizar Compra <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-400 stroke-1" />
            <span>Transação segura. Valores calculados exclusivamente em Reais (R$).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
