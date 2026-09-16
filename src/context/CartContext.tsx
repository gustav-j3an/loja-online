import React, { useEffect, useState, useCallback } from 'react';
import {
  getLocalCart,
  saveLocalCart,
  fetchAndValidateCart,
} from '../services/cartService';
import type {
  LocalCartItem,
  ValidatedCartItem,
} from '../services/cartService';
import { CartContext } from './CartContextObject';
import type { AddToCartResult } from './CartContextObject';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localItems, setLocalItems] = useState<LocalCartItem[]>(() => getLocalCart());
  const [items, setItems] = useState<ValidatedCartItem[]>([]);
  const [subtotalInCents, setSubtotalInCents] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sincroniza localItems com o localStorage sempre que mudar
  useEffect(() => {
    saveLocalCart(localItems);
  }, [localItems]);

  // Revalida o carrinho contra o banco/serviço sempre que localItems mudar
  const revalidateCart = useCallback(() => {
    let isMounted = true;
    fetchAndValidateCart(localItems)
      .then(res => {
        if (!isMounted) return;
        setItems(res.items);
        setSubtotalInCents(res.subtotalInCents);
        setTotalUnits(res.totalUnits);

        if (res.warnings.length > 0) {
          setWarnings(prev => Array.from(new Set([...prev, ...res.warnings])));
          const cleanLocal: LocalCartItem[] = res.items.map(i => ({
            variantId: i.variantId,
            quantity: i.quantity,
          }));
          setLocalItems(cleanLocal);
        }
      })
      .catch(err => {
        console.error('Falha ao revalidar carrinho:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [localItems]);

  useEffect(() => {
    return revalidateCart();
  }, [revalidateCart]);

  const addToCart = async (variantId: string, quantityToAdd: number): Promise<AddToCartResult> => {
    if (quantityToAdd <= 0) {
      return { success: false, message: 'A quantidade deve ser maior que zero.' };
    }

    const existingIndex = localItems.findIndex(item => item.variantId === variantId);
    let currentQtyInCart = 0;
    if (existingIndex >= 0) {
      currentQtyInCart = localItems[existingIndex].quantity;
    }

    const targetQuantity = currentQtyInCart + quantityToAdd;

    // Verificar estoque atual da variante no banco antes de adicionar
    const validation = await fetchAndValidateCart([{ variantId, quantity: targetQuantity }]);
    const validVariant = validation.items[0];

    if (!validVariant || validVariant.availableStock <= 0) {
      return { success: false, message: 'Variação esgotada em estoque.' };
    }

    if (targetQuantity > validVariant.availableStock) {
      const availableCanAdd = validVariant.availableStock - currentQtyInCart;
      if (availableCanAdd <= 0) {
        return {
          success: false,
          message: `Você já possui o limite máximo (${validVariant.availableStock} unidades) desta peça na sacola.`,
        };
      }
      return {
        success: false,
        message: `Não foi possível adicionar ${quantityToAdd} unidades. Estoque máximo disponível: ${validVariant.availableStock}.`,
      };
    }

    setLocalItems(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(i => i.variantId === variantId);
      if (idx >= 0) {
        copy[idx] = { variantId, quantity: copy[idx].quantity + quantityToAdd };
      } else {
        copy.push({ variantId, quantity: quantityToAdd });
      }
      return copy;
    });

    return { success: true };
  };

  const updateQuantity = async (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setLocalItems(prev => {
      return prev.map(i => {
        if (i.variantId === variantId) {
          return { ...i, quantity: newQuantity };
        }
        return i;
      });
    });
  };

  const removeFromCart = (variantId: string) => {
    setLocalItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  const clearCart = () => {
    setLocalItems([]);
  };

  const dismissWarning = (index: number) => {
    setWarnings(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalUnits,
        subtotalInCents,
        isLoading,
        warnings,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        dismissWarning,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
