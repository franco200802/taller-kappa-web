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
            <div id="nav-user-btn" style="cursor:pointer;display:flex;align-items:center;gap:6px;font-size:.85rem;color:#ccc;" title="Mi cuenta">
                <i class="fas fa-user-circle" style="font-size:1.2rem;"></i>
                <span id="nav-user-label">Ingresar</span>
            </div>
            <div class="cart-icon-container" id="cart-toggle-btn" role="button" tabindex="0" aria-label="Abrir presupuesto">
                <i class="fas fa-shopping-bag" style="font-size:1.2rem;"></i>
                <span class="cart-badge" id="cart-count">0</span>
            </div>
            <button class="dark-toggle" id="dark-toggle" aria-label="Cambiar modo oscuro/claro" title="Modo oscuro">
                <i class="fas fa-moon"></i>
            </button>
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
    </div>
    <!-- Modal Login / Registro -->
    <div id="auth-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center;">
        <div id="auth-box" style="background:#1a1a1a;border-radius:14px;padding:36px 32px;width:90%;max-width:420px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
            <button onclick="closeAuthModal()" style="position:absolute;top:14px;right:18px;background:none;border:none;color:#aaa;font-size:1.5rem;cursor:pointer;">×</button>
            <!-- TABS -->
            <div style="display:flex;gap:0;margin-bottom:28px;border-bottom:2px solid #333;">
                <button id="tab-login" onclick="switchAuthTab('login')" style="flex:1;padding:10px;background:none;border:none;color:#b8860b;font-weight:700;font-size:1rem;cursor:pointer;border-bottom:2px solid #b8860b;margin-bottom:-2px;">Iniciar sesión</button>
                <button id="tab-register" onclick="switchAuthTab('register')" style="flex:1;padding:10px;background:none;border:none;color:#777;font-size:1rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;">Registrarse</button>
            </div>
            <!-- LOGIN FORM -->
            <form id="login-form" onsubmit="submitLogin(event)">
                <p style="color:#ccc;margin-bottom:20px;font-size:.9rem;">Para pagar necesitás iniciar sesión.</p>
                <div style="margin-bottom:16px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Email</label>
                    <input id="login-email" type="email" required style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="tu@email.com">
                </div>
                <div style="margin-bottom:22px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Contraseña</label>
                    <input id="login-password" type="password" required style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="••••••••">
                </div>
                <button type="submit" style="width:100%;padding:13px;background:#b8860b;color:#000;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;">Iniciar sesión</button>
                <p id="login-error" style="color:#e74c3c;text-align:center;margin-top:12px;font-size:.85rem;display:none;"></p>
            </form>
            <!-- REGISTER FORM -->
            <form id="register-form" style="display:none;" onsubmit="submitRegister(event)">
                <p style="color:#ccc;margin-bottom:20px;font-size:.9rem;">Creá tu cuenta para realizar compras.</p>
                <div style="margin-bottom:14px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Nombre completo</label>
                    <input id="reg-name" type="text" required style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="Juan García">
                </div>
                <div style="margin-bottom:14px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Email</label>
                    <input id="reg-email" type="email" required style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="tu@email.com">
                </div>
                <div style="margin-bottom:14px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Teléfono (opcional)</label>
                    <input id="reg-phone" type="tel" style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="11 6124-0000">
                </div>
                <div style="margin-bottom:22px;">
                    <label style="display:block;color:#aaa;font-size:.8rem;margin-bottom:6px;text-transform:uppercase;">Contraseña</label>
                    <input id="reg-password" type="password" required minlength="6" style="width:100%;padding:11px 14px;background:#252525;border:1px solid #444;border-radius:8px;color:#eee;font-size:.95rem;" placeholder="Mínimo 6 caracteres">
                </div>
                <button type="submit" style="width:100%;padding:13px;background:#b8860b;color:#000;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;">Crear cuenta</button>
                <p id="reg-error" style="color:#e74c3c;text-align:center;margin-top:12px;font-size:.85rem;display:none;"></p>
            </form>
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

    /* ── Modo oscuro ── */
    const darkBtn  = document.getElementById('dark-toggle');
    const darkIcon = darkBtn.querySelector('i');
    if (localStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('dark');
        darkIcon.className = 'fas fa-sun';
    }
    darkBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        darkIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkMode', isDark ? 'on' : 'off');
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

        // Requerir login antes de pagar
        const userData = getLoggedUser();
        if (!userData) {
            openAuthModal();
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
                    buyer: { name: userData.name, email: userData.email, phone: userData.phone || '' }
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

    /* ─────────────────────────────────────────────
       AUTENTICACIÓN DE USUARIOS
    ───────────────────────────────────────────── */
    const AUTH_API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://taller-kappa-api.onrender.com/api';

    function getLoggedUser() {
        try { return JSON.parse(localStorage.getItem('kappa-user') || 'null'); } catch { return null; }
    }
    function getAuthToken() { return localStorage.getItem('kappa-token') || null; }
    function setSession(token, user) {
        localStorage.setItem('kappa-token', token);
        localStorage.setItem('kappa-user', JSON.stringify(user));
        updateNavUser();
    }
    function clearSession() {
        localStorage.removeItem('kappa-token');
        localStorage.removeItem('kappa-user');
        updateNavUser();
    }

    function updateNavUser() {
        const user = getLoggedUser();
        const label = document.getElementById('nav-user-label');
        if (!label) return;
        if (user) {
            label.textContent = user.name.split(' ')[0];
            document.getElementById('nav-user-btn').title = `Sesión de ${user.name} — clic para cerrar sesión`;
            document.getElementById('nav-user-btn').querySelector('i').style.color = '#b8860b';
        } else {
            label.textContent = 'Ingresar';
            document.getElementById('nav-user-btn').title = 'Iniciar sesión o registrarse';
            document.getElementById('nav-user-btn').querySelector('i').style.color = '#ccc';
        }
    }

    document.getElementById('nav-user-btn').addEventListener('click', () => {
        if (getLoggedUser()) {
            if (confirm(`¿Cerrar sesión de ${getLoggedUser().name}?`)) {
                clearSession();
                showToastGlobal('Sesión cerrada.');
            }
        } else {
            openAuthModal();
        }
    });

    window.openAuthModal = function (tab) {
        switchAuthTab(tab || 'login');
        const m = document.getElementById('auth-modal');
        m.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
    window.closeAuthModal = function () {
        document.getElementById('auth-modal').style.display = 'none';
        document.body.style.overflow = '';
    };
    window.switchAuthTab = function (tab) {
        const loginForm = document.getElementById('login-form');
        const regForm   = document.getElementById('register-form');
        const tabLogin  = document.getElementById('tab-login');
        const tabReg    = document.getElementById('tab-register');
        if (tab === 'login') {
            loginForm.style.display = ''; regForm.style.display = 'none';
            tabLogin.style.color = '#b8860b'; tabLogin.style.borderBottomColor = '#b8860b';
            tabReg.style.color = '#777'; tabReg.style.borderBottomColor = 'transparent';
        } else {
            loginForm.style.display = 'none'; regForm.style.display = '';
            tabReg.style.color = '#b8860b'; tabReg.style.borderBottomColor = '#b8860b';
            tabLogin.style.color = '#777'; tabLogin.style.borderBottomColor = 'transparent';
        }
    };

    // Cerrar al hacer click en el fondo
    document.getElementById('auth-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('auth-modal')) closeAuthModal();
    });

    window.submitLogin = async function (e) {
        e.preventDefault();
        const errEl = document.getElementById('login-error');
        const btn = e.target.querySelector('button[type=submit]');
        errEl.style.display = 'none';
        btn.disabled = true;
        btn.textContent = 'Ingresando...';
        const email    = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`${AUTH_API}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const data = await res.json();
            if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
            setSession(data.token, data.user);
            closeAuthModal();
            showToastGlobal(`¡Bienvenido, ${data.user.name}!`);
        } catch (err) {
            errEl.textContent = err.name === 'AbortError' ? 'El servidor tardó demasiado. Intentá de nuevo.' : 'Error de conexión';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Iniciar sesión';
        }
    };

    window.submitRegister = async function (e) {
        e.preventDefault();
        const errEl = document.getElementById('reg-error');
        const btn = e.target.querySelector('button[type=submit]');
        errEl.style.display = 'none';
        btn.disabled = true;
        btn.textContent = 'Creando cuenta...';
        const name     = document.getElementById('reg-name').value;
        const email    = document.getElementById('reg-email').value;
        const phone    = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`${AUTH_API}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password }),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const data = await res.json();
            if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
            setSession(data.token, data.user);
            closeAuthModal();
            showToastGlobal(`¡Cuenta creada! Bienvenido, ${data.user.name}`);
        } catch (err) {
            errEl.textContent = err.name === 'AbortError' ? 'El servidor tardó demasiado. Intentá de nuevo en 10 segundos.' : 'Error de conexión';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.textContent = 'Crear cuenta';
        }
    };

    // Inicializar estado del usuario en el navbar
    updateNavUser();

})();
