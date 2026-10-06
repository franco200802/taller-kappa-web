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

/**
 * Carga diferida de gtag.js (~175 kB). La cola de eventos (dataLayer + gtag)
 * se define de inmediato, así que los pageviews y eventos que ocurran antes
 * de que baje el script quedan encolados y se envían cuando llega: no se
 * pierde ninguno. Solo se difiere la descarga, hasta la primera interacción
 * del usuario o 3 s después del `load`, lo que ocurra primero. Así no compite
 * con el render inicial (LCP) ni con el hilo principal durante la hidratación.
 * Compromiso: una visita que se va en menos de 3 s sin tocar nada no llega a
 * enviar su pageview.
 */
function loadGtagLater() {
  const INTERACTIONS = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
  let timer;
  const inject = () => {
    INTERACTIONS.forEach((e) => window.removeEventListener(e, inject));
    window.clearTimeout(timer);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  };
  INTERACTIONS.forEach((e) => window.addEventListener(e, inject, { once: true, passive: true }));
  const armTimer = () => { timer = window.setTimeout(inject, 3000); };
  if (document.readyState === 'complete') armTimer();
  else window.addEventListener('load', armTimer, { once: true });
}

export function initGA() {
  if (typeof window === 'undefined') return; // SSR/prerender: no-op
  if (!import.meta.env.PROD) return; // no trackear en desarrollo
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // placeholder sin configurar (ya no aplica, queda como guard defensivo)
  if (gaLoaded) return;
  gaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  // send_page_view: false porque enviamos el page_view manualmente por ruta
  // (ver trackPageview) — evita el pageview duplicado del load inicial.
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  loadGtagLater();
}

/**
 * Tráfico que llega desde asistentes de IA. Se reconoce por el referrer o por el
 * `utm_source` que algunos asistentes agregan al enlace (ChatGPT usa
 * utm_source=chatgpt.com). Los asistentes que muestran enlaces a un sitio (ChatGPT,
 * Perplexity, Gemini, Copilot, Claude) mandan su dominio como referrer; las
 * respuestas de Google AI Overviews / AI Mode, en cambio, llegan como tráfico
 * orgánico de Google y se miden en Search Console, no acá.
 */
const AI_REFERRERS = {
  'chatgpt.com': 'chatgpt', 'chat.openai.com': 'chatgpt',
  'perplexity.ai': 'perplexity', 'www.perplexity.ai': 'perplexity',
  'gemini.google.com': 'gemini',
  'copilot.microsoft.com': 'copilot', // (la clave 'www.bing.com/chat' nunca coincidía con un hostname)
  'claude.ai': 'claude',
};
let aiTracked = false;

export function detectAiSource() {
  if (typeof window === 'undefined') return null;
  const utm = new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase();
  if (utm && AI_REFERRERS[utm]) return AI_REFERRERS[utm];
  try {
    return AI_REFERRERS[new URL(document.referrer).hostname.toLowerCase()] ?? null;
  } catch {
    return null; // sin referrer o inválido
  }
}

/** Envía un evento `ai_referral` (una vez por carga) si la visita viene de un asistente de IA. */
export function trackAiReferral() {
  if (aiTracked) return;
  aiTracked = true;
  const source = detectAiSource();
  if (source) trackEvent('ai_referral', { ai_source: source, landing_page: window.location.pathname });
}

export function trackPageview(path) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}

/**
 * trackEvent — para acciones puntuales (agregar al presupuesto, formulario de
 * contacto…). Los clics a WhatsApp, email y fichas de producto NO se trackean
 * a mano: los mide trackClicks() desde un solo listener.
 */
export function trackEvent(action, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
}

/**
 * Dónde está el enlace: el `data-cta` más cercano (lo ponen los botones
 * principales) o, si no hay, la zona de la página.
 */
function ctaLocation(el) {
  const tagged = el.closest('[data-cta]');
  if (tagged) return tagged.dataset.cta;
  if (el.closest('footer')) return 'footer';
  if (el.closest('header')) return 'menu';
  if (el.closest('dialog')) return 'modal';
  if (el.closest('.cta-section')) return 'cta_final';
  return 'contenido';
}

let clicksTracked = false;

/**
 * Un solo listener para todas las salidas que importan para vender, así ningún
 * CTA queda sin medir (antes 17 de los 22 enlaces a WhatsApp no enviaban nada):
 *
 *  - `whatsapp_click`: todo enlace a wa.me. Es LA conversión del sitio (marcarlo
 *    como evento clave en GA4). Parámetros: `location` (data-cta o zona),
 *    `page_path` (página desde donde se escribió) e `item_name` (producto, si
 *    el enlace está dentro de un `data-item` o la página es la de un producto).
 *  - `email_click`: enlaces mailto:.
 *  - `phone_click`: enlaces tel: (llamadas; antes no se medían).
 *  - `select_item`: clic hacia la página de un producto (qué producto interesa).
 *
 * `productNameForPath(pathname)` devuelve el nombre del producto de una URL, o null.
 */
export function trackClicks(productNameForPath) {
  if (typeof window === 'undefined' || clicksTracked) return;
  clicksTracked = true;
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    const page_path = window.location.pathname;
    const location = ctaLocation(a);
    if (href.startsWith('https://wa.me/')) {
      const item_name = a.closest('[data-item]')?.dataset.item ?? productNameForPath(page_path) ?? undefined;
      trackEvent('whatsapp_click', { location, page_path, item_name });
    } else if (href.startsWith('mailto:')) {
      trackEvent('email_click', { location, page_path });
    } else if (href.startsWith('tel:')) {
      trackEvent('phone_click', { location, page_path });
    } else if (href.startsWith('/')) {
      const item_name = productNameForPath(href);
      if (item_name && href.replace(/\/+$/, '') !== page_path.replace(/\/+$/, '')) trackEvent('select_item', { item_name, location, page_path });
    }
  }, { capture: true });
}
