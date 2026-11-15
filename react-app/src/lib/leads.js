/**
 * Consultas y presupuestos: forma de los documentos, estados y lógica del panel.
 *
 * Es JavaScript puro (sin React ni Firebase) para poder probarlo con `node --test`
 * (tests/unit/leads.test.mjs). Los límites de largo son los MISMOS que valida
 * firestore.rules: si se cambia uno, hay que cambiar el otro (las pruebas de reglas
 * escriben documentos armados con estas funciones para detectar el desfase).
 */

/** Colecciones de Firestore que usa el sitio. */
export const COLLECTIONS = { contactos: 'contactos', presupuestos: 'presupuestos' };

/** Estados de una consulta o un presupuesto. El orden es el del flujo de trabajo. */
export const ESTADOS = [
  { key: 'nueva', label: 'Nueva' },
  { key: 'en_curso', label: 'En curso' },
  { key: 'respondida', label: 'Respondida' },
  { key: 'archivada', label: 'Archivada' },
];
export const ESTADO_KEYS = ESTADOS.map((e) => e.key);
export const estadoLabel = (key) => ESTADOS.find((e) => e.key === key)?.label ?? 'Nueva';

export const LIMITS = { name: 100, interest: 100, zone: 100, message: 2000, detalle: 2000, nota: 1000, totalQty: 9999 };
export const KINDS = ['', 'particular', 'empresa'];

const clip = (value, max) => String(value ?? '').trim().slice(0, max);

/** Documento de `contactos` a partir del formulario. `createdAt` y `estado` los agrega firedb.js. */
export function contactoDoc({ name, interest, zone, message }) {
  return {
    name: clip(name, LIMITS.name),
    interest: clip(interest, LIMITS.interest),
    zone: clip(zone, LIMITS.zone),
    message: clip(message, LIMITS.message),
  };
}

/** Renglones del presupuesto, igual que en el mensaje de WhatsApp. */
export function quoteLines(cart) {
  return cart.map(({ product, color, qty }, i) =>
    `${i + 1}. ${product.name} - ${qty} ${qty === 1 ? 'unidad' : 'unidades'} - Acabado: ${color}`).join('\n');
}

/** Documento de `presupuestos` a partir del carrito y los datos opcionales. */
export function presupuestoDoc(cart, quote = {}) {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  return {
    detalle: clip(quoteLines(cart), LIMITS.detalle),
    totalQty: Math.max(1, Math.min(LIMITS.totalQty, totalQty)),
    name: clip(quote.name, LIMITS.name),
    zone: clip(quote.zone, LIMITS.zone),
    kind: KINDS.includes(quote.kind) ? quote.kind : '',
  };
}

/** Huella de un presupuesto: evita guardar dos veces el mismo pedido si se toca el botón de nuevo. */
export const presupuestoKey = (doc) => [doc.detalle, doc.name, doc.zone, doc.kind].join('|');

/** Texto en minúsculas y sin tildes, para que "martin" encuentre "Martín". */
export const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const SEARCH_FIELDS = ['name', 'interest', 'zone', 'message', 'detalle', 'nota'];

/** Estado de un documento. Los que no lo tengan (cargados a mano) cuentan como nuevos. */
export const estadoOf = (item) => (ESTADO_KEYS.includes(item.estado) ? item.estado : 'nueva');

/**
 * Filtra por estado ('todas' o una clave de ESTADOS) y por texto: cada palabra de la
 * búsqueda tiene que aparecer en algún campo.
 */
export function filterLeads(items, { estado = 'todas', search = '' } = {}) {
  const words = normalize(search).split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (estado !== 'todas' && estadoOf(item) !== estado) return false;
    if (!words.length) return true;
    const haystack = normalize(SEARCH_FIELDS.map((f) => item[f] ?? '').join(' '));
    return words.every((w) => haystack.includes(w));
  });
}

/** Cantidad por estado, más el total: { todas, nueva, en_curso, respondida, archivada }. */
export function countByEstado(items) {
  const counts = { todas: items.length };
  ESTADO_KEYS.forEach((key) => { counts[key] = 0; });
  items.forEach((item) => { counts[estadoOf(item)] += 1; });
  return counts;
}

const csvCell = (value) => {
  let text = String(value ?? '');
  // Una celda que empieza con = + - @ se interpreta como fórmula al abrir el CSV en Excel:
  // el contenido lo escribe cualquier visitante, así que se neutraliza con un apóstrofo.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

/** CSV (separado por ; y con BOM, que es lo que abre bien Excel en español). */
export function toCsv(items, columns) {
  const header = columns.map((c) => csvCell(c.label)).join(';');
  const rows = items.map((item) => columns.map((c) => csvCell(c.value(item))).join(';'));
  return `﻿${[header, ...rows].join('\r\n')}`;
}
