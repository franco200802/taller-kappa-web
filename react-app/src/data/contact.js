/**
 * Datos de contacto del negocio — fuente única.
 * Antes el número de WhatsApp estaba copiado en ~15 lugares; si cambia,
 * se cambia acá y listo.
 *
 * Los imports llevan extensión .js porque scripts/prerender.js carga este
 * archivo (vía business.js) directo con Node.
 */
import { absoluteUrl } from '../lib/site.js';

export const WHATSAPP_NUMBER = '541161242498';
export const WHATSAPP_DISPLAY = '11 6124-2498';
export const CONTACT_EMAIL = 'ing.franciscomarotta@gmail.com';

/** Link de WhatsApp; `text` es opcional y se codifica acá (no pre-codificar). */
export function whatsappUrl(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Para quién es el presupuesto: la clave se guarda en el navegador, el texto va en el mensaje de WhatsApp. */
export const QUOTE_KINDS = { particular: 'Particular', empresa: 'Local o empresa' };

/**
 * Primer mensaje de una consulta de empresa o local. Deja escritos los datos que el taller
 * necesita para cotizar sin repreguntar (los mismos que pide /mobiliario-comercial/ en
 * "Cómo pedir"): la persona completa lo que sabe y envía.
 */
export const B2B_QUOTE_MESSAGE = [
  'Hola, soy de una empresa y necesito cotización de mobiliario comercial.',
  '',
  'Rubro del local: ',
  'Productos y cantidades: ',
  'Medidas o color (si es a medida): ',
  'Zona de entrega: ',
].join('\n');

/**
 * Link de WhatsApp cuyo mensaje termina con la URL de la página. El taller ve
 * qué producto o página estaba mirando la persona (WhatsApp muestra la vista
 * previa con la foto) y puede contar qué páginas traen consultas.
 */
export function whatsappUrlFor(text, path) {
  return whatsappUrl(`${text}\n${absoluteUrl(path)}`);
}
