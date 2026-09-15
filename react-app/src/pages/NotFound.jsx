import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { trackEvent } from '../lib/analytics';

export default function NotFound() {
  // Trackear 404s reales en GA4: si una URL rota se repite seguido, es una
  // señal concreta de un link interno roto o de un enlace externo/backlink
  // apuntando a algo que ya no existe, y hay que arreglarlo.
  useEffect(() => {
    trackEvent('404_not_found', { path: typeof window !== 'undefined' ? window.location.pathname : '' });
  }, []);

  return (
    <section className="section-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
      <Seo
        title="Página no encontrada | Taller Kappa"
        description="La página que buscás no existe o fue movida."
        path="/404"
        noindex
      />
      <h1>404 — Página no encontrada</h1>
      <p>La página que buscás no existe o fue movida.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
        <Link to="/" className="btn-main">Ir al Inicio</Link>
        <Link to="/catalogo" className="btn-outline">Ver catálogo</Link>
        <Link to="/contacto" className="btn-outline">Contactanos</Link>
      </div>
    </section>
  );
}
