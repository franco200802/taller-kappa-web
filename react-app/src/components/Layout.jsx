import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { initGA, trackPageview, trackEvent } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import Toast from './Toast';
import { whatsappUrl } from '../data/contact';
import { siteNodes } from '../lib/schema';

// Empresa + marca + sitio como un solo grafo enlazado por @id (ver lib/schema.js).
// Es constante: se calcula una vez al cargar el módulo.
const SITE_GRAPH = JSON.stringify({ '@context': 'https://schema.org', '@graph': siteNodes() });

/**
 * Esconde el WhatsApp flotante mientras hay un botón de acción a la vista
 * (hero, fichas, cierres, formulario) o el footer: en mobile el círculo
 * tapaba "Cotizar para empresas", el botón de enviar y los links del pie.
 * Va dentro del <Suspense>, después del <Outlet>, para que su efecto corra
 * cuando la página lazy ya montó. El estado arranca en false igual en el
 * prerender y en el cliente, así que la hidratación no cambia.
 */
const WA_HIDE_TARGETS = '.home-hero-actions, .bkf-actions, .cta-btns, .form-submit, footer';
function FloatWaSentinel({ onChange }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      onChange(visible.size > 0);
    });
    document.querySelectorAll(WA_HIDE_TARGETS).forEach((el) => io.observe(el));
    return () => { io.disconnect(); onChange(false); };
  }, [pathname, onChange]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const [waHidden, setWaHidden] = useState(false);

  // Scroll al top en cada cambio de ruta (SPA no lo hace solo)
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // GA4: se inicializa una sola vez (no-op si no hay Measurement ID real
  // configurado en lib/analytics.js, o en desarrollo/SSR). El pageview se
  // envía a mano en cada cambio de ruta porque gtag.js no detecta navegación
  // de una SPA por sí solo (no hay recarga de documento).
  useEffect(() => { initGA(); }, []);
  useEffect(() => { trackPageview(pathname); }, [pathname]);

  return (
    <div>
      <Helmet>
        <script type="application/ld+json">{SITE_GRAPH}</script>
      </Helmet>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header>
        <Navbar />
      </header>
      <main id="contenido" tabIndex={-1}>
        {/* El Suspense de las páginas lazy vive acá y no en App.jsx: Layout
            se renderiza igual en el prerender y en el cliente, así los
            marcadores <!--$--> del HTML estático coinciden al hidratar.
            Con el boundary solo en el cliente, React descartaba todo el
            HTML prerenderizado (errores #418/#423) en cada página. */}
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <Outlet />
          <FloatWaSentinel onChange={setWaHidden} />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <a href={whatsappUrl()} className={`float-wa${waHidden ? ' is-hidden' : ''}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
        onClick={() => trackEvent('whatsapp_click', { location: 'float_button', page: pathname })}>
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  );
}
