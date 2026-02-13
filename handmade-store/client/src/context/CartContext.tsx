import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { Cart } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return; }
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch { setCart(null); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number) => {
    const res = await api.post('/cart/add', { productId, quantity });
    setCart(res.data);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await api.put(`/cart/item/${productId}`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (productId: string) => {
    const res = await api.delete(`/cart/item/${productId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart(null);
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, fetchCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
