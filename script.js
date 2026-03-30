/* ============================================
   TALLER KAPPA — script.js
   ============================================ */

'use strict';

/* ==============================
   CHISPAS ANIMADAS DEL HERO (CSS puro, 100% offline)
   ============================== */
function initHeroSparks() {
    const container = document.getElementById('hero-sparks');
    if (!container) return;

    const SPARK_COUNT = 35;
    // Paleta de colores: blanco/amarillo/naranja/rojo — simula chispas de soldadura
    const colors = [
        'rgba(255,255,255,0.95)',
        'rgba(255,220,80,0.9)',
        'rgba(255,160,20,0.85)',
        'rgba(255,90,10,0.8)',
        'rgba(255,200,100,0.9)',
    ];

    for (let i = 0; i < SPARK_COUNT; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';

        // Posición de origen aleatoria (concentrada en la zona media-baja como una soldadora)
        const originX = 20 + Math.random() * 60; // % horizontal
        const originY = 40 + Math.random() * 40; // % vertical (mitad inferior)

        // Dirección del vuelo — hacia arriba y los lados
        const angle  = (Math.random() * 180) - 90; // -90° a +90° (spread horizontal)
        const dist   = 60 + Math.random() * 180;   // px de distancia
        const tx  = Math.cos((angle * Math.PI) / 180) * dist;
        const ty  = -Math.abs(Math.sin((angle * Math.PI) / 180) * dist) - 30; // siempre sube
        const tx2 = tx  + (Math.random() - 0.5) * 40; // desvío por "gravedad"
        const ty2 = ty  + Math.random() * 60;           // cae un poco al final

        const size     = 2 + Math.random() * 4;   // px
        const duration = 1.5 + Math.random() * 3; // seg
        const delay    = Math.random() * 4;        // seg de delay inicial
        const color    = colors[Math.floor(Math.random() * colors.length)];

        spark.style.cssText = `
            left: ${originX}%;
            top:  ${originY}%;
            width:  ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
            --tx: ${tx}px;
            --ty: ${ty}px;
            --tx2: ${tx2}px;
            --ty2: ${ty2}px;
            --duration: ${duration}s;
            --delay: ${delay}s;
        `;

        container.appendChild(spark);
    }
}

/* ==============================
   CURSOR PERSONALIZADO
   ============================== */
// Eliminado — cursor nativo restaurado
/* ==============================
   VISITANTES EN TIEMPO REAL (SIMULADO)
   ============================== */
function initLiveVisitors() {
    const el = document.getElementById('live-visitors-count');
    if (!el) return;

    // Número base realista para una web de este tipo
    let count = Math.floor(Math.random() * 8) + 5;
    el.textContent = count;

    setInterval(() => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        count = Math.max(3, Math.min(18, count + delta));
        el.textContent = count;
    }, 8000);
}

/* ==============================
   COMPARTIR POR WHATSAPP (CARD)
   ============================== */
function shareProduct(name) {
    const text = encodeURIComponent(
        `Mirá este producto de Taller Kappa: *${name}*\n👉 tallerkappa.com.ar\n¡Calidad industrial directo de fábrica!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

/* --- URL DE LA API ---
   En local apunta a localhost:3000.
   En producción (Railway/Render) apunta al mismo dominio del servidor. */
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

/* --- DATOS LOCALES DE FALLBACK (se usan si el servidor no está corriendo) --- */
const productosFallback = [
    {
        id: 1,
        category: 'asientos',
        name: 'Sillón BKF Premium',
        image: 'images/bkf1.png',
        badge: 'Más vendido',
        stock: true,
        priceFrom: 'Desde $280.000',
        desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
        specs: ['Hierro redondo macizo 12mm', 'Cuero Vacuno de 1ra', 'Pintura Epoxi o Cromado', 'Medidas: 78x70x90 cm']
    },
    {
        id: 2,
        category: 'asientos',
        name: 'Banco BKF',
        image: 'images/bkfapoyapies.png',
        badge: 'Ideal para regalo',
        stock: true,
        priceFrom: 'Desde $140.000',
        desc: 'El complemento ideal de diseño. Versatilidad y resistencia en tamaño compacto, siguiendo la línea BKF.',
        specs: ['Hierro macizo 12mm', 'Altura 45cm', 'Ideal pie de cama o auxiliar', 'Medidas: 38x38x45 cm']
    },
    {
        id: 3,
        category: 'mesas',
        name: 'Base de Mesa Flat',
        image: 'images/mesa.jpeg',
        badge: 'Uso gastronómico',
        stock: true,
        priceFrom: 'Desde $95.000',
        desc: 'Estabilidad garantizada para uso gastronómico intenso. Base de chapa torneada pesada que evita el balanceo.',
        specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes']
    }
];

/* --- ESTADO GLOBAL --- */
let products = [...productosFallback]; // se reemplaza con datos de la API al cargar
let cart = [];
let selectedColor = 'Negro Mate';

/* ==============================
   CARRITO CON CANTIDADES
   ============================== */
function addToCart(productId) {
    const product = products.find(p => Number(p.id) === Number(productId));
    if (!product) return;

    const color = selectedColor || 'Negro Mate';
    const key   = `${productId}-${color}`;

    const existing = cart.find(item => item.key === key);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ key, product, color, qty: 1 });
    }

    updateCartUI();
    showToast(`"${product.name}" (${color}) agregado al presupuesto`);
    closeModal();
}

function changeQty(key, delta) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
    updateCartUI();
}

function removeFromCart(key) {
    cart = cart.filter(i => i.key !== key);
    updateCartUI();
}

function updateCartUI() {
    const container      = document.getElementById('cart-items-container');
    const badge          = document.getElementById('cart-count');
    const checkoutBtn    = document.getElementById('wa-checkout-btn');
    const totalContainer = document.getElementById('cart-total-container');
    const totalQty       = document.getElementById('cart-total-qty');

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

    badge.textContent = totalItems;
    badge.style.opacity = totalItems > 0 ? '1' : '0';

    if (cart.length === 0) {
        container.innerHTML = `
            <p class="cart-empty">
                <i class="fas fa-box-open" style="font-size:2.5rem;color:#ddd;display:block;margin-bottom:15px;"></i>
                Tu lista está vacía.<br>
                <small>Explorá el catálogo y agregá productos.</small>
            </p>`;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
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
                </div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty('${key}', -1)" aria-label="Reducir">−</button>
                <span class="qty-value">${qty}</span>
                <button class="qty-btn" onclick="changeQty('${key}', +1)" aria-label="Aumentar">+</button>
                <button class="remove-item" onclick="removeFromCart('${key}')" aria-label="Eliminar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');

    totalQty.textContent = totalItems;
    totalContainer.style.display = 'flex';

    const phone = '541161242498';
    const lines = cart.map(({ product, color, qty }) =>
        `- ${product.name} x${qty} (Acabado: ${color})`
    ).join('\n');
    const msg = encodeURIComponent(
        `Hola Taller Kappa! Quisiera cotizar:\n${lines}\n\nPor favor indicarme precio y tiempo de entrega.`
    );
    checkoutBtn.href = `https://wa.me/${phone}?text=${msg}`;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.pointerEvents = 'all';
}

function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const isOpen  = overlay.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ==============================
   CARGA DE DATOS DESDE LA API
   ============================== */
async function loadProductsFromAPI() {
    try {
        const res = await fetch(`${API_URL}/productos`);
        if (!res.ok) throw new Error('No se pudo conectar al servidor');
        products = await res.json();
        console.log(`✅ ${products.length} producto(s) cargados desde la base de datos.`);
    } catch (err) {
        console.warn('⚠️ Servidor no disponible, usando datos locales:', err.message);
        products = [...productosFallback];
    }
    renderProducts('all');
}

async function loadFAQsFromAPI() {
    try {
        const res = await fetch(`${API_URL}/faqs`);
        if (!res.ok) throw new Error();
        const faqs = await res.json();
        renderFAQs(faqs);
    } catch {
        // Si falla, el HTML estático ya tiene las FAQs, no hacemos nada
    }
}

async function loadTestimoniosFromAPI() {
    try {
        const res = await fetch(`${API_URL}/testimonios`);
        if (!res.ok) throw new Error();
        const testimonios = await res.json();
        renderTestimonios(testimonios);
    } catch {
        // Si falla, el HTML estático ya tiene los testimonios
    }
}

/* ==============================
   RENDER DINÁMICO DE FAQs
   ============================== */
function renderFAQs(faqs) {
    const section = document.getElementById('faq');
    if (!section || !faqs.length) return;

    // Conservar el título
    const title = section.querySelector('h2');
    const titleHTML = title ? title.outerHTML : '<h2>Preguntas Frecuentes</h2>';

    section.innerHTML = titleHTML + faqs.map(f => `
        <div class="faq-item">
            <div class="faq-question" role="button" tabindex="0" aria-expanded="false">
                <span><i class="${f.icon} faq-icon-left"></i> ${f.question}</span>
                <i class="fas fa-chevron-down faq-icon-right"></i>
            </div>
            <div class="faq-answer">${f.answer}</div>
        </div>
    `).join('');

    // Reinicializar el acordeón
    initFAQ();
}

/* ==============================
   RENDER DINÁMICO DE TESTIMONIOS
   ============================== */
function renderTestimonios(testimonios) {
    const grid = document.querySelector('.testimonial-grid');
    if (!grid || !testimonios.length) return;

    const stars = (n) => Array(n).fill('<i class="fas fa-star"></i>').join('');

    grid.innerHTML = testimonios.map(t => `
        <article class="testimonial-card">
            <div class="stars" aria-label="${t.stars} estrellas">${stars(t.stars)}</div>
            <p>"${t.text}"</p>
            <p class="testimonial-author">— ${t.author}</p>
        </article>
    `).join('');

    // Re-observar las nuevas cards para que reciban la animación fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('fade-in'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    grid.querySelectorAll('.testimonial-card').forEach(el => observer.observe(el));
}

/* ==============================
   CATÁLOGO Y FILTROS
   ============================== */

// Construye el HTML de una card de producto
function buildProductCard(p) {
    // Asegurar que el id sea siempre número (por si la API devuelve string)
    const id = Number(p.id);
    return `
        <article class="product-card" data-category="${p.category}">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <div class="stock-indicator ${p.stock ? 'in-stock' : 'no-stock'}">
                <span class="stock-dot-small"></span>
                ${p.stock ? 'En stock' : 'Consultar'}
            </div>
            <div class="card-img-wrapper" onclick="openModal(${id})" role="button" tabindex="0" aria-label="Ver detalles de ${p.name}">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="card-overlay"><i class="fas fa-search-plus"></i> Ver detalle</div>
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                <p class="card-specs-preview">${p.specs[0]}</p>
                <p class="card-price">
                    <i class="fas fa-tag"></i> ${p.priceFrom}
                    <span class="price-note">· Precio final por consulta</span>
                </p>
                <div class="card-actions">
                    <button class="btn-detail" onclick="openModal(${id})">
                        <i class="fas fa-info-circle"></i> Ver detalles
                    </button>
                    <button class="btn-add-cart" onclick="addToCart(${id})">
                        <i class="fas fa-plus"></i> Presupuestar
                    </button>
                </div>
                <button class="btn-share" onclick="shareProduct('${p.name.replace(/'/g, "\\'")}')" title="Compartir por WhatsApp">
                    <i class="fab fa-whatsapp"></i> Compartir
                </button>
            </div>
        </article>
    `;
}

function renderProducts(filter = 'all') {
    const grid     = document.getElementById('grid');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(p => buildProductCard(p)).join('');
    observeCards();
}

function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Intentar filtrar desde la API; si falla, filtrar sobre los datos ya cargados
    fetch(`${API_URL}/productos${cat !== 'all' ? '?category=' + cat : ''}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            // La API devuelve datos YA filtrados → renderizar con 'all' para no filtrar de nuevo
            const grid = document.getElementById('grid');
            grid.innerHTML = data.map(p => buildProductCard(p)).join('');
            observeCards();
        })
        .catch(() => {
            // Fallback: filtrar localmente sobre el array completo
            renderProducts(cat);
        });
}

/* ==============================
   MODAL CON SELECTOR DE COLOR
   ============================== */
function openModal(id) {
    // Normalizar a número por si el id viene como string desde la API
    const p = products.find(prod => Number(prod.id) === Number(id));
    if (!p) return;

    // Resetear color seleccionado
    selectedColor = 'Negro Mate';

    // Rellenar info
    document.getElementById('modal-title').textContent = p.name;
    document.getElementById('modal-desc').textContent  = p.desc;
    document.getElementById('modal-img-container').innerHTML =
        `<img src="${p.image}" alt="${p.name}" loading="lazy">`;

    // Badge
    const badgeRow = document.getElementById('modal-badge-row');
    badgeRow.innerHTML = p.badge
        ? `<span class="modal-badge">${p.badge}</span>`
        : '';

    // Specs
    document.getElementById('modal-specs').innerHTML = p.specs
        .map(s => `<li><i class="fas fa-check" aria-hidden="true"></i> ${s}</li>`)
        .join('');

    // Color seleccionado por defecto
    document.getElementById('color-chosen').textContent = selectedColor;
    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.classList.toggle('active', sw.dataset.color === selectedColor);
    });

    document.getElementById('btn-add-modal').onclick = () => addToCart(p.id);
    document.getElementById('product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ==============================
   SELECTOR DE COLORES
   ============================== */
function initColorSelector() {
    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedColor = btn.dataset.color;
            document.getElementById('color-chosen').textContent = selectedColor;
        });
    });
}

/* ==============================
   TYPING EFFECT EN EL HERO
   ============================== */
function initTypingEffect() {
    const el    = document.getElementById('hero-typed');
    if (!el) return;

    const words = ['su negocio.', 'su local.', 'su hogar.', 'su marca.'];
    let wIdx = 0, cIdx = 0, deleting = false;

    function type() {
        const word    = words[wIdx];
        const current = deleting ? word.substring(0, cIdx - 1) : word.substring(0, cIdx + 1);
        el.textContent = current;
        deleting ? cIdx-- : cIdx++;

        let delay = deleting ? 60 : 100;

        if (!deleting && cIdx === word.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && cIdx === 0) {
            deleting = false;
            wIdx = (wIdx + 1) % words.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

/* ==============================
   POPUP DE ACTIVIDAD SOCIAL (FOMO)
   ============================== */
function initSocialProof() {
    const popup = document.getElementById('social-popup');
    if (!popup) return;

    const events = [
        { name: 'Alguien de Rosario',       msg: ' consultó el Sillón BKF' },
        { name: 'Una empresa de CABA',       msg: ' pidió cotización mayorista' },
        { name: 'Alguien de Córdoba',        msg: ' consultó el Banco BKF' },
        { name: 'Un local gastronómico',     msg: ' preguntó por envíos al interior' },
        { name: 'Una franquicia de Mendoza', msg: ' consultó las Bases Flat' },
    ];

    // Mostramos solo 3 veces en total para no molestar
    const MAX_SHOWS = 3;
    let idx = 0;
    let shown = 0;
    let hideTimer = null;

    // Cerrar manualmente al hacer click
    popup.addEventListener('click', () => {
        clearTimeout(hideTimer);
        popup.classList.remove('show');
    });

    function showNext() {
        if (shown >= MAX_SHOWS) return;

        const ev = events[idx % events.length];
        document.getElementById('social-popup-name').textContent = ev.name;
        document.getElementById('social-popup-msg').textContent  = ev.msg;
        popup.classList.add('show');
        shown++;
        idx++;

        // Se oculta solo a los 3 segundos (antes eran 4)
        hideTimer = setTimeout(() => popup.classList.remove('show'), 3000);
    }

    // Primera aparición a los 15 segundos (antes eran 6), luego cada 25 segundos (antes 12)
    setTimeout(() => {
        showNext();
        const interval = setInterval(() => {
            if (shown >= MAX_SHOWS) { clearInterval(interval); return; }
            showNext();
        }, 25000);
    }, 15000);
}

/* ==============================
   BARRAS DE MATERIALES ANIMADAS
   ============================== */
function initMaterialBars() {
    const bars = document.querySelectorAll('.material-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El ancho ya está en el style inline (width:XX%), solo activamos la transición
                const target = entry.target;
                const finalWidth = target.style.width;
                target.style.width = '0';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        target.style.transition = 'width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)';
                        target.style.width = finalWidth;
                    });
                });
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    bars.forEach(bar => observer.observe(bar));
}

/* ==============================
   MENÚ HAMBURGUESA
   ============================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
        });
    });
}

/* ==============================
   NAVBAR SCROLL
   ============================== */
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

/* ==============================
   ANIMACIONES (IntersectionObserver)
   ============================== */
function observeCards() {
    const cards = document.querySelectorAll('.product-card:not(.animated)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible', 'animated'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
}

function initSectionAnimations() {
    // Animación de elementos individuales (cards, items, etc.)
    const targets = document.querySelectorAll(
        '.testimonial-card, .faq-item, .clients-logos img, .why-card, .process-step, .material-card'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('fade-in'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    targets.forEach(el => observer.observe(el));

    // Animación de secciones completas (fade-in suave al entrar en pantalla)
    const sections = document.querySelectorAll('.section-fade');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    sections.forEach(el => sectionObserver.observe(el));
}

/* ==============================
   SECCIÓN ACTIVA EN NAVBAR
   ============================== */
function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionIds = ['hero', 'catalogo', 'contacto-form', 'faq'];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active-section');
                    if (link.getAttribute('onclick')?.includes(id)) {
                        link.classList.add('active-section');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}


/* ==============================
   FAQ ACORDEÓN
   ============================== */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        const toggle = () => {
            const item   = question.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        };
        question.addEventListener('click', toggle);
        // Accesibilidad: Enter y Space abren/cierran desde teclado
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });
}

/* ==============================
   TOAST
   ============================== */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==============================
   SCROLL SUAVE
   ============================== */
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = document.querySelector('nav').offsetHeight;
    const banner    = document.getElementById('urgency-banner');
    const bannerHeight = (banner && banner.style.display !== 'none') ? banner.offsetHeight : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - bannerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
}

/* ==============================
   FORMULARIO DE CONTACTO
   ============================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name     = form.querySelector('#form-name').value.trim();
        const interest = form.querySelector('#form-interest').value;
        const msg      = form.querySelector('#form-msg').value.trim();

        if (!name || !msg) {
            showToast('Por favor completá nombre y mensaje.');
            return;
        }

        // Guardar en la base de datos (si el servidor está disponible)
        try {
            const res = await fetch(`${API_URL}/contactos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, interest, message: msg })
            });
            if (res.ok) {
                console.log('✅ Mensaje guardado en la base de datos.');
            }
        } catch {
            console.warn('⚠️ No se pudo guardar en la base de datos (servidor no disponible).');
        }

        // Abrir WhatsApp igual (siempre)
        const phone        = '541161242498';
        const interestLine = interest ? `\nProducto de interés: ${interest}` : '';
        const text = encodeURIComponent(`Hola, soy ${name}.${interestLine}\n\n${msg}`);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        form.reset();
        showToast('¡Mensaje listo! Se abrió WhatsApp.');
    });
}

/* ==============================
   CONTADOR REGRESIVO
   ============================== */
function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const end = new Date();
    end.setHours(23, 59, 59, 0);

    function update() {
        const diff = end - new Date();
        if (diff <= 0) { el.textContent = '¡Tiempo agotado!'; return; }
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        el.textContent = `${h}:${m}:${s}`;
    }
    update();
    setInterval(update, 1000);
}

/* ==============================
   BOTÓN VOLVER ARRIBA
   ============================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==============================
   CERRAR CON ESCAPE
   ============================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        const overlay = document.getElementById('cart-overlay');
        if (overlay.classList.contains('open')) toggleCart();
    }
});

/* ==============================
   NÚMEROS ANIMADOS
   ============================== */
function initAnimatedNumbers() {
    const items = document.querySelectorAll('.number-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;

            const item  = entry.target;
            const el    = item.querySelector('.number-value');
            const target = parseInt(el.dataset.target, 10);

            // Mostrar el item con delay escalonado
            setTimeout(() => item.classList.add('fade-in'), i * 120);

            // Animar el número
            const duration = 1800;
            const startTime = performance.now() + i * 120;

            function update(now) {
                const elapsed  = Math.max(0, now - startTime);
                const progress = Math.min(elapsed / duration, 1);
                const ease     = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
            observer.unobserve(item);
        });
    }, { threshold: 0.2 });

    items.forEach(el => observer.observe(el));
}

/* ==============================
   PWA - Service Worker
   ============================== */
function initPWA() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./sw.js').then(reg => {

        // Cuando el SW detecta una nueva versión, la activa y recarga
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Hay una versión nueva — activarla sin esperar
                    newWorker.postMessage('SKIP_WAITING');
                }
            });
        });

        // Cuando el SW nuevo toma el control, recargar la página automáticamente
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });

    }).catch(() => {});
}

/* ==============================
   RECORDATORIO WHATSAPP (2 min inactividad)
   ============================== */
function initWhatsAppReminder() {
    let timer = null;
    const DELAY = 2 * 60 * 1000; // 2 minutos
    let shown = false;

    function resetTimer() {
        clearTimeout(timer);
        if (shown) return;
        timer = setTimeout(() => {
            shown = true;
            const popup = document.getElementById('wa-reminder-popup');
            if (popup) popup.classList.add('show');
        }, DELAY);
    }

    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(evt =>
        document.addEventListener(evt, resetTimer, { passive: true })
    );
    resetTimer();
}

function closeWaReminder() {
    const popup = document.getElementById('wa-reminder-popup');
    if (popup) popup.classList.remove('show');
}

/* ==============================
   IMPRIMIR / DESCARGAR PRESUPUESTO
   ============================== */
function printBudget() {
    if (cart.length === 0) {
        showToast('Tu presupuesto está vacío. Agregá productos primero.');
        return;
    }

    const lines = cart.map(({ product, color, qty }) =>
        `<tr>
            <td>${product.name}</td>
            <td>${color}</td>
            <td style="text-align:center">${qty}</td>
            <td>${product.priceFrom}</td>
        </tr>`
    ).join('');

    const win = window.open('', '_blank');
    if (!win) {
        showToast('El navegador bloqueó la ventana emergente. Permitila en la barra de dirección.');
        return;
    }
    win.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Presupuesto - Taller Kappa</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
                h1 { color: #b71c1c; font-size: 1.8rem; margin-bottom: 4px; }
                .subtitle { color: #888; font-size: 0.9rem; margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { background: #b71c1c; color: white; padding: 12px; text-align: left; font-size: 0.85rem; }
                td { padding: 12px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
                tr:nth-child(even) td { background: #fafafa; }
                .footer { margin-top: 30px; font-size: 0.8rem; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                .footer strong { color: #444; }
                .note { background: #fff5f5; border-left: 4px solid #b71c1c; padding: 12px 16px; font-size: 0.85rem; margin-bottom: 20px; color: #555; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <h1>Taller Kappa S.R.L.</h1>
            <p class="subtitle">Calle 28 Nº 3779, Villa Chacabuco, San Martín · WhatsApp: 11 6124-2498 · tallerkappa.com.ar</p>
            <p class="note">⚠️ Este presupuesto es orientativo. Los precios finales se confirman por WhatsApp según disponibilidad y volumen de pedido.</p>
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Acabado / Color</th>
                        <th style="text-align:center">Cant.</th>
                        <th>Precio desde</th>
                    </tr>
                </thead>
                <tbody>${lines}</tbody>
            </table>
            <div class="footer">
                <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' })}<br>
                <strong>Válido sujeto a disponibilidad de stock.</strong><br><br>
                Para confirmar este pedido contactanos por WhatsApp al <strong>11 6124-2498</strong> o al mail <strong>ing.franciscomarotta@gmail.com</strong>
            </div>
            <script>window.onload = () => { window.print(); }<\/script>
        </body>
        </html>
    `);
    win.document.close();
}

/* ==============================
   INICIALIZACIÓN
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos desde la base de datos (con fallback automático a datos locales)
    loadProductsFromAPI();
    loadFAQsFromAPI();
    loadTestimoniosFromAPI();

    initMobileMenu();
    initNavbarScroll();
    initSectionAnimations();
    initActiveNavHighlight();
    initFAQ();
    initContactForm();
    initBackToTop();
    initCountdown();
    initTypingEffect();
    initSocialProof();
    initColorSelector();
    initMaterialBars();
    initDarkMode();
    initHeroSparks();
    initHeroParticles();
    // initCustomCursor(); // Eliminado el puntero personalizado
    initLiveVisitors();
    initWhatsAppReminder();
    initAnimatedNumbers();
    initPWA();

    document.getElementById('cart-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) toggleCart();
    });
    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
});

/* ==============================
   MODO OSCURO
   ============================== */
function initDarkMode() {
    const btn  = document.getElementById('dark-toggle');
    const icon = btn.querySelector('i');

    // Recordar preferencia
    if (localStorage.getItem('darkMode') === 'on') {
        document.body.classList.add('dark');
        icon.className = 'fas fa-sun';
    }

    btn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('darkMode', isDark ? 'on' : 'off');
    });
}

/* ==============================
   PARTÍCULAS EN EL HERO
   ============================== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const TOTAL = 55;
    const particles = Array.from({ length: TOTAL }, () => ({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * 2 + 0.5,
        vx:   (Math.random() - 0.5) * 0.4,
        vy:   (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            // Mover
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Dibujar punto
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.fill();
        });

        // Líneas entre partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
}

/* ==============================
   LIGHTBOX DE GALERÍA
   ============================== */
const galleryImages = [
    { src: 'images/bkf1.png',         caption: 'Sillón BKF Premium' },
    { src: 'images/bkfapoyapies.png',  caption: 'Banco BKF' },
    { src: 'images/mesa.jpeg',         caption: 'Base de Mesa Flat' },
];
let lightboxIdx = 0;

function openLightbox(idx) {
    lightboxIdx = idx;
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    img.src        = galleryImages[idx].src;
    img.alt        = galleryImages[idx].caption;
    cap.textContent = galleryImages[idx].caption;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function shiftLightbox(dir) {
    lightboxIdx = (lightboxIdx + dir + galleryImages.length) % galleryImages.length;
    openLightbox(lightboxIdx);
}

// Teclado para el lightbox
document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('active')) return;
    if (e.key === 'ArrowRight') shiftLightbox(1);
    if (e.key === 'ArrowLeft')  shiftLightbox(-1);
    if (e.key === 'Escape')     closeLightbox();
});
