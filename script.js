/* ============================================
   TALLER KAPPA — script.js
   ============================================ */

'use strict';

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
   En GitHub Pages sin backend → datos locales. tallerkappa.com.ar usa Render. */
const isStaticHost = window.location.hostname.includes('github.io') ||
                     window.location.protocol === 'file:';
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://taller-kappa-api.onrender.com/api';

/* Despertar Render en segundo plano ni bien carga la página */
if (!isStaticHost) {
    fetch(API_URL.replace('/api', '/api/ping'), { method: 'GET' }).catch(() => {});
}

/* --- DATOS LOCALES DE FALLBACK (se usan si el servidor no está corriendo) --- */
const productosFallback = [
    {
        id: 1,
        category: 'asientos',
        name: 'Sillón BKF Premium',
        image: 'images/bkf1.png',
        badge: 'Más vendido',
        stock: true,
        price: 280000,
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
        price: 140000,
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
        price: 95000,
        priceFrom: 'Desde $95.000',
        desc: 'Estabilidad garantizada para uso gastronómico intenso. Base de chapa torneada pesada que evita el balanceo.',
        specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes']
    }
];

/* --- ESTADO GLOBAL --- */
let products = [...productosFallback]; // se reemplaza con datos de la API al cargar
let selectedColor = 'Negro Mate';

/* ==============================
   CARRITO — Delegado a partials.js (addToCartGlobal)
   ============================== */
function addToCart(productId) {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product || typeof window.addToCartGlobal !== 'function') return;
    window.addToCartGlobal(product, selectedColor || 'Negro Mate');
    closeModal();
}

/* ==============================
   CARGA DE DATOS DESDE LA API
   ============================== */
async function loadProductsFromAPI() {
    if (isStaticHost) {
        products = [...productosFallback];
        renderProducts('all');
        return;
    }
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout
        const res = await fetch(`${API_URL}/productos`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('No se pudo conectar al servidor');
        products = await res.json();
        // Normalizar: asegurar que cada producto tenga .id (MongoDB usa _id)
        products.forEach(p => { if (!p.id) p.id = p._id; });
        console.log(`✅ ${products.length} producto(s) cargados desde la base de datos.`);
    } catch (err) {
        console.warn('⚠️ Servidor no disponible, usando datos locales:', err.message);
        products = [...productosFallback];
    }
    renderProducts('all');
}

async function loadFAQsFromAPI() {
    if (isStaticHost) return;
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_URL}/faqs`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const faqs = await res.json();
        if (faqs.length) renderFAQs(faqs);
    } catch (err) {
        console.warn('FAQs API error:', err.message);
    }
}

async function loadTestimoniosFromAPI() {
    if (isStaticHost) return;
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_URL}/testimonios`, { signal: controller.signal });
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
    const titleHTML = title ? title.outerHTML : '<h2 class="section-title">Preguntas Frecuentes</h2>';

    section.innerHTML = titleHTML + faqs.map(f => `
        <div class="faq-item">
            <div class="faq-question" role="button" tabindex="0" aria-expanded="false">
                <span><i class="${f.icon} faq-icon-left"></i> ${f.question}</span>
                <i class="fas fa-chevron-down faq-icon-right"></i>
            </div>
            <div class="faq-answer">${f.answer}</div>
        </div>
    `).join('');

    // Asegurar que la sección sea visible (puede estar hidden por section-fade)
    section.style.opacity = '1';
    section.style.transform = 'none';
    section.classList.add('visible');

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
    const id = p.id || p._id;
    return `
        <article class="product-card" data-category="${p.category}">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <div class="stock-indicator ${p.stock ? 'in-stock' : 'no-stock'}">
                <span class="stock-dot-small"></span>
                ${p.stock ? 'En stock' : 'Consultar'}
            </div>
            <div class="card-img-wrapper" onclick="openModal('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openModal('${id}');}" role="button" tabindex="0" aria-label="Ver detalles de ${p.name}">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="card-overlay"><i class="fas fa-search-plus"></i> Ver detalle</div>
            </div>
            <div class="card-info">
                <h3>${p.name}</h3>
                ${p.price ? `<p class="card-price">$${p.price.toLocaleString('es-AR')}</p>` : ''}
                <p class="card-specs-preview">${p.specs[0]}</p>
                <a class="card-consult" href="https://wa.me/541161242498?text=${encodeURIComponent('Hola! Quisiera consultar el precio de: ' + p.name)}" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i> Consultar precio
                </a>
                <div class="card-actions">
                    <button class="btn-detail" onclick="openModal('${id}')">
                        <i class="fas fa-info-circle"></i> Ver detalles
                    </button>
                    <button class="btn-add-cart" onclick="addToCart('${id}')">
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
    const grid = document.getElementById('grid');
    if (!grid) return;
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    grid.innerHTML = filtered.map(p => buildProductCard(p)).join('');
    observeCards();
}

function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Filtrar siempre sobre el array ya cargado en memoria — no hacer fetch extra
    renderProducts(cat);
}

/* ==============================
   MODAL CON SELECTOR DE COLOR
   ============================== */
function openModal(id) {
    const p = products.find(prod => String(prod.id || prod._id) === String(id));
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
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.remove('active');
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

/* initMobileMenu y initNavbarScroll se manejan en partials.js — no duplicar */

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
// Manejado por partials.js con active-page en el link actual

/* ==============================
   FAQ ACORDEÓN
   ============================== */
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        // Evitar doble-init (si ya tiene listener, no agregar otro)
        if (question.dataset.faqInit) return;
        question.dataset.faqInit = '1';

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
        if (!isStaticHost) {
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

/* initBackToTop se maneja en partials.js */

/* ==============================
   CERRAR MODAL CON ESCAPE
   ============================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(); // null-safe; partials.js cierra el carrito
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

/* initWhatsAppReminder, closeWaReminder y printBudget se manejan en partials.js */

/* ==============================
   INICIALIZACIÓN
   ============================== */
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAPI();
    if (document.getElementById('faq')) loadFAQsFromAPI();
    loadTestimoniosFromAPI();

    initSectionAnimations();
    initFAQ();
    initContactForm();
    initCountdown();
    initTypingEffect();
    initColorSelector();
    initMaterialBars();
    initAnimatedNumbers();
    initPWA();

    // Efectos no críticos: inicializar después de 3s para no trabar el render inicial
    setTimeout(() => {
        initSocialProof();
        initLiveVisitors();
    }, 3000);

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });
    }
});

/* initDarkMode se maneja en partials.js */

/* Alias para catalogo.html que usa setFilter */
window.setFilter = filterProducts;

/* ==============================
   PARTÍCULAS EN EL HERO — eliminadas por rendimiento
   El hero usa CSS gradient como fondo, sin canvas.
   ============================== */
function initHeroParticles() { /* desactivado */ }
function initHeroSparks()    { /* desactivado */ }

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
