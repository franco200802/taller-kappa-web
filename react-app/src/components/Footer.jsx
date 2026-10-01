import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';
import { BUSINESS } from '../data/business';

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo/', label: 'Catálogo' },
  { to: '/sillon-bkf/', label: 'Sillón BKF' },
  { to: '/catalogo/asientos/', label: 'Sillones y bancos BKF' },
  { to: '/catalogo/mesas/', label: 'Bases de mesa' },
  { to: '/bkf/', label: 'Qué es el sillón BKF' },
  { to: '/mobiliario-comercial/', label: 'Mobiliario comercial' },
  { to: '/proyectos/', label: 'Proyectos y clientes' },
  { to: '/envios/', label: 'Envíos' },
  { to: '/garantia/', label: 'Garantía' },
  { to: '/nosotros/', label: 'Nosotros' },
  { to: '/faq/', label: 'Preguntas frecuentes' },
  { to: '/contacto/', label: 'Contacto' },
];

/**
 * Mapa de Google Maps que se monta recién cuando el footer entra en pantalla.
 * Antes el <iframe> (aun con loading="lazy") se descargaba en casi cualquier
 * página —son cortas, el footer queda dentro de la distancia de precarga— y
 * traía ~360 kB de JS de Google que competían con el render inicial. El estado
 * arranca en false igual en el prerender y en el cliente, así que la
 * hidratación no cambia; el contenedor ya tiene alto fijo (sin CLS).
 */
function LazyMap() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShow(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShow(true); io.disconnect(); }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="footer-map" ref={ref}>
      <a className="footer-map-link" href={BUSINESS.mapUrl} target="_blank" rel="noopener noreferrer">
        <span>Abrir en Google Maps</span>
      </a>
      {show && (
        <iframe
          src="https://maps.google.com/maps?q=-34.5851938,-58.5281526&t=&z=16&ie=UTF8&iwloc=&output=embed"
          title="Ubicación Taller Kappa en Google Maps"
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contacto" aria-label="Información de contacto">
      <div className="footer-content">
        <div className="footer-col">
          <span className="footer-logo">Taller Kappa</span>
          <address className="footer-info">
            <p><strong>Fábrica &amp; Showroom</strong></p>
            <p><Icon name="map-marker-alt" /> Calle&nbsp;28 Nº&nbsp;3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
            <p><Icon name="whatsapp" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><Icon name="envelope" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </address>
          <div className="footer-nav">
            {FOOTER_LINKS.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
          </div>
        </div>
        <div className="footer-col">
          <LazyMap />
        </div>
      </div>
      <p className="footer-copy">© {__BUILD_YEAR__} {BUSINESS.legalName} Todos los derechos reservados.</p>
    </footer>
  );
}
