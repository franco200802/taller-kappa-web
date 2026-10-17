/**
 * Datos de la empresa — fuente única de la identidad de Taller Kappa.
 *
 * Los consumen el JSON-LD (lib/schema.js), el footer, Contacto, Nosotros,
 * las FAQ y el llms.txt que genera scripts/prerender.js. Todo lo que hay acá
 * ya figuraba en el sitio (footer, contacto, envíos, mapa); no se agregó
 * ningún dato nuevo. Lo que NO se sabe o no se publica (CUIT, redes sociales,
 * año exacto de fundación, precios, perfiles de Google/Bing) no está: no se inventa.
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
    'Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín, provincia de Buenos Aires, Argentina. Fabrica sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos. Tiene showroom con visitas con turno previo y retiro presencial con coordinación previa.',
  /** Cómo se vende: lo dice el sitio en cada ficha. */
  salesModel: 'Se vende por cotización: no hay precios publicados ni compra online, y se consulta por WhatsApp o por el formulario de contacto.',
  address: {
    /**
     * Igual que en el Perfil de Empresa de Google, letra por letra: Google
     * compara la dirección del sitio (JSON-LD) con la del perfil.
     */
    street: 'Vélez Sársfield 3779',
    /** Nombre numérico de la misma calle en San Martín (confirmado por el propietario). */
    streetAlias: 'Calle 28',
    neighborhood: 'Villa Chacabuco',
    locality: 'San Martín',
    region: 'Buenos Aires',
    postalCode: '1650',
    regionFull: 'provincia de Buenos Aires',
    countryCode: 'AR',
    country: 'Argentina',
  },
  /**
   * Coordenadas del local. Verificadas: el enlace de Google Maps que dio el
   * propietario (mapUrl) resuelve al lugar "Taller Kappa" en estas mismas
   * coordenadas (-34.5851938, -58.5281526).
   */
  geo: { latitude: -34.5851938, longitude: -58.5281526 },
  /** Enlace de ubicación provisto por el propietario. */
  mapUrl: 'https://maps.app.goo.gl/96acmiHnvF2ZA4KM7',
  /**
   * Ficha "Taller Kappa" de Google Maps / Perfil de Empresa (reclamada el
   * 17/10/2026). El CID (0x5433fc202692f29c en la URL de mapUrl) y el Place ID
   * salen de esa misma ficha. Se usan en schema `sameAs` y en /resena/.
   */
  googleMapsCid: '6067470338014507676',
  googlePlaceId: 'ChIJK5VczqO3vJURnPKSJiD8M1Q',
  /** Horario de atención del local (showroom y retiro, ambos con coordinación previa). */
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00', label: 'lunes a viernes de 9 a 18 hs' },
  /** Showroom en la misma dirección. Las visitas requieren turno (WhatsApp o teléfono). */
  showroom: {
    available: true,
    appointmentRequired: true,
    appointmentChannels: ['WhatsApp', 'teléfono'],
    short: 'Visitas con turno previo, que se pide por WhatsApp o teléfono',
    text: `Taller Kappa tiene showroom en su taller de Vélez Sársfield 3779 (Calle 28), Villa Chacabuco, San Martín. Se puede visitar con turno previo, que se solicita por WhatsApp o por teléfono al ${WHATSAPP_DISPLAY}.`,
  },
  /** Retiro presencial: requiere coordinación previa. */
  pickup: {
    available: true,
    requiresCoordination: true,
    short: 'Retiro presencial con coordinación previa',
    text: 'El retiro es presencial en el taller y se coordina antes por WhatsApp o por teléfono. Atendemos de lunes a viernes de 9 a 18 hs.',
  },
  /** El plazo no es fijo: no se promete ninguno. */
  deliveryNote: 'El plazo de entrega depende de la disponibilidad de stock. Consultanos por WhatsApp.',
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

/** Ficha pública de Google Maps (estable: por CID, no depende del nombre ni de la URL corta). */
export const googleProfileUrl = () => `https://maps.google.com/?cid=${BUSINESS.googleMapsCid}`;

/** Formulario de reseña de Google de la ficha. Lo usa la página /resena/ (prerender). */
export const googleReviewUrl = () => `https://search.google.com/local/writereview?placeid=${BUSINESS.googlePlaceId}`;

/** "Vélez Sársfield 3779 (Calle 28), Villa Chacabuco, San Martín, Buenos Aires, Argentina, CP 1650" */
export function addressLine() {
  const a = BUSINESS.address;
  return `${a.street} (${a.streetAlias}), ${a.neighborhood}, ${a.locality}, ${a.region}, ${a.country}, CP ${a.postalCode}`;
}
