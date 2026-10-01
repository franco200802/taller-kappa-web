import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { whatsappUrl } from '../data/contact';

const CartContext = createContext(null);
const STORAGE_KEY = 'kappa-cart';
const QUOTE_KEY = 'kappa-quote-contact';

export function CartProvider({ children }) {
  // El carrito guardado se lee DESPUÉS de montar, no en el estado inicial:
  // el HTML prerenderizado siempre sale con el carrito vacío, y si el
  // primer render del cliente ya mostrara "2" en el badge, la hidratación
  // no coincidiría y React descartaría el HTML de la página.
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  // Datos opcionales que el taller necesita para cotizar (el destino cambia el costo de envío).
  const [quote, setQuote] = useState({ name: '', zone: '' });

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved) && saved.length) setCart(saved);
      const savedQuote = JSON.parse(sessionStorage.getItem(QUOTE_KEY) || 'null');
      if (savedQuote && typeof savedQuote === 'object') setQuote({ name: String(savedQuote.name ?? ''), zone: String(savedQuote.zone ?? '') });
    } catch { /* storage bloqueado o JSON inválido: se arranca vacío */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    // No persistir hasta haber leído lo guardado, o se pisaría con [].
    // sessionStorage puede lanzar (modo privado, cuota llena): el carrito
    // sigue funcionando en memoria aunque no se pueda persistir.
    if (!loaded) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      sessionStorage.setItem(QUOTE_KEY, JSON.stringify(quote));
    } catch { /* noop */ }
  }, [cart, quote, loaded]);

  // Un solo timer: si se muestran dos toasts seguidos, el primero no debe
  // cerrar prematuramente al segundo.
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
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
    // Pedido de presupuesto, no de compra: no se cobra nada en el sitio. El texto va
    // ordenado para que el taller pueda responder con precio y plazo sin repreguntar.
    const lines = cart.map(({ product, color, qty }, i) =>
      `${i + 1}. ${product.name} - ${qty} ${qty === 1 ? 'unidad' : 'unidades'} - Acabado: ${color}`).join('\n');
    const name = quote.name.trim();
    const zone = quote.zone.trim();
    const details = [name && `Nombre: ${name}`, zone && `Zona de entrega: ${zone}`].filter(Boolean).join('\n');
    return whatsappUrl(
      `Hola Taller Kappa! Quisiera pedir un presupuesto:\n\n${lines}\n\nTotal: ${totalItems} ${totalItems === 1 ? 'unidad' : 'unidades'}${details ? `\n${details}` : ''}\n\nPor favor, indicarme el precio final y el plazo de entrega. Gracias!`);
  }, [cart, quote, totalItems]);

  const value = useMemo(() => ({
    cart, totalItems, isOpen, toast,
    quote, setQuote,
    setIsOpen, addToCart, changeQty, removeItem, showToast, whatsappLink,
  }), [cart, totalItems, isOpen, toast, quote, addToCart, changeQty, removeItem, showToast, whatsappLink]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
