/**
 * Datos de contacto del negocio — fuente única.
 * Antes el número de WhatsApp estaba copiado en ~15 lugares; si cambia,
 * se cambia acá y listo.
 */
export const WHATSAPP_NUMBER = '541161242498';
export const WHATSAPP_DISPLAY = '11 6124-2498';
export const CONTACT_EMAIL = 'ing.franciscomarotta@gmail.com';

/** Link de WhatsApp; `text` es opcional y se codifica acá (no pre-codificar). */
export function whatsappUrl(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
