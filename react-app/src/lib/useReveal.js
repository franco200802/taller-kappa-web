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

/**
 * Animación de entrada del hero — texto letra por letra (splitText de anime v4).
 *
 * splitText muta el DOM envolviendo cada carácter en un <span>. En desarrollo,
 * <StrictMode> invoca los efectos dos veces a propósito, así que sin esta
 * guarda el título terminaba duplicado/cuadruplicado visualmente (splitText
 * se ejecutaba sobre un texto que ya había sido dividido en la llamada previa).
 */
export async function animateHeroTitle(selector) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el || el.dataset.splitDone === 'true') return;
  el.dataset.splitDone = 'true';

  const { animate, stagger, splitText } = await loadAnime();
  const { chars } = splitText(selector, { words: false, chars: true });
  animate(chars, {
    y: [{ to: '-1.2rem', ease: 'outExpo', duration: 500 }, { to: 0, ease: 'outBounce', duration: 600 }],
    opacity: [0, 1],
    delay: stagger(18),
    ease: 'outQuart',
  });
}

/**
 * Animación de entrada de un párrafo — palabra por palabra, deslizando hacia
 * arriba desde un recorte (wrap:'clip'), a diferencia de animateHeroTitle que
 * divide por caracteres. Pensada para el copy debajo del H1 del hero.
 *
 * Misma guarda de idempotencia que animateHeroTitle: sin ella, StrictMode
 * duplica las palabras en desarrollo al invocar el efecto dos veces.
 *
 * Ver: https://animejs.com/documentation/text/splittext/textsplitter-settings/words
 */
export async function animateHeroParagraph(selector) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el || el.dataset.splitDone === 'true') return;
  el.dataset.splitDone = 'true';

  const { animate, stagger, splitText } = await loadAnime();
  const { words } = splitText(selector, { words: { wrap: 'clip' }, chars: false });
  animate(words, {
    y: ['100%', '0%'],
    opacity: [0, 1],
    duration: 600,
    ease: 'outExpo',
    delay: stagger(40, { start: 300 }),
  });
}

/**
 * useScrollMove — mueve/rota/escala un elemento en sincro con el scroll,
 * usando el ScrollObserver nativo de anime v4 (onScroll), no un
 * IntersectionObserver + animación fija como los otros hooks de este archivo.
 *
 * A diferencia de useReveal (que dispara una animación UNA vez al entrar en
 * viewport), acá el progreso de scroll se mapea 1:1 al valor de la propiedad
 * mientras el elemento cruza el viewport — por eso sirve para efectos tipo
 * "esta mesa se desliza hacia la derecha a medida que bajás".
 *
 * Uso:
 *   const ref = useScrollMove({ translateX: [-60, 60], rotate: [-4, 4] });
 *   <img ref={ref} src="/images/mesa.jpeg" />
 *
 * Ver: https://animejs.com/documentation/events/onscroll
 */
export function useScrollMove(props, { axis = 'y', enter = 'bottom top', leave = 'top bottom' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animation;
    let observer;
    let cancelled = false;

    (async () => {
      const { animate, onScroll } = await loadAnime();
      if (cancelled) return;

      animation = animate(el, {
        ...props,
        ease: 'linear',
        autoplay: onScroll({
          target: el,
          axis,
          enter,
          leave,
          sync: true,
        }),
      });
      observer = animation.autoplay;
    })();

    return () => {
      cancelled = true;
      observer?.revert?.();
      animation?.revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
