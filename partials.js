/**
 * TALLER KAPPA — partials.js
 * Inyecta el navbar, elementos flotantes y footer en todas las páginas.
 * También gestiona el resaltado de la página activa en el menú.
 */

(function () {
    'use strict';

    /* ── Detectar página actual ── */
    const page = window.location.pathname.split('/').pop() || 'index.html';

    /* ── Navbar ── */
    const navLinks = [
        { href: 'index.html',      label: 'Inicio',     icon: 'fas fa-home' },
        { href: 'catalogo.html',   label: 'Catálogo',   icon: 'fas fa-th-large' },
        { href: 'sillon-bkf.html', label: 'Sillón BKF', icon: 'fas fa-chair' },
        { href: 'proyectos.html',  label: 'Proyectos',  icon: 'fas fa-briefcase' },
        { href: 'nosotros.html',   label: 'Nosotros',   icon: 'fas fa-users' },
        { href: 'faq.html',        label: 'Preguntas',  icon: 'fas fa-question-circle' },
        { href: 'contacto.html',   label: 'Contacto',   icon: 'fas fa-envelope' },
    ];

    const navHTML = `
    <nav id="main-nav">
        <a href="index.html" class="logo" aria-label="Inicio — Taller Kappa">
            Taller <span>Kappa</span>
        </a>

        <ul class="nav-menu" id="nav-menu" role="list">
            ${navLinks.map(l => `
                <li>
                    <a href="${l.href}"
                       class="nav-link${page === l.href ? ' active-page' : ''}"
                       ${page === l.href ? 'aria-current="page"' : ''}>
                        ${l.label}
                    </a>
                </li>`).join('')}
        </ul>

        <div class="nav-actions">
            <div class="cart-icon-container" id="cart-toggle-btn" role="button" tabindex="0" aria-label="Abrir presupuesto">
                <i class="fas fa-shopping-bag" style="font-size:1.2rem;"></i>
                <span class="cart-badge" id="cart-count">0</span>
            </div>
            <button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </div>
    </nav>`;

    /* ── Footer ── */
    const footerHTML = `
    <footer id="contacto" aria-label="Información de contacto">
        <div class="footer-content">
            <div class="footer-col">
                <span class="footer-logo">Taller Kappa</span>
                <div class="footer-info">
                    <p><strong>Fábrica &amp; Showroom</strong></p>
                    <p><i class="fas fa-map-marker-alt"></i> Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
                    <p><i class="fab fa-whatsapp"></i> <a href="https://wa.me/541161242498" target="_blank" rel="noopener">11 6124-2498</a></p>
                    <p><i class="far fa-envelope"></i> <a href="mailto:ing.franciscomarotta@gmail.com">ing.franciscomarotta@gmail.com</a></p>
                </div>
                <div class="footer-nav">
                    ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
                </div>
            </div>
            <div class="footer-col">
                <div class="footer-map">
                    <iframe
                        src="https://maps.google.com/maps?q=-34.5851938,-58.5281526&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        title="Ubicación Taller Kappa en Google Maps"
                        allowfullscreen loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </div>
        <p class="footer-copy">© 2026 Taller Kappa S.R.L. — Todos los derechos reservados.</p>
    </footer>`;

    /* ── Elementos flotantes ── */
    const floatingHTML = `
    <a href="https://wa.me/541161242498" class="float-wa" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>
    <button id="back-to-top" aria-label="Volver al inicio">
        <i class="fas fa-chevron-up"></i>
    </button>
    <!-- Carrito lateral (compartido) -->
    <div class="cart-overlay" id="cart-overlay" role="dialog" aria-modal="true" aria-label="Presupuesto">
        <div class="cart-sidebar">
            <div class="cart-header">
                <h3><i class="fas fa-shopping-bag" style="margin-right:8px;color:var(--primary)"></i> Tu Presupuesto</h3>
                <button class="cart-close" id="cart-close-btn" aria-label="Cerrar presupuesto">×</button>
            </div>
            <div class="cart-items" id="cart-items-container">
                <p class="cart-empty">
                    <i class="fas fa-box-open" style="font-size:2.5rem;color:#ddd;display:block;margin-bottom:15px;"></i>
                    Tu lista está vacía.<br>
                    <small>Explorá el catálogo y agregá productos.</small>
                </p>
            </div>
            <div id="cart-footer">
                <div class="cart-total" id="cart-total-container" style="display:none;">
                    <span>Total:</span>
                    <span id="cart-total-price">$0</span>
                    <small style="color:#999;margin-left:4px;">(<span id="cart-total-qty">0</span> artículos)</small>
                </div>
                <div id="buyer-info-form" style="display:none;margin-bottom:12px;">
                    <p style="font-size:.85rem;font-weight:600;margin-bottom:8px;">📋 Tus datos para coordinar el envío:</p>
                    <input type="text" id="buyer-name" placeholder="Nombre completo *" style="width:100%;padding:8px 10px;margin-bottom:6px;border:1px solid #ddd;border-radius:6px;font-size:.88rem;">
                    <input type="email" id="buyer-email" placeholder="Email *" style="width:100%;padding:8px 10px;margin-bottom:6px;border:1px solid #ddd;border-radius:6px;font-size:.88rem;">
                    <input type="tel" id="buyer-phone" placeholder="Teléfono / WhatsApp *" style="width:100%;padding:8px 10px;margin-bottom:6px;border:1px solid #ddd;border-radius:6px;font-size:.88rem;">
                    <p id="buyer-error" style="display:none;color:#e74c3c;font-size:.8rem;margin-top:4px;"></p>
                </div>
                <button class="btn-mp-checkout" id="mp-checkout-btn" disabled>
                    <i class="fas fa-credit-card"></i> Pagar con MercadoPago
                </button>
                <a href="#" class="btn-whatsapp-checkout" id="wa-checkout-btn" target="_blank" rel="noopener" style="opacity:.5;pointer-events:none;">
                    <i class="fab fa-whatsapp"></i> Cotizar por WhatsApp
                </a>
                <button class="btn-print-budget" id="btn-print-budget">
                    <i class="fas fa-file-pdf"></i> Descargar presupuesto
                </button>
                <p class="cart-hint">Pagá online o consultá por WhatsApp.</p>
            </div>
        </div>
    </div>
    <!-- Toast -->
    <div id="toast" role="status" aria-live="polite"></div>
    <!-- Popup WA reminder -->
    <div class="wa-reminder-popup" id="wa-reminder-popup" role="alertdialog" aria-label="Recordatorio WhatsApp">
        <button class="wa-reminder-close" id="wa-reminder-close" aria-label="Cerrar">×</button>
        <div class="wa-reminder-icon"><i class="fab fa-whatsapp"></i></div>
        <div class="wa-reminder-body">
            <strong>¿Necesitás ayuda?</strong>
            <p>Francisco te responde en minutos.</p>
            <a href="https://wa.me/541161242498?text=Hola%2C+vi+su+p%C3%A1gina+y+me+interesa+consultar."
               target="_blank" class="btn-main" id="wa-reminder-link">
                <i class="fab fa-whatsapp"></i> Consultá ahora
            </a>
        </div>
    </div>`;

    /* ── Inyectar en el DOM ── */
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // El footer ya existe en index.html; solo lo inyectamos en páginas internas
    if (page !== 'index.html' && page !== '') {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        document.body.classList.add('inner-page'); // activa el padding-top del navbar
    }

    document.body.insertAdjacentHTML('beforeend', floatingHTML);

    /* ── Navbar scroll ── */
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* ── Hamburguesa ── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    document.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        });
    });

    /* ── Volver arriba ── */
    const backTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ── Carrito (estado persistido en sessionStorage para mantenerlo entre páginas) ── */
    let cart = JSON.parse(sessionStorage.getItem('kappa-cart') || '[]');

    function saveCart() { sessionStorage.setItem('kappa-cart', JSON.stringify(cart)); }

    function updateCartUI() {
        const container      = document.getElementById('cart-items-container');
        const badge          = document.getElementById('cart-count');
        const checkoutBtn    = document.getElementById('wa-checkout-btn');
        const mpBtn          = document.getElementById('mp-checkout-btn');
        const totalContainer = document.getElementById('cart-total-container');
        const totalQty       = document.getElementById('cart-total-qty');
        const totalPrice     = document.getElementById('cart-total-price');

        const totalItems = cart.reduce((s, i) => s + i.qty, 0);
        const totalARS   = cart.reduce((s, i) => s + (i.product.price || 0) * i.qty, 0);
        badge.textContent = totalItems;
        badge.style.opacity = totalItems > 0 ? '1' : '0';

        if (cart.length === 0) {
            container.innerHTML = `<p class="cart-empty">
                <i class="fas fa-box-open" style="font-size:2.5rem;color:#ddd;display:block;margin-bottom:15px;"></i>
                Tu lista está vacía.<br><small>Explorá el catálogo y agregá productos.</small></p>`;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.pointerEvents = 'none';
            if (mpBtn) mpBtn.disabled = true;
            totalContainer.style.display = 'none';
            document.getElementById('buyer-info-form').style.display = 'none';
            return;
        }

        container.innerHTML = cart.map(({ key, product, color, qty }) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div>
                        <b>${product.name}</b>
                        <small class="cart-item-color"><i class="fas fa-palette"></i> ${color}</small>
                        ${product.price ? `<small class="cart-item-price">$${(product.price * qty).toLocaleString('es-AR')}</small>` : ''}
                    </div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="partialChangeQty('${key}',-1)">−</button>
                    <span class="qty-value">${qty}</span>
                    <button class="qty-btn" onclick="partialChangeQty('${key}',1)">+</button>
                    <button class="remove-item" onclick="partialRemove('${key}')"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>`).join('');

        totalQty.textContent = totalItems;
        if (totalPrice) totalPrice.textContent = totalARS > 0 ? `$${totalARS.toLocaleString('es-AR')}` : 'A cotizar';
        totalContainer.style.display = 'flex';

        // Enable MP button only if all products have prices
        const allHavePrices = cart.every(i => i.product.price > 0);
        if (mpBtn) mpBtn.disabled = !allHavePrices;
        document.getElementById('buyer-info-form').style.display = allHavePrices ? 'block' : 'none';

        const lines = cart.map(({ product, color, qty }) =>
            `- ${product.name} x${qty} (Acabado: ${color})${product.price ? ' — $' + (product.price * qty).toLocaleString('es-AR') : ''}`).join('\n');
        const totalLine = totalARS > 0 ? `\nTotal: $${totalARS.toLocaleString('es-AR')}` : '';
        const msg = encodeURIComponent(
            `Hola Taller Kappa! Quisiera cotizar:\n${lines}${totalLine}\n\nPor favor indicarme precio final y tiempo de entrega.`);
        checkoutBtn.href = `https://wa.me/541161242498?text=${msg}`;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'all';
    }

    /* Exponer funciones globales para los botones inline del carrito */
    window.partialChangeQty = function (key, delta) {
        const item = cart.find(i => i.key === key);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
        saveCart(); updateCartUI();
    };
    window.partialRemove = function (key) {
        cart = cart.filter(i => i.key !== key);
        saveCart(); updateCartUI();
    };

    /* Exponer addToCart globalmente (lo llaman las páginas de catálogo) */
    window.addToCartGlobal = function (product, color) {
        color = color || 'Negro Mate';
        const pid = product._id || product.id;
        const key = `${pid}-${color}`;
        const existing = cart.find(i => i.key === key);
        if (existing) { existing.qty += 1; }
        else { cart.push({ key, product, color, qty: 1 }); }
        saveCart(); updateCartUI();
        showToastGlobal(`"${product.name}" (${color}) agregado al presupuesto`);
    };

    /* Toggle carrito */
    function toggleCart() {
        const overlay = document.getElementById('cart-overlay');
        const isOpen  = overlay.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    document.getElementById('cart-toggle-btn').addEventListener('click', toggleCart);
    document.getElementById('cart-toggle-btn').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCart(); }
    });
    document.getElementById('cart-close-btn').addEventListener('click', toggleCart);
    document.getElementById('cart-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) toggleCart();
    });

    /* Imprimir presupuesto */
    document.getElementById('btn-print-budget').addEventListener('click', () => {
        if (cart.length === 0) { showToastGlobal('Tu presupuesto está vacío.'); return; }
        const lines = cart.map(({ product, color, qty }) =>
            `<tr><td>${product.name}</td><td>${color}</td><td style="text-align:center">${qty}</td><td style="color:#888;font-style:italic">A cotizar</td></tr>`
        ).join('');
        const win = window.open('', '_blank');
        if (!win) { showToastGlobal('El navegador bloqueó la ventana emergente. Permitila en la barra de dirección.'); return; }
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
            <div class="footer"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'long',year:'numeric'})}<br>
            Confirmá el pedido por WhatsApp al <strong>11 6124-2498</strong></div>
            <script>window.onload=()=>{window.print();}<\/script></body></html>`);
        win.document.close();
    });

    /* MercadoPago checkout */
    document.getElementById('mp-checkout-btn').addEventListener('click', async () => {
        if (cart.length === 0) { showToastGlobal('Tu carrito está vacío.'); return; }

        // Validar datos de contacto del comprador
        const buyerName  = document.getElementById('buyer-name').value.trim();
        const buyerEmail = document.getElementById('buyer-email').value.trim();
        const buyerPhone = document.getElementById('buyer-phone').value.trim();
        const buyerErr   = document.getElementById('buyer-error');
        buyerErr.style.display = 'none';

        if (!buyerName || !buyerEmail || !buyerPhone) {
            buyerErr.textContent = 'Completá nombre, email y teléfono para continuar.';
            buyerErr.style.display = 'block';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
            buyerErr.textContent = 'Ingresá un email válido.';
            buyerErr.style.display = 'block';
            return;
        }

        const mpBtn = document.getElementById('mp-checkout-btn');
        mpBtn.disabled = true;
        mpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            const apiBase = typeof API_URL !== 'undefined' ? API_URL : '/api';
            const res = await fetch(apiBase.replace('/api', '') + '/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map(({ product, color, qty }) => ({
                        productId: product._id || product.id,
                        name: product.name,
                        color,
                        qty,
                        unitPrice: product.price,
                    })),
                    buyer: { name: buyerName, email: buyerEmail, phone: buyerPhone }
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al crear el pago');

            window.location.href = data.initPoint || data.sandboxInitPoint;

        } catch (err) {
            showToastGlobal('Error: ' + err.message);
            mpBtn.disabled = false;
            mpBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar con MercadoPago';
        }
    });

    /* Toast global */
    window.showToastGlobal = function (msg) {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    };

    /* Recordatorio WhatsApp (2 min inactividad) */
    let waTimer = null; let waShown = false;
    const waPopup = document.getElementById('wa-reminder-popup');
    function resetWaTimer() {
        clearTimeout(waTimer);
        if (waShown) return;
        waTimer = setTimeout(() => { waShown = true; waPopup.classList.add('show'); }, 120000);
    }
    ['mousemove','keydown','scroll','click','touchstart'].forEach(ev =>
        document.addEventListener(ev, resetWaTimer, { passive: true }));
    document.getElementById('wa-reminder-close').addEventListener('click', () => waPopup.classList.remove('show'));
    document.getElementById('wa-reminder-link').addEventListener('click',  () => waPopup.classList.remove('show'));
    resetWaTimer();

    /* Escape cierra overlays */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('cart-overlay');
            if (overlay.classList.contains('open')) toggleCart();
        }
    });

    /* Inicializar badge al cargar */
    updateCartUI();

})();
