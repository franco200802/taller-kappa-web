import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { initGA, trackPageview, trackEvent } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import Toast from './Toast';
import { whatsappUrl } from '../data/contact';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://tallerkappa.com.ar/#organization',
  name: 'Taller Kappa',
  image: 'https://tallerkappa.com.ar/images/bkf1.jpg',
  url: 'https://tallerkappa.com.ar',
  telephone: '+541161242498',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 28 Nº 3779',
    addressLocality: 'San Martín',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  areaServed: { '@type': 'Country', name: 'Argentina' },
  // Mismas coordenadas reales del iframe de Google Maps en Footer.jsx
  // (Calle 28 Nº 3779, Villa Chacabuco, San Martín) — no son un valor inventado.
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -34.5851938,
    longitude: -58.5281526,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Taller Kappa',
  url: 'https://tallerkappa.com.ar',
  inLanguage: 'es-AR',
};

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
        <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
      </Helmet>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Navbar />
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
