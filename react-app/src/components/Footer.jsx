import { NavLink } from 'react-router-dom';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';
import { BUSINESS } from '../data/business';

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo/', label: 'Catálogo' },
  { to: '/catalogo/asientos/', label: 'Sillones y bancos BKF' },
  { to: '/catalogo/mesas/', label: 'Bases de mesa' },
  { to: '/proyectos/', label: 'Proyectos' },
  { to: '/envios/', label: 'Envíos' },
  { to: '/garantia/', label: 'Garantía' },
  { to: '/nosotros/', label: 'Nosotros' },
  { to: '/faq/', label: 'Preguntas frecuentes' },
  { to: '/contacto/', label: 'Contacto' },
];

export default function Footer() {
  return (
    <footer id="contacto" aria-label="Información de contacto">
      <div className="footer-content">
        <div className="footer-col">
          <span className="footer-logo">Taller Kappa</span>
          <address className="footer-info">
            <p><strong>Fábrica &amp; Showroom</strong></p>
            <p><i className="fas fa-map-marker-alt" aria-hidden="true" /> Calle&nbsp;28 Nº&nbsp;3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
            <p><i className="fab fa-whatsapp" aria-hidden="true" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><i className="far fa-envelope" aria-hidden="true" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </address>
          <div className="footer-nav">
            {FOOTER_LINKS.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-map">
            <a className="footer-map-link" href="https://maps.google.com/?q=-34.5851938,-58.5281526" target="_blank" rel="noopener noreferrer">
              <span>Abrir en Google Maps</span>
            </a>
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
      <p className="footer-copy">© {__BUILD_YEAR__} {BUSINESS.legalName} Todos los derechos reservados.</p>
    </footer>
  );
}
