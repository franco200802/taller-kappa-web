import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutoReveal } from '../lib/useAutoReveal';
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

  // Revela secciones/cards con opacity:0 por defecto (heredado del CSS viejo)
  useAutoReveal();

  return (
    <div className={isHome ? '' : 'inner-page'}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
      </Helmet>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
      <Toast />
      <a href="https://wa.me/541161242498" className="float-wa" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  );
}
