/**
 * useReveal — hook liviano de scroll-reveal con anime.js.
 * Reemplaza el IntersectionObserver + GSAP ScrollTrigger del sitio viejo
 * por algo mucho más chico (anime.js standalone pesa ~24kb vs GSAP+ScrollTrigger ~70kb).
 *
 * Uso:
 *   const ref = useReveal({ delay: 100 });
 *   <div ref={ref} className="card">...</div>
 *
 * Para grupos con stagger:
 *   const ref = useStaggerReveal('.card-child');
 *   <div ref={ref}><div className="card-child">...</div>...</div>
 */
import { useEffect, useRef } from 'react';

let animatePromise = null;
function loadAnime() {
  // Import dinámico: anime.js solo se descarga cuando hace falta animar algo,
  // no bloquea el render inicial de la página.
  if (!animatePromise) animatePromise = import('animejs');
  return animatePromise;
}

export function useReveal({ delay = 0, y = 24, duration = 700 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = 1;
      return;
    }

    const io = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        io.unobserve(el);
        const { animate } = await loadAnime();
        animate(el, {
          opacity: [0, 1],
          translateY: [y, 0],
          duration,
          delay,
          ease: 'outQuart',
        });
      },
      { threshold: 0.12 }
    );

    el.style.opacity = 0;
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y, duration]);

  return ref;
}

export function useStaggerReveal(childSelector, { staggerMs = 80 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        io.unobserve(el);
        const { animate, stagger } = await loadAnime();
        const children = el.querySelectorAll(childSelector);
        animate(children, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
          delay: stagger(staggerMs),
          ease: 'outQuart',
        });
      },
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [childSelector, staggerMs]);

  return ref;
}

/** Animación de entrada del hero — texto letra por letra (splitText de anime v4) */
export async function animateHeroTitle(selector) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { animate, stagger, splitText } = await loadAnime();
  const { chars } = splitText(selector, { words: false, chars: true });
  animate(chars, {
    y: [{ to: '-1.2rem', ease: 'outExpo', duration: 500 }, { to: 0, ease: 'outBounce', duration: 600 }],
    opacity: [0, 1],
    delay: stagger(18),
    ease: 'outQuart',
  });
}
