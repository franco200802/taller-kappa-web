import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { WHATSAPP_DISPLAY } from '../data/contact';
import { BUSINESS } from '../data/business';
import Picture from './Picture';
import Modal from './Modal';
import { trackEvent } from '../lib/analytics';

// Los nombres pueden venir de Firestore: se escapan antes de interpolarlos
// en el HTML de la ventana de impresión.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, changeQty, removeItem, whatsappLink, showToast, quote, setQuote } = useCart();

  const printBudget = () => {
    if (cart.length === 0) { showToast('Tu presupuesto está vacío.'); return; }
    const lines = cart.map(({ product, color, qty }) =>
      `<tr><td>${esc(product.name)}</td><td>${esc(color)}</td><td style="text-align:center">${qty}</td><td style="color:#888;font-style:italic">A cotizar</td></tr>`
    ).join('');
    const win = window.open('', '_blank');
    if (!win) { showToast('El navegador bloqueó la ventana emergente.'); return; }
    win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
      <title>Presupuesto - Taller Kappa</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;color:#222}h1{color:#b71c1c}
      table{width:100%;border-collapse:collapse;margin-bottom:30px}
      th{background:#b71c1c;color:#fff;padding:12px;text-align:left}
      td{padding:12px;border-bottom:1px solid #eee}
      .note{background:#fff5f5;border-left:4px solid #b71c1c;padding:12px 16px;margin-bottom:20px;font-size:.85rem;color:#555}
      .footer{margin-top:30px;font-size:.8rem;color:#999;border-top:1px solid #eee;padding-top:15px}</style>
      </head><body>
      <h1>Taller Kappa S.R.L.</h1>
      <p style="color:#888;font-size:.9rem;margin-bottom:20px">${BUSINESS.address.street} · ${BUSINESS.address.locality} · CP ${BUSINESS.address.postalCode} · ${WHATSAPP_DISPLAY} · tallerkappa.com.ar</p>
      <p class="note">⚠️ Presupuesto orientativo. Precios finales se confirman por WhatsApp.</p>
      <table><thead><tr><th>Producto</th><th>Acabado</th><th>Cant.</th><th>Precio</th></tr></thead>
      <tbody>${lines}</tbody></table>
      <div class="footer"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}<br>
      Para el presupuesto final escribinos por WhatsApp al <strong>${WHATSAPP_DISPLAY}</strong></div>
      <script>window.onload=()=>{window.print();}<\/script></body></html>`);
    win.document.close();
  };

  return (
    <Modal className="cart-overlay" label="Presupuesto" open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Tu presupuesto</h2>
          <button className="cart-close" aria-label="Cerrar presupuesto" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="cart-empty">
              Tu lista está vacía.<br /><small>Explorá el catálogo y agregá productos.</small>
            </p>
          ) : cart.map(({ key, product, color, qty }) => (
            <div className="cart-item" key={key}>
              <div className="cart-item-info">
                <Picture src={product.image} alt={product.name} width={product.imageWidth} height={product.imageHeight} loading="lazy" sizes="64px" />
                <div>
                  <b>{product.name}</b>
                  <small className="cart-item-color"><Icon name="palette" /> {color}</small>
                </div>
              </div>
              <div className="cart-item-qty">
                <button className="qty-btn" aria-label={`Quitar una unidad de ${product.name}`} onClick={() => changeQty(key, -1)}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" aria-label={`Agregar una unidad de ${product.name}`} onClick={() => changeQty(key, 1)}>+</button>
                <button className="remove-item" aria-label={`Eliminar ${product.name}`} onClick={() => removeItem(key)}><Icon name="trash-alt" /></button>
              </div>
            </div>
          ))}
        </div>

        <div id="cart-footer">
          {cart.length > 0 && (
            <div className="cart-total" style={{ display: 'flex' }}>
              <span>Productos:</span>
              <span>{cart.reduce((s, i) => s + i.qty, 0)}</span>
            </div>
          )}
          {cart.length === 0 ? (
            // Con el presupuesto vacío no hay nada que cotizar: en lugar de un
            // botón apagado (que igual se podía enfocar), una salida real.
            <Link to="/catalogo/" className="btn-main" onClick={() => setIsOpen(false)}>Ver catálogo</Link>
          ) : (
            <>
              <div className="cart-contact">
                <label htmlFor="quote-name">Tu nombre (opcional)</label>
                <input id="quote-name" autoComplete="name" maxLength={80} value={quote.name} onChange={(e) => setQuote({ ...quote, name: e.target.value })} />
                <label htmlFor="quote-zone">Zona de entrega (opcional)</label>
                <input id="quote-zone" autoComplete="address-level2" maxLength={80} placeholder="Barrio o localidad" value={quote.zone} onChange={(e) => setQuote({ ...quote, zone: e.target.value })} />
              </div>
              <a
                href={whatsappLink}
                className="btn-whatsapp-checkout"
                target="_blank" rel="noopener noreferrer"
                // whatsapp_click lo envía trackClicks (con estos data-*); whatsapp_checkout suma el detalle del presupuesto.
                data-cta="presupuesto" data-item={cart.map((i) => i.product.name).join(', ')}
                onClick={() => trackEvent('whatsapp_checkout', { items: cart.length, qty: cart.reduce((s, i) => s + i.qty, 0) })}
              >
                <Icon name="whatsapp" /> Pedir presupuesto por WhatsApp
              </a>
              <button className="btn-print-budget" onClick={printBudget}>
                <Icon name="file-pdf" /> Descargar presupuesto
              </button>
            </>
          )}
          <p className="cart-hint">En el sitio no se paga nada: te respondemos con el presupuesto por WhatsApp.</p>
        </div>
      </div>
    </Modal>
  );
}
