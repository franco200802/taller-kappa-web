import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, changeQty, removeItem, whatsappLink, showToast } = useCart();

  const printBudget = () => {
    if (cart.length === 0) { showToast('Tu presupuesto está vacío.'); return; }
    const lines = cart.map(({ product, color, qty }) =>
      `<tr><td>${product.name}</td><td>${color}</td><td style="text-align:center">${qty}</td><td style="color:#888;font-style:italic">A cotizar</td></tr>`
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
      <p style="color:#888;font-size:.9rem;margin-bottom:20px">Calle 28 Nº 3779 · San Martín · 11 6124-2498 · tallerkappa.com.ar</p>
      <p class="note">⚠️ Presupuesto orientativo. Precios finales se confirman por WhatsApp.</p>
      <table><thead><tr><th>Producto</th><th>Acabado</th><th>Cant.</th><th>Precio</th></tr></thead>
      <tbody>${lines}</tbody></table>
      <div class="footer"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}<br>
      Confirmá el pedido por WhatsApp al <strong>11 6124-2498</strong></div>
      <script>window.onload=()=>{window.print();}<\/script></body></html>`);
    win.document.close();
  };

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Presupuesto"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3><i className="fas fa-shopping-bag" style={{ marginRight: 8, color: 'var(--primary)' }} /> Tu Presupuesto</h3>
          <button className="cart-close" aria-label="Cerrar presupuesto" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="cart-empty">
              <i className="fas fa-box-open" style={{ fontSize: '2.5rem', color: '#ddd', display: 'block', marginBottom: 15 }} />
              Tu lista está vacía.<br /><small>Explorá el catálogo y agregá productos.</small>
            </p>
          ) : cart.map(({ key, product, color, qty }) => (
            <div className="cart-item" key={key}>
              <div className="cart-item-info">
                <img src={product.image} alt={product.name} width={product.imageWidth} height={product.imageHeight} loading="lazy" />
                <div>
                  <b>{product.name}</b>
                  <small className="cart-item-color"><i className="fas fa-palette" /> {color}</small>
                </div>
              </div>
              <div className="cart-item-qty">
                <button className="qty-btn" onClick={() => changeQty(key, -1)}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => changeQty(key, 1)}>+</button>
                <button className="remove-item" onClick={() => removeItem(key)}><i className="fas fa-trash-alt" /></button>
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
          <a
            href={whatsappLink}
            className="btn-whatsapp-checkout"
            target="_blank" rel="noopener noreferrer"
            style={cart.length === 0 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
          >
            <i className="fab fa-whatsapp" /> Cotizar por WhatsApp
          </a>
          <button className="btn-print-budget" onClick={printBudget}>
            <i className="fas fa-file-pdf" /> Descargar presupuesto
          </button>
          <p className="cart-hint">Consultá por WhatsApp para coordinar tu pedido.</p>
        </div>
      </div>
    </div>
  );
}
