import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { QUOTE_KINDS, WHATSAPP_DISPLAY, whatsappUrl } from '../data/contact';
import { BUSINESS } from '../data/business';
import { PRODUCTS, productHref } from '../data/products';
import Picture from './Picture';
import Modal from './Modal';
import { trackEvent } from '../lib/analytics';
import { isFirebaseConfigured } from '../lib/firebaseConfig';
import { LIMITS, commentLine, quoteItemOption } from '../lib/leads';
import { useLang } from '../i18n/LangContext';

// Los nombres pueden venir de Firestore y los datos opcionales los escribe la persona: se escapan antes de
// interpolarlos en el HTML de la ventana de impresión.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function selectQuoteMessage(field) {
  if (!field) return;
  field.focus({ preventScroll: true });
  field.select();
  field.scrollIntoView({ block: 'center' });
}

const units = (n) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`;

export default function CartDrawer() {
  const { cart, totalItems, isOpen, setIsOpen, changeQty, removeItem, quoteMessage, showToast, quote, setQuote, saveQuote } = useCart();
  const { lang, t } = useLang();
  const [manualCopy, setManualCopy] = useState(false);
  const close = () => setIsOpen(false);
  const setField = (field) => (e) => setQuote({ ...quote, [field]: e.target.value });

  const copyBudget = async () => {
    try {
      await navigator.clipboard.writeText(quoteMessage);
      setManualCopy(false);
      showToast(t('Mensaje copiado.'));
    } catch {
      setManualCopy(true);
      selectQuoteMessage(document.getElementById('quote-message'));
    }
  };

  // "Descargar presupuesto": una hoja imprimible (Guardar como PDF del navegador) con los productos, sus
  // variantes y los datos que la persona completó. Usa las fuentes del sitio y espera a que carguen.
  const printBudget = () => {
    if (cart.length === 0) { showToast(t('Tu presupuesto está vacío.')); return; }
    const lines = cart.map(({ product, color, qty }) =>
      `<tr><td>${esc(t(product.name))}</td><td>${esc(t(quoteItemOption(product, color)))}</td><td class="qty">${qty}</td><td class="price">${esc(t('A cotizar'))}</td></tr>`
    ).join('');
    const kind = QUOTE_KINDS[quote.kind];
    const comment = commentLine(quote).replace(/^Comentarios o medidas: /, '');
    const details = [
      [t('Nombre'), quote.name.trim()],
      [t('Es para'), kind && t(kind)],
      [t('Zona de entrega'), quote.zone.trim()],
      [t('Comentarios o medidas'), comment],
    ].filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    const win = window.open('', '_blank');
    if (!win) { showToast(t('El navegador bloqueó la ventana emergente.')); return; }
    const origin = window.location.origin;
    const date = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    win.document.write(`<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8">
      <title>${esc(t('Presupuesto - Taller Kappa'))}</title>
      <style>
      @font-face{font-family:'Instrument Serif';src:url('${origin}/fonts/instrument-serif-latin.woff2') format('woff2')}
      @font-face{font-family:'Archivo';font-weight:400 900;src:url('${origin}/fonts/archivo-latin-v2.woff2') format('woff2')}
      @page{margin:18mm}
      body{font-family:Archivo,Arial,sans-serif;color:#191817;margin:0;padding:24px;font-size:11pt;line-height:1.5}
      header{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;border-bottom:1px solid #191817;padding-bottom:14px;margin-bottom:28px}
      .brand{font-family:'Instrument Serif',Georgia,serif;font-size:30pt;line-height:1}
      .brand span{color:#B71C1C}
      .meta{font-size:8.5pt;color:#5C5852;text-align:right}
      h1{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:22pt;line-height:1.1;margin:0 0 6px}
      .note{font-size:9.5pt;color:#5C5852;margin:0 0 22px}
      table{width:100%;border-collapse:collapse;margin-bottom:24px}
      th{font-size:8.5pt;font-weight:600;text-align:left;color:#5C5852;border-bottom:1px solid #191817;padding:8px 10px 8px 0}
      td{padding:10px 10px 10px 0;border-bottom:1px solid #D9D3C7;vertical-align:top}
      .qty{text-align:center}.price{color:#5C5852;font-style:italic}
      dl{display:grid;grid-template-columns:max-content 1fr;gap:6px 18px;font-size:10pt;margin:0 0 28px}
      dt{color:#5C5852}dd{margin:0}
      footer{border-top:1px solid #D9D3C7;padding-top:12px;font-size:8.5pt;color:#5C5852}
      </style></head><body>
      <header><div class="brand">Taller <span>Kappa</span></div>
      <div class="meta">${esc(BUSINESS.legalName)}<br>${esc(BUSINESS.address.street)} · ${esc(BUSINESS.address.locality)} · CP ${esc(BUSINESS.address.postalCode)}<br>WhatsApp ${WHATSAPP_DISPLAY} · tallerkappa.com.ar</div></header>
      <h1>${esc(t('Pedido de presupuesto'))}</h1>
      <p class="note">${esc(t('Presupuesto orientativo. Precios finales se confirman por WhatsApp.'))}</p>
      <table><thead><tr><th>${esc(t('Producto'))}</th><th>${esc(t('Acabado o variante'))}</th><th class="qty">${esc(t('Cant.'))}</th><th>${esc(t('Precio'))}</th></tr></thead>
      <tbody>${lines}</tbody></table>
      ${details ? `<dl>${details}</dl>` : ''}
      <footer><strong>${esc(t('Fecha:'))}</strong> ${esc(date)}<br>
      ${esc(t('Para el presupuesto final escribinos por WhatsApp al'))} <strong>${WHATSAPP_DISPLAY}</strong></footer>
      <script>window.onload=function(){(document.fonts&&document.fonts.ready||Promise.resolve()).then(function(){window.print();});};<\/script></body></html>`);
    win.document.close();
  };

  return (
    <Modal className="cart-overlay" label="Presupuesto" open={isOpen} onClose={close}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Tu presupuesto{totalItems > 0 && <span className="cart-count">{units(totalItems)}</span>}</h2>
          <button className="cart-close" aria-label="Cerrar presupuesto" onClick={close}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            // Vacío: en lugar de un texto suelto, los productos (con su foto) para empezar a elegir.
            <div className="cart-empty">
              <p><strong>Todavía no agregaste productos.</strong>Elegí un producto y sus opciones; después pedís el precio por WhatsApp, sin pagar nada en el sitio.</p>
              <ul className="cart-suggest">
                {PRODUCTS.map((p) => (
                  <li key={p.slug}>
                    <Link to={productHref(p)} onClick={close}>
                      <Picture src={p.image} alt="" width={p.imageWidth} height={p.imageHeight} loading="lazy" sizes="56px" />
                      <span>{p.name}<small>{p.specs[0]}</small></span>
                      <Icon name="chevron-right" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : cart.map(({ key, product, color, qty }) => (
            <div className="cart-item" key={key}>
              <div className="cart-item-info">
                <Picture src={product.image} alt="" width={product.imageWidth} height={product.imageHeight} loading="lazy" sizes="72px" />
                <div>
                  {/* El nombre lleva a la ficha: ahí se cambia el acabado o las medidas. */}
                  {product.slug
                    ? <Link to={productHref(product)} className="cart-item-name" onClick={close}>{product.name}</Link>
                    : <b className="cart-item-name">{product.name}</b>}
                  <small className="cart-item-color"><Icon name="palette" /> {quoteItemOption(product, color)}</small>
                </div>
              </div>
              <div className="cart-item-qty">
                <div className="qty-stepper">
                  <button className="qty-btn" aria-label={`Quitar una unidad de ${product.name}`} onClick={() => changeQty(key, -1)}>−</button>
                  <span className="qty-value" aria-live="polite">{qty}</span>
                  <button className="qty-btn" aria-label={`Agregar una unidad de ${product.name}`} onClick={() => changeQty(key, 1)}>+</button>
                </div>
                <button className="remove-item" aria-label={`Eliminar ${product.name}`} onClick={() => removeItem(key)}><Icon name="trash-alt" /></button>
              </div>
            </div>
          ))}
          {manualCopy && cart.length > 0 && (
            <div className="form-group cart-manual-copy">
              <p className="form-hint">Copiá el texto y pegalo en el chat de Taller Kappa.</p>
              <label htmlFor="quote-message">Mensaje del presupuesto</label>
              <textarea id="quote-message" ref={selectQuoteMessage} value={quoteMessage} readOnly />
              <a className="btn-outline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" data-cta="presupuesto_chat">
                Abrir el chat de Taller Kappa
              </a>
            </div>
          )}
          {cart.length > 0 && (
            <div className="cart-contact">
              <h3 className="cart-contact-title">Tus datos (opcional)</h3>
              <p className="cart-contact-hint">Con la zona y para quién es, te respondemos el precio y el envío sin repreguntar.</p>
              <label htmlFor="quote-name">Tu nombre</label>
              <input id="quote-name" autoComplete="name" maxLength={80} value={quote.name} onChange={setField('name')} />
              <label htmlFor="quote-kind">¿Para quién es?</label>
              <select id="quote-kind" value={quote.kind} onChange={setField('kind')}>
                <option value="">Elegí una opción…</option>
                {Object.entries(QUOTE_KINDS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <label htmlFor="quote-zone">Zona de entrega</label>
              <input id="quote-zone" autoComplete="address-level2" maxLength={80} placeholder="Barrio o localidad" value={quote.zone} onChange={setField('zone')} />
              <label htmlFor="quote-comment">Comentarios o medidas a medida</label>
              <textarea id="quote-comment" maxLength={LIMITS.comment} placeholder="Ej.: 4 bancos para un local, en blanco crema" value={quote.comment} onChange={setField('comment')} />
            </div>
          )}
        </div>

        <div id="cart-footer">
          {cart.length === 0 ? (
            // Con el presupuesto vacío no hay nada que cotizar: en lugar de un
            // botón apagado (que igual se podía enfocar), una salida real.
            <Link to="/catalogo/" className="btn-main" onClick={close}>Ver catálogo</Link>
          ) : (
            <>
              <div className="cart-total" style={{ display: 'flex' }}>
                <span>Productos:</span>
                <span>{totalItems} <small>· precio por WhatsApp</small></span>
              </div>
              <a
                href={whatsappUrl(quoteMessage)}
                className="btn-whatsapp-checkout"
                target="_blank" rel="noopener noreferrer"
                // whatsapp_click lo envía trackClicks (con estos data-*); whatsapp_checkout suma el detalle del presupuesto.
                data-cta="presupuesto" data-item={cart.map((i) => i.product.name).join(', ')}
                onClick={() => { saveQuote(); trackEvent('whatsapp_checkout', { items: cart.length, qty: totalItems, customer_type: quote.kind || '(sin especificar)', has_zone: quote.zone.trim() ? 'si' : 'no', has_comment: quote.comment.trim() ? 'si' : 'no' }); }}
              >
                <Icon name="whatsapp" /> Pedir presupuesto por WhatsApp
              </a>
              <div className="cart-secondary-actions">
                <button type="button" className="btn-print-budget" onClick={copyBudget}>Copiar mensaje</button>
                <button type="button" className="btn-print-budget" onClick={printBudget}>
                  <Icon name="file-pdf" /> Descargar presupuesto
                </button>
              </div>
              <p className="cart-hint">Enviá el mensaje desde WhatsApp para pedir el presupuesto.</p>
            </>
          )}
          {isFirebaseConfigured && cart.length > 0 && <p className="cart-hint">Al abrir WhatsApp se intenta guardar una copia del pedido.</p>}
        </div>
      </div>
    </Modal>
  );
}
