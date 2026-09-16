import { createContext } from 'react';
import type { ValidatedCartItem } from '../services/cartService';

export interface AddToCartResult {
  success: boolean;
  message?: string;
}

export interface CartContextType {
  items: ValidatedCartItem[];
  totalUnits: number;
  subtotalInCents: number;
  isLoading: boolean;
  warnings: string[];
  addToCart: (variantId: string, quantityToAdd: number) => Promise<AddToCartResult>;
  updateQuantity: (variantId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  dismissWarning: (index: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
