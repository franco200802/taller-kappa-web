/**
 * analytics.js — Google Analytics 4 (gtag.js), cargado solo en el navegador.
 *
 * GA_MEASUREMENT_ID es el ID real de la propiedad GA4 ya existente de
 * Taller Kappa (confirmado por el dueño del proyecto: la propiedad ya
 * tenía datos históricos de una integración previa fuera de este repo,
 * probablemente del sitio estático viejo). Este módulo es lo que conecta
 * el sitio React actual a esa misma propiedad, para no perder el historial.
 *
 * Por qué un módulo aparte en vez de <script> fijo en index.html:
 *   - El sitio es una SPA con react-router: gtag.js por sí solo NO detecta
 *     los cambios de ruta (no hay recarga de página), así que hay que
 *     enviar el evento 'page_view' manualmente en cada cambio de ruta
 *     (ver trackPageview, llamado desde Layout.jsx).
 *   - Solo se carga en producción (import.meta.env.PROD) para no ensuciar
 *     las métricas reales con visitas de `npm run dev`.
 *   - Todo queda detrás de `typeof window !== 'undefined'` para no romper
 *     scripts/prerender.js, que renderiza con react-dom/server en Node
 *     (donde no existe `window`/`document`).
 */
export const GA_MEASUREMENT_ID = 'G-2FDMN51XDY'; // Measurement ID real de la propiedad GA4 de Taller Kappa

let gaLoaded = false;

export function initGA() {
  if (typeof window === 'undefined') return; // SSR/prerender: no-op
  if (!import.meta.env.PROD) return; // no trackear en desarrollo
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // placeholder sin configurar (ya no aplica, queda como guard defensivo)
  if (gaLoaded) return;
  gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  // send_page_view: false porque enviamos el page_view manualmente por ruta
  // (ver trackPageview) — evita el pageview duplicado del load inicial.
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}

/**
 * trackEvent — para acciones puntuales (ej. click en "Cotizar por WhatsApp",
 * agregar producto al presupuesto). No se llama todavía desde ningún lado:
 * queda disponible para usarse a medida que se decida qué eventos importan.
 */
export function trackEvent(action, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
}
