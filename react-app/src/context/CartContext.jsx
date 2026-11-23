import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { QUOTE_KINDS } from '../data/contact';
import { trackEvent } from '../lib/analytics';
import { isFirebaseConfigured, loadFireDB } from '../lib/firebaseConfig';
import { LIMITS, presupuestoDoc, presupuestoKey, quoteMessage as buildQuoteMessage } from '../lib/leads';

const CartContext = createContext(null);
const STORAGE_KEY = 'kappa-cart';
const QUOTE_KEY = 'kappa-quote-contact';
const EMPTY_QUOTE = { name: '', zone: '', kind: '', comment: '' };

export function CartProvider({ children }) {
  // El carrito guardado se lee DESPUÉS de montar, no en el estado inicial:
  // el HTML prerenderizado siempre sale con el carrito vacío, y si el
  // primer render del cliente ya mostrara "2" en el badge, la hidratación
  // no coincidiría y React descartaría el HTML de la página.
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // { msg, action?: { label, onClick } } o null. La acción ("Ver presupuesto") es opcional.
  const [toast, setToast] = useState(null);
  // Cuenta los productos agregados: la barra la usa para que el contador "lata" una vez por cada uno.
  const [addedCount, setAddedCount] = useState(0);
  // Datos opcionales que el taller necesita para cotizar (el destino cambia el costo de envío).
  // `kind` separa la consulta de un particular de la de un local o empresa (cambia cómo responde el taller).
  // `comment`: medidas a medida u otros detalles ("Comentarios o medidas" en el mensaje).
  const [quote, setQuote] = useState(EMPTY_QUOTE);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved) && saved.length) setCart(saved);
      const savedQuote = JSON.parse(sessionStorage.getItem(QUOTE_KEY) || 'null');
      if (savedQuote && typeof savedQuote === 'object') {
        setQuote({
          name: String(savedQuote.name ?? ''),
          zone: String(savedQuote.zone ?? ''),
          kind: QUOTE_KINDS[savedQuote.kind] ? savedQuote.kind : '',
          comment: String(savedQuote.comment ?? '').slice(0, LIMITS.comment),
        });
      }
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
  // cerrar prematuramente al segundo. Con una acción dura un poco más (hay que llegar a tocarla).
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const hideToast = useCallback(() => { clearTimeout(toastTimer.current); setToast(null); }, []);
  const showToast = useCallback((msg, action = null) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, action });
    toastTimer.current = setTimeout(() => setToast(null), action ? 5000 : 3000);
  }, []);

  const openQuote = useCallback(() => { hideToast(); setIsOpen(true); }, [hideToast]);

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
    setAddedCount((n) => n + 1);
    // El aviso trae el atajo al presupuesto: antes había que encontrar el ícono de la barra.
    showToast(`"${product.name}" (${color}) agregado al presupuesto`, { label: 'Ver presupuesto', onClick: openQuote });
    // Se mide acá y no en cada botón: así cuentan igual la landing, la ficha, el catálogo y el modal.
    trackEvent('add_to_cart', { item_name: product.name, color, page_path: window.location.pathname });
  }, [showToast, openQuote]);

  const changeQty = useCallback((key, delta) => {
    setCart((prev) => prev
      .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
      .filter((i) => i.qty > 0));
  }, []);

  const removeItem = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  // Pedido de presupuesto, no de compra: no se cobra nada en el sitio (ver quoteMessage en lib/leads.js).
  const quoteMessage = useMemo(() => buildQuoteMessage(cart, quote), [cart, quote]);

  // Copia del presupuesto en Firestore, para verlo en /admin. Corre en segundo plano al tocar el
  // botón de WhatsApp y nunca lo demora ni lo bloquea. Si el mismo pedido ya se guardó (la persona
  // volvió a tocar el botón), no se duplica. Sin Firebase configurado no hace nada.
  const savedQuote = useRef(null);
  const saveQuote = useCallback(() => {
    if (!isFirebaseConfigured || cart.length === 0) return;
    const data = presupuestoDoc(cart, quote);
    const key = presupuestoKey(data);
    if (savedQuote.current === key) return;
    savedQuote.current = key;
    loadFireDB()
      .then((db) => db.createPresupuesto(data))
      .catch((err) => {
        savedQuote.current = null; // se podrá reintentar en el próximo toque
        trackEvent('presupuesto_save_failed', { reason: err?.code ?? 'error' });
      });
  }, [cart, quote]);

  const value = useMemo(() => ({
    cart, totalItems, isOpen, toast, addedCount,
    quote, setQuote,
    setIsOpen, addToCart, changeQty, removeItem, showToast, hideToast, quoteMessage, saveQuote,
  }), [cart, totalItems, isOpen, toast, addedCount, quote, addToCart, changeQty, removeItem, showToast, hideToast, quoteMessage, saveQuote]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
