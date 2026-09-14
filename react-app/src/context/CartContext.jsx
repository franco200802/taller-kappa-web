import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'kappa-cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((product, color = 'Negro Mate') => {
    const pid = product.id || product._id;
    const key = `${pid}-${color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { key, product, color, qty: 1 }];
    });
    showToast(`"${product.name}" (${color}) agregado al presupuesto`);
  }, [showToast]);

  const changeQty = useCallback((key, delta) => {
    setCart((prev) => prev
      .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0));
  }, []);

  const removeItem = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const whatsappLink = useMemo(() => {
    if (cart.length === 0) return '#';
    const lines = cart.map(({ product, color, qty }) =>
      `- ${product.name} x${qty} (Acabado: ${color})`).join('\n');
    const msg = encodeURIComponent(
      `Hola Taller Kappa! Quisiera cotizar:\n${lines}\n\nPor favor indicarme precio final y tiempo de entrega.`);
    return `https://wa.me/541161242498?text=${msg}`;
  }, [cart]);

  const value = {
    cart, totalItems, isOpen, toast,
    setIsOpen, addToCart, changeQty, removeItem, showToast, whatsappLink,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
