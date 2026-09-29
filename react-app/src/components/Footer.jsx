import { NavLink } from 'react-router-dom';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/envios', label: 'Envíos' },
  { to: '/garantia', label: 'Garantía' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/faq', label: 'Preguntas Frecuentes' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  return (
    <footer id="contacto" aria-label="Información de contacto">
      <div className="footer-content">
        <div className="footer-col">
          <span className="footer-logo">Taller Kappa</span>
          <div className="footer-info">
            <p><strong>Fábrica &amp; Showroom</strong></p>
            <p><i className="fas fa-map-marker-alt" /> Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
            <p><i className="fab fa-whatsapp" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><i className="far fa-envelope" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </div>
          <div className="footer-nav">
            {FOOTER_LINKS.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-map">
            <iframe
              src="https://maps.google.com/maps?q=-34.5851938,-58.5281526&t=&z=16&ie=UTF8&iwloc=&output=embed"
              title="Ubicación Taller Kappa en Google Maps"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Taller Kappa S.R.L. — Todos los derechos reservados.</p>
    </footer>
  );
}
