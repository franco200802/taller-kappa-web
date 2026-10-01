/**
 * Datos de la empresa — fuente única de la identidad de Taller Kappa.
 *
 * Los consumen el JSON-LD (lib/schema.js), el footer, Contacto, Nosotros,
 * las FAQ y el llms.txt que genera scripts/prerender.js. Todo lo que hay acá
 * ya figuraba en el sitio (footer, contacto, envíos, mapa); no se agregó
 * ningún dato nuevo. Lo que NO se sabe (CUIT, redes sociales, año exacto de
 * fundación, precios) no está: no se inventa.
 *
 * Los imports llevan extensión .js porque scripts/prerender.js carga este
 * archivo directo con Node.
 */
import { SITE } from '../lib/site.js';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from './contact.js';

export const BUSINESS = {
  name: 'Taller Kappa',
  legalName: 'Taller Kappa S.R.L.',
  alternateName: ['Taller Kappa SRL'],
  url: SITE,
  /** Qué es, en una frase que se puede citar tal cual. */
  summary:
    'Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín, provincia de Buenos Aires, Argentina. Fabrica sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos.',
  /** Cómo se vende: lo dice el sitio en cada ficha. */
  salesModel: 'Se vende por cotización: no hay precios publicados ni compra online, y se consulta por WhatsApp o por el formulario de contacto.',
  address: {
    street: 'Calle 28 Nº 3779',
    neighborhood: 'Villa Chacabuco',
    locality: 'San Martín',
    region: 'Buenos Aires',
    regionFull: 'provincia de Buenos Aires',
    countryCode: 'AR',
    country: 'Argentina',
  },
  /** Mismas coordenadas del mapa embebido en el footer. */
  geo: { latitude: -34.5851938, longitude: -58.5281526 },
  mapUrl: 'https://maps.google.com/?q=-34.5851938,-58.5281526',
  /** Horario de retiro en el taller que ya publica /envios/. */
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00', label: 'lunes a viernes de 9 a 18 hs' },
  phone: '+541161242498',
  phoneDisplay: WHATSAPP_DISPLAY,
  whatsappNumber: WHATSAPP_NUMBER,
  email: CONTACT_EMAIL,
  /** logo-taller-kappa.jpg mide 1024x1024 (verificado con `file`). */
  logo: { path: '/images/logo-taller-kappa.jpg', width: 1024, height: 1024 },
  /** Para quién fabrica, según Nosotros y Proyectos. */
  audiences: ['particulares', 'empresas', 'locales gastronómicos', 'estaciones de servicio', 'comercios', 'hoteles', 'oficinas'],
  /** Temas de los que el sitio trata (schema `knowsAbout`). */
  topics: ['Sillón BKF', 'Banco BKF', 'Base de mesa de hierro', 'Muebles de hierro y cuero', 'Mobiliario comercial y gastronómico'],
};

/** "Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires" */
export function addressLine() {
  const a = BUSINESS.address;
  return `${a.street}, ${a.neighborhood}, ${a.locality}, ${a.region}`;
}
