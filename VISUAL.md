Vas a hacer una mejora visual completa de tallerkappa.com.ar — fábrica de sillones BKF y muebles de hierro y cuero en San Martín, Buenos Aires. Clientes: YPF, McDonald's, Burger King.

Leé TODOS los archivos antes de tocar cualquier cosa. El estilo es industrial-luxury oscuro — como una forja premium. El rojo #b71c1c se mantiene como color de acento.

Hacé todo en orden. No pases al siguiente punto sin terminar el anterior.

---

## SISTEMA DE DISEÑO — NO MODIFICAR ESTOS VALORES

```css
:root {
  --c-bg:         #0A0A0A;
  --c-surface:    #111111;
  --c-surface-2:  #1A1A1A;
  --c-accent:     #b71c1c;
  --c-accent-2:   #d32f2f;
  --c-text:       #F0EDE8;
  --c-muted:      #666666;
  --c-border:     #1E1E1E;
  --c-grid:       rgba(255,255,255,0.025);

  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-hero:  clamp(4rem, 12vw, 11rem);
  --text-h1:    clamp(2.5rem, 5vw, 5.5rem);
  --text-h2:    clamp(1.5rem, 3vw, 3rem);
  --text-body:  clamp(0.9rem, 1.4vw, 1.05rem);
  --text-label: 0.7rem;

  --track-tight: -0.03em;
  --track-wide:  0.15em;
  --section-pad: clamp(4rem, 10vw, 8rem);
  --gutter:      clamp(1.2rem, 5vw, 4rem);
}
```

Agregar en el head de TODAS las páginas:
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">
```

---

## PASO 1 — LIBRERÍAS DE ANIMACIÓN

Agregar antes del cierre de </body> en TODAS las páginas:
```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/splitting/dist/splitting.css"/>
<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>
```

Crear /js/animations.js y enlazarlo en todas las páginas después de las librerías.
Dentro de animations.js inicializar Lenis PRIMERO:

```javascript
// LENIS — smooth scroll base de todo
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
window.lenis = lenis;
```

---

## PASO 2 — LOADING SCREEN (en index.html)

Agregar como primer elemento dentro del body:

```html
<div id="loader">
  <div class="loader-logo">TALLER KAPPA</div>
  <div class="loader-bar"><div class="loader-fill"></div></div>
  <div class="loader-num">00%</div>
</div>
```

CSS del loader:
```css
#loader {
  position: fixed; inset: 0;
  background: #0A0A0A;
  z-index: 99999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1.5rem;
}
.loader-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  color: #F0EDE8;
  letter-spacing: 0.2em;
}
.loader-bar {
  width: min(280px, 70vw);
  height: 1px;
  background: #1E1E1E;
  overflow: hidden;
}
.loader-fill {
  height: 100%;
  width: 0%;
  background: #b71c1c;
  transition: width 0.1s linear;
}
.loader-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #666;
  letter-spacing: 0.2em;
}
```

JS del loader en animations.js:
```javascript
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const fill = loader.querySelector('.loader-fill');
  const num = loader.querySelector('.loader-num');

  gsap.to({ v: 0 }, {
    v: 100, duration: 2.2, ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(this.targets()[0].v);
      fill.style.width = v + '%';
      num.textContent = String(v).padStart(2, '0') + '%';
    },
    onComplete: () => {
      gsap.to(loader, {
        yPercent: -100, duration: 0.9, ease: 'power4.inOut',
        onComplete: () => { loader.remove(); initHeroAnimations(); }
      });
    }
  });
}
window.addEventListener('DOMContentLoaded', initLoader);
```

---

## PASO 3 — FONDO CON GRILLA (inspirado en chaingpt.org)

Agregar al body en el CSS global:
```css
body {
  background-color: var(--c-bg);
  background-image:
    linear-gradient(var(--c-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--c-grid) 1px, transparent 1px);
  background-size: 50px 50px;
  color: var(--c-text);
  font-family: var(--font-body);
}
```

---

## PASO 4 — ANIMACIONES DE SCROLL EN index.html

Agregar data-reveal a TODOS los h1, h2, h3, p importantes y aplicar Splitting.js:

```javascript
function initScrollAnimations() {
  // Splitting en titulos
  Splitting({ target: '[data-split]', by: 'chars' });

  // Texto que sube con overflow hidden
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'overflow:hidden;display:block';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    gsap.set(el, { y: '110%' });
    ScrollTrigger.create({
      trigger: wrap, start: 'top 88%',
      onEnter: () => gsap.to(el, { y: '0%', duration: 1, ease: 'power4.out' })
    });
  });

  // Parallax en imagenes grandes
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.to(el, {
      yPercent: 25, ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom', end: 'bottom top', scrub: true
      }
    });
  });

  // Cards escalonadas
  gsap.utils.toArray('.card-group').forEach(g => {
    gsap.from(g.children, {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: g, start: 'top 80%' }
    });
  });

  // Contadores numericos
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => gsap.to({ v: 0 }, {
        v: end, duration: 2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; }
      })
    });
  });

  // Marquee infinito
  document.querySelectorAll('[data-marquee]').forEach(el => {
    el.innerHTML = el.innerHTML.repeat(5);
    gsap.to(el, { xPercent: -80, duration: 30, ease: 'none', repeat: -1 });
    el.addEventListener('mouseenter', () => gsap.globalTimeline.timeScale(0.2));
    el.addEventListener('mouseleave', () => gsap.globalTimeline.timeScale(1));
  });

  // Imagen que se revela con clip-path
  document.querySelectorAll('[data-reveal-img]').forEach(el => {
    gsap.from(el, {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });
}
```

---

## PASO 5 — ANIMACIÓN DE ENTRADA DEL HERO

```javascript
function initHeroAnimations() {
  // Solo correr despues de que el loader desaparezca
  const heroTitle = document.querySelector('.hero h1, .hero-title');
  if (!heroTitle) return;

  Splitting({ target: heroTitle, by: 'chars' });
  const chars = heroTitle.querySelectorAll('.char');

  gsap.set(chars, { y: '120%', opacity: 0 });
  gsap.to(chars, {
    y: '0%', opacity: 1,
    duration: 1, stagger: 0.03, ease: 'power4.out', delay: 0.1
  });

  // Navbar aparece suave
  gsap.from('nav, header', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });

  // Resto del hero sube
  gsap.from('.hero-cta, .hero-sub, .hero-scroll', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.7
  });

  // Iniciar scroll animations despues del hero
  initScrollAnimations();
}
```

---

## PASO 6 — MEJORAS VISUALES EN index.html

Hero section:
- Fondo oscuro con overlay rgba(0,0,0,0.6) sobre la imagen existente
- Titulo: font-family var(--font-display), font-size var(--text-hero), uppercase, agregar data-split
- Subtitulo y CTA: agregar data-reveal
- Boton CTA: background var(--c-accent), color #fff, border-radius 0, letter-spacing 0.12em, uppercase, padding 1rem 2.5rem, hover background var(--c-accent-2)

Agregar franja marquee entre hero y siguiente seccion:
```html
<div class="marquee-bar" style="overflow:hidden;border-top:1px solid #1E1E1E;border-bottom:1px solid #1E1E1E;padding:1rem 0;background:#111">
  <div data-marquee style="display:flex;gap:3rem;white-space:nowrap;font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:0.2em;color:#666">
    <span>TALLER KAPPA</span><span style="color:#b71c1c">✦</span>
    <span>HIERRO Y CUERO</span><span style="color:#b71c1c">✦</span>
    <span>SAN MARTÍN, BUENOS AIRES</span><span style="color:#b71c1c">✦</span>
    <span>DIRECTO DE FÁBRICA</span><span style="color:#b71c1c">✦</span>
  </div>
</div>
```

Navbar:
- Fondo transparente en el hero
- Scroll event: agregar clase .scrolled que pone background var(--c-surface) y box-shadow
- JS para el navbar:
```javascript
window.addEventListener('scroll', () => {
  document.querySelector('nav, header').classList.toggle('scrolled', window.scrollY > 50);
});
```

Cards de beneficios y servicios:
- Agregar clase card-group al contenedor
- Cada card: background var(--c-surface), border 1px solid var(--c-border), border-radius 0, padding 2rem
- Hover: border-color var(--c-accent), transform translateY(-4px), transition 0.3s ease
- Border izquierdo de 3px solid var(--c-accent) en cada card

Contadores de estadisticas (años, proyectos, etc.):
- Agregar data-count="15" data-suffix="+" al numero de años de experiencia
- Agregar data-count="500" data-suffix="+" a proyectos entregados
- Agregar data-count="12" al grosor del hierro
- Agregar data-count="4" a grandes marcas

---

## PASO 7 — MEJORAS EN catalogo.html

Grid de productos:
```css
.productos-grid, .catalog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: var(--c-border);
}
@media (min-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
@media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
```

Cada card de producto:
- background var(--c-bg)
- Imagen: aspect-ratio 1/1, object-fit cover
- Nombre: font-family var(--font-display), uppercase
- Precio: color var(--c-accent), font-weight 700
- Hover: overlay oscuro rgba(0,0,0,0.65) con botón "Ver detalle" centrado

---

## PASO 8 — OPTIMIZACIÓN DE PERFORMANCE

En TODAS las páginas:

HTML:
- Todas las imágenes que no son del hero: agregar loading="lazy"
- Todos los scripts externos: agregar defer
- Verificar que el viewport meta tag sea: content="width=device-width, initial-scale=1.0"

CSS:
- html { scroll-behavior: smooth }
- img { max-width: 100%; height: auto; display: block; }
- Todos los botones y links: transition: all 0.25s ease
- Agregar will-change: transform solo a elementos que se animan con GSAP

Imágenes:
- Verificar que todas tengan atributo alt descriptivo
- Las imágenes del hero: agregar fetchpriority="high"
- El resto: loading="lazy"

Accesibilidad:
- Verificar prefers-reduced-motion y desactivar animaciones si está activo:
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
  if (window.lenis) lenis.destroy();
}
```

Mobile:
- Desactivar smooth scroll de Lenis en touch devices si causa problemas:
```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) { lenis.destroy(); }
```

---

## CHECKLIST FINAL

- [ ] Loading screen aparece y desaparece suave en index.html
- [ ] Grilla de fondo visible en todas las páginas
- [ ] Marquee corriendo entre secciones
- [ ] Titulos del hero se animan letra por letra al cargar
- [ ] Contadores numéricos se animan al hacer scroll
- [ ] Cards entran escalonadas al hacer scroll
- [ ] Navbar transparente sobre hero, sólida al scrollear
- [ ] Catalogo en grid responsive 1/2/3 columnas
- [ ] Todas las imágenes tienen loading="lazy" y alt
- [ ] No hay errores en la consola del browser
- [ ] prefers-reduced-motion respetado
- [ ] Funciona bien en mobile 375px

Al terminar cada paso decime qué cambiaste y en qué archivos.


IMPORTANTE — CONTRASTE DE TEXTO:
Todos los textos del sitio deben ser color #F0EDE8 (blanco crema) sobre fondos oscuros.
Nunca usar texto gris oscuro o negro sobre fondo oscuro.
Reglas específicas:
- Párrafos y body text: color #F0EDE8
- Títulos: color #F0EDE8
- Texto secundario y labels: color #999999 como mínimo, nunca más oscuro
- Links en nav: color #F0EDE8, hover color #b71c1c
- Texto sobre cards oscuras: siempre #F0EDE8
- El único texto negro permitido es dentro de botones con fondo rojo #b71c1c
Revisar TODOS los archivos CSS existentes y reemplazar cualquier color de texto oscuro por estas reglas.

