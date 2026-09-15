import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutoReveal } from '../lib/useAutoReveal';
import { initGA, trackPageview } from '../lib/analytics';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import Toast from './Toast';

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

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // Scroll al top en cada cambio de ruta (SPA no lo hace solo)
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // GA4: se inicializa una sola vez (no-op si no hay Measurement ID real
  // configurado en lib/analytics.js, o en desarrollo/SSR). El pageview se
  // envía a mano en cada cambio de ruta porque gtag.js no detecta navegación
  // de una SPA por sí solo (no hay recarga de documento).
  useEffect(() => { initGA(); }, []);
  useEffect(() => { trackPageview(pathname); }, [pathname]);

  // El CSS heredado del sitio viejo define `body.inner-page { padding-top: ... }`
  // para separar el título de las páginas internas del navbar fijo. Como en
  // React el layout es un <div> anidado (no <body>), ese selector nunca se
  // disparaba y los títulos quedaban pegados al header. Se sincroniza acá.
  useEffect(() => {
    document.body.classList.toggle('inner-page', !isHome);
  }, [isHome]);

  // Revela secciones/cards con opacity:0 por defecto (heredado del CSS viejo)
  useAutoReveal();

  return (
    <div>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
      </Helmet>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
      <Toast />
      <a href="https://wa.me/541161242498" className="float-wa" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp"
        onClick={() => trackEvent('whatsapp_click', { location: 'float_button', page: pathname })}>
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  );
}
