import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { ProductWithDetails } from '../types/database.types';
import { getProductBySlug, formatPrice } from '../services/catalogService';
import { useCart } from '../context/useCart';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Check, ShieldCheck, Ruler, Minus, Plus, AlertCircle, ShoppingBag } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [cartErrorMsg, setCartErrorMsg] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    getProductBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        if (data && data.product_variants.length > 0) {
          const availableColors = Array.from(new Set(data.product_variants.map((v) => v.color)));
          const defaultColor = availableColors[0] || '';
          setSelectedColor(defaultColor);

          const availableSizesForColor = data.product_variants
            .filter((v) => v.color === defaultColor)
            .map((v) => v.size);
          const defaultSize = availableSizesForColor[0] || '';
          setSelectedSize(defaultSize);
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
  }, [slug]);

  // Cálculo derivado da variante selecionada diretamente na renderização (sem setState em useEffect)
  const selectedVariant = product?.product_variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize && v.is_active
  ) || null;

  const currentStock = selectedVariant ? selectedVariant.stock : 0;
  const isAvailable = Boolean(selectedVariant && currentStock > 0);

  if (loading) return <LoadingState message="Carregando detalhes da camiseta..." />;
  if (error) return <ErrorState onRetry={() => window.location.reload()} />;
  if (!product) {
    return (
      <EmptyState
        title="Camiseta não encontrada"
        message="A peça solicitada não foi localizada ou não está mais disponível em nosso acervo."
        actionText="Voltar para a loja"
        actionHref="/loja"
      />
    );
  }

  const images = product.product_images?.length > 0
    ? product.product_images
    : [{ id: 'placeholder', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000', alt_text: product.name, display_order: 0 }];

  const colors = Array.from(new Set(product.product_variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.product_variants.map((v) => v.size)));

  const incrementQuantity = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSelectColor = (color: string) => {
    setCartErrorMsg(null);
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleSelectSize = (size: string) => {
    setCartErrorMsg(null);
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return;
    setCartErrorMsg(null);
    setIsAdding(true);

    const res = await addToCart(selectedVariant.id, quantity);
    setIsAdding(false);

    if (res.success) {
      navigate('/carrinho');
    } else if (res.message) {
      setCartErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-wider text-neutral-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-neutral-900 transition-colors">Início</Link>
        <span>/</span>
        <Link to="/loja" className="hover:text-neutral-900 transition-colors">Loja</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Galeria de Fotos Responsiva */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 bg-neutral-100 flex-shrink-0 overflow-hidden border transition-all ${
                    selectedImageIndex === idx ? 'border-neutral-900' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagem ${idx + 1} de ${product.name}`}
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" width="80" height="96" />
                </button>
              ))}
            </div>
          )}

          {/* Imagem Principal */}
          <div className="flex-grow aspect-[3/4] bg-neutral-100 overflow-hidden">
            <img
              src={images[selectedImageIndex]?.image_url}
              alt={images[selectedImageIndex]?.alt_text || product.name}
              className="w-full h-full object-cover object-center"
              width="600"
              height="800"
            />
          </div>
        </div>

        {/* Informações da Peça e Seletores */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {product.category && (
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          <div className="text-xl font-medium text-neutral-900">
            {formatPrice(product.price_in_cents)}
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-light pt-2 border-t border-neutral-200">
            {product.description}
          </p>

          {/* Seletor de Cor */}
          {colors.length > 0 && (
            <div className="pt-4 border-t border-neutral-100">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium block mb-3">
                Cor: <span className="text-neutral-900 font-normal">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSelectColor(color)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
                      selectedColor === color
                        ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seletor de Tamanho */}
          {sizes.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                  Tamanho: <span className="text-neutral-900 font-normal">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-neutral-600 hover:text-neutral-900 underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" /> Guia de Medidas
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantObj = product.product_variants.find(
                    (v) => v.color === selectedColor && v.size === size && v.is_active
                  );
                  const hasStock = Boolean(variantObj && variantObj.stock > 0);

                  return (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className={`w-12 h-12 text-xs uppercase tracking-wider border transition-colors flex items-center justify-center relative ${
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                          : hasStock
                          ? 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-400 opacity-60'
                      }`}
                      title={hasStock ? `Tamanho ${size}` : `Tamanho ${size} (Esgotado)`}
                    >
                      {size}
                      {!hasStock && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-[1px] bg-neutral-400 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guia de Medidas sem números inventados */}
          {showSizeGuide && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs space-y-3">
              <div className="flex items-center justify-between font-semibold uppercase tracking-wider text-neutral-900">
                <span>Guia de Medidas Oficial</span>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-neutral-400 hover:text-neutral-900 text-xs"
                >
                  Fechar
                </button>
              </div>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                As especificações e tabela com o detalhamento exato de medidas (tórax, comprimento e manga) desta modelagem autoral serão cadastradas e disponibilizadas oficialmente na ficha do produto.
              </p>
            </div>
          )}

          {/* Indicador de Estoque da Variação Selecionada */}
          <div className="pt-2 text-xs font-medium">
            {!selectedVariant ? (
              <span className="text-amber-600">Selecione cor e tamanho válidos</span>
            ) : currentStock > 0 ? (
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <Check className="w-4 h-4" /> Em estoque ({currentStock} unidades disponíveis)
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-4 h-4" /> Esgotado para esta variação ({selectedColor} / {selectedSize})
              </span>
            )}
          </div>

          {/* Seletor de Quantidade (Limitado ao estoque da variação) */}
          {isAvailable && (
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                Quantidade:
              </span>
              <div className="flex items-center border border-neutral-300 bg-white">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-medium text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={quantity >= currentStock}
                  className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-neutral-400">
                Max: {currentStock} unidades
              </span>
            </div>
          )}

          {/* Erro de adição no carrinho */}
          {cartErrorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {cartErrorMsg}
            </div>
          )}

          {/* Botão de Adicionar ao Carrinho */}
          <div className="pt-2">
            <button
              disabled={!isAvailable || isAdding}
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 ${
                isAvailable
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isAdding ? 'Adicionando...' : isAvailable ? 'Adicionar ao carrinho' : 'Esgotado'}
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-neutral-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-400 stroke-1" />
            <span>Produto autoral em lote limitado com acabamento de alta precisão</span>
          </div>
        </div>
      </div>
    </div>
  );
};
