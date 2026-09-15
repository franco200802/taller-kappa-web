/**
 * analytics.js — Google Analytics 4 (gtag.js), cargado solo en el navegador.
 *
 * IMPORTANTE — antes de que esto haga algo:
 *   1. Crear una propiedad GA4 en https://analytics.google.com
 *   2. Copiar el "Measurement ID" (formato G-XXXXXXXXXX)
 *   3. Reemplazar el valor de GA_MEASUREMENT_ID de abajo por ese ID real.
 *
 * Sin un ID real (o con el placeholder actual), initGA() no hace nada:
 * no se envía ningún dato falso ni se rompe el build. Esto es intencional,
 * no un "TODO" a medias — no se puede inventar un Measurement ID.
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
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // <- reemplazar por el ID real de GA4

let gaLoaded = false;

export function initGA() {
  if (typeof window === 'undefined') return; // SSR/prerender: no-op
  if (!import.meta.env.PROD) return; // no trackear en desarrollo
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // placeholder sin configurar
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
