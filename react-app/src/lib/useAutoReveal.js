/**
 * useAutoReveal — replica el comportamiento del initSectionAnimations()
 * del sitio vanilla viejo: varias clases del CSS heredado (.section-fade,
 * .product-card, .material-card, .testimonial-card) tienen `opacity: 0`
 * por defecto y esperan que JS les agregue una clase ('visible' o 'fade-in')
 * cuando entran en viewport. Como esas clases no tienen estado propio en
 * React (siempre son el mismo string estático), es seguro manipularlas
 * directamente vía classList sin que un re-render las pise.
 *
 * Se llama una sola vez en Layout.jsx.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function reveal(selector, className, { threshold = 0.1, stagger = 0 } = {}) {
  const nodes = document.querySelectorAll(selector);
  const pending = Array.from(nodes).filter((el) => !el.dataset.kappaRevealed);
  if (!pending.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pending.forEach((el) => { el.classList.add(className); el.dataset.kappaRevealed = '1'; });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.dataset.kappaRevealed = '1';
      setTimeout(() => el.classList.add(className), stagger * i);
      io.unobserve(el);
    });
  }, { threshold });

  pending.forEach((el) => io.observe(el));
}

function run() {
  reveal('.section-fade', 'visible', { threshold: 0.08 });
  reveal('.testimonial-card, .material-card, .number-item', 'fade-in', { threshold: 0.12, stagger: 90 });
  reveal('.product-card', 'visible', { threshold: 0.1, stagger: 80 });
}

export function useAutoReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esperamos dos frames para asegurarnos de que el DOM de la nueva
    // ruta ya esté pintado antes de calcular intersecciones.
    let raf2;
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(run); });

    // Los productos/testimonios (Firestore) pueden llegar después del
    // primer paint — un MutationObserver los detecta y revela también.
    const root = document.getElementById('root');
    const mo = root ? new MutationObserver(() => run()) : null;
    if (mo && root) mo.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (mo) mo.disconnect();
    };
  }, [pathname]);
}
