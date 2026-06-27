/* ============================================================
   TALLER KAPPA — animations.js
   Stack: Lenis (smooth scroll) + GSAP + ScrollTrigger + Splitting
   ============================================================ */

/* ── Reduced motion: desactivar todo ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', 'none');
    window.addEventListener('DOMContentLoaded', () => {
        const loader = document.getElementById('loader');
        if (loader) loader.remove();
    });
    // No inicializar nada más
    throw new Error('prefers-reduced-motion: animations disabled');
}

/* ── Lenis smooth scroll ── */
const isMobile = window.matchMedia('(max-width: 768px)').matches;

let lenis;
if (!isMobile) {
    lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
}

/* ── GSAP plugins ── */
gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   LOADER (solo index.html)
   ================================================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const fill = loader.querySelector('.loader-fill');
    const num  = loader.querySelector('.loader-num');

    gsap.to({ v: 0 }, {
        v: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate() {
            const v = Math.round(this.targets()[0].v);
            if (fill) fill.style.width = v + '%';
            if (num)  num.textContent = String(v).padStart(2, '0') + '%';
        },
        onComplete: () => {
            gsap.to(loader, {
                yPercent: -100,
                duration: 0.9,
                ease: 'power4.inOut',
                onComplete: () => {
                    loader.remove();
                    initHeroAnimations();
                }
            });
        }
    });
}

/* ================================================================
   HERO ENTRANCE (llamado por loader al terminar, o directo si no hay loader)
   ================================================================ */
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero h1, .hero-title');
    if (!heroTitle) {
        initScrollAnimations();
        return;
    }

    if (window.Splitting) {
        Splitting({ target: heroTitle, by: 'chars' });
        const chars = heroTitle.querySelectorAll('.char');
        gsap.set(chars, { y: '120%', opacity: 0 });
        gsap.to(chars, {
            y: '0%', opacity: 1,
            duration: 1, stagger: 0.03,
            ease: 'power4.out', delay: 0.1
        });
    }

    gsap.from('nav, header nav', {
        y: -20, opacity: 0,
        duration: 0.8, ease: 'power3.out', delay: 0.5
    });

    gsap.from('.hero-cta, .hero-sub, .hero-scroll, .hero-buttons, .hero p, .hero-seo-tag', {
        y: 30, opacity: 0,
        duration: 0.8, stagger: 0.15,
        ease: 'power3.out', delay: 0.7
    });

    initScrollAnimations();
}

/* ================================================================
   SCROLL ANIMATIONS
   ================================================================ */
function initScrollAnimations() {

    /* Splitting en títulos con data-split */
    if (window.Splitting) {
        Splitting({ target: '[data-split]', by: 'chars' });
    }

    /* Texto que sube (overflow hidden) */
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

    /* Parallax en imágenes */
    document.querySelectorAll('[data-parallax]').forEach(el => {
        gsap.to(el, {
            yPercent: 25, ease: 'none',
            scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom', end: 'bottom top', scrub: true
            }
        });
    });

    /* Cards escalonadas (.card-group) */
    gsap.utils.toArray('.card-group').forEach(g => {
        gsap.from(Array.from(g.children), {
            y: 50, opacity: 0,
            duration: 0.8, stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: g, start: 'top 80%' }
        });
    });

    /* Imágenes con clip-path */
    document.querySelectorAll('[data-reveal-img]').forEach(el => {
        el.style.willChange = 'clip-path';
        gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2, ease: 'power4.inOut',
            scrollTrigger: { trigger: el, start: 'top 82%' }
        });
    });

    /* Contadores numéricos */
    document.querySelectorAll('[data-count]').forEach(el => {
        const end    = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        ScrollTrigger.create({
            trigger: el, start: 'top 85%',
            onEnter: () => gsap.to({ v: 0 }, {
                v: end, duration: 2, ease: 'power2.out',
                onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; }
            })
        });
    });

    /* Marquee GSAP */
    document.querySelectorAll('[data-marquee]').forEach(el => {
        el.innerHTML = el.innerHTML.repeat(4);
        const tween = gsap.to(el, {
            xPercent: -50, duration: 25, ease: 'none', repeat: -1
        });
        el.addEventListener('mouseenter', () => tween.timeScale(0.2));
        el.addEventListener('mouseleave', () => tween.timeScale(1));
    });
}

/* ================================================================
   INIT
   ================================================================ */
window.addEventListener('DOMContentLoaded', () => {
    const hasLoader = !!document.getElementById('loader');
    if (hasLoader) {
        initLoader();
    } else {
        initHeroAnimations();
    }
});
