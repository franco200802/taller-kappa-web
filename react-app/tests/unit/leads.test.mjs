// Pruebas unitarias de la lógica de consultas y presupuestos (sin navegador ni Firebase).
// Correr: npm run test:unit
import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE_FLAT_COLUMNS, BASE_FLAT_HEIGHTS, BASE_FLAT_SLUG, describeBaseFlat, getProductBySlug } from '../../src/data/products.js';
import {
  ESTADO_KEYS, LIMITS, commentLine, contactoDoc, countByEstado, estadoOf, filterLeads, normalize,
  presupuestoDoc, presupuestoKey, quoteLines, quoteMessage, toCsv,
} from '../../src/lib/leads.js';

const cart = [
  { product: { name: 'Sillón BKF Premium' }, color: 'Negro Mate', qty: 2 },
  { product: { name: 'Banco BKF' }, color: 'Cromado', qty: 1 },
];

test('contactoDoc recorta espacios y largos, y solo devuelve los campos que aceptan las reglas', () => {
  const doc = contactoDoc({ name: '  Ana  ', interest: 'Sillón BKF', zone: ' Palermo ', message: 'x'.repeat(5000), extra: 'no', estado: 'respondida' });
  assert.deepEqual(Object.keys(doc).sort(), ['interest', 'message', 'name', 'zone']);
  assert.equal(doc.name, 'Ana');
  assert.equal(doc.zone, 'Palermo');
  assert.equal(doc.message.length, LIMITS.message);
});

test('contactoDoc tolera campos ausentes', () => {
  assert.deepEqual(contactoDoc({ name: 'Ana', message: 'Hola' }), { name: 'Ana', interest: '', zone: '', message: 'Hola' });
});

test('quoteLines arma un renglón por producto, con singular y plural', () => {
  assert.equal(quoteLines(cart), '1. Sillón BKF Premium - 2 unidades - Acabado: Negro Mate\n2. Banco BKF - 1 unidad - Acabado: Cromado');
});

test('Base Flat usa altura y diámetro publicados y conserva las variantes por renglón', () => {
  const product = getProductBySlug(BASE_FLAT_SLUG);
  assert.deepEqual(BASE_FLAT_HEIGHTS.map(({ value }) => value), [73, 105]);
  assert.deepEqual(BASE_FLAT_COLUMNS.map(({ value }) => value), [77, 101]);
  const lines = [
    { product, color: describeBaseFlat({ height: BASE_FLAT_HEIGHTS[0].name, column: BASE_FLAT_COLUMNS[0].name }), qty: 2 },
    { product, color: describeBaseFlat({ height: BASE_FLAT_HEIGHTS[1].name, column: BASE_FLAT_COLUMNS[1].name }), qty: 1 },
  ];
  assert.equal(quoteLines(lines), '1. Base de Mesa Flat - 2 unidades - Variante: Mesa (73 cm), columna de 77 mm\n2. Base de Mesa Flat - 1 unidad - Variante: Barra (105 cm), columna de 101 mm');
  assert.equal(presupuestoDoc(lines).detalle, quoteLines(lines));
});

test('una Base Flat anterior conserva el acabado sin asignarle medidas', () => {
  const product = getProductBySlug(BASE_FLAT_SLUG);
  assert.equal(quoteLines([{ product, color: 'Negro Mate', qty: 1 }]),
    '1. Base de Mesa Flat - 1 unidad - Variante: Negro Mate · Altura y diámetro de columna a definir');
});

test('una Base Flat con acabado y medidas conserva su variante completa', () => {
  const product = getProductBySlug(BASE_FLAT_SLUG);
  const color = describeBaseFlat({ finish: 'Cromado', height: BASE_FLAT_HEIGHTS[1].name, column: BASE_FLAT_COLUMNS[1].name });
  assert.equal(quoteLines([{ product, color, qty: 1 }]),
    '1. Base de Mesa Flat - 1 unidad - Variante: Cromado, Barra (105 cm), columna de 101 mm');
});

test('presupuestoDoc suma las unidades y normaliza los datos opcionales', () => {
  const doc = presupuestoDoc(cart, { name: ' Juan ', zone: 'Caballito', kind: 'empresa' });
  assert.equal(doc.totalQty, 3);
  assert.equal(doc.name, 'Juan');
  assert.equal(doc.kind, 'empresa');
  assert.ok(Number.isInteger(doc.totalQty));
});

test('presupuestoDoc descarta un tipo de cliente desconocido y acota cantidades absurdas', () => {
  const doc = presupuestoDoc([{ product: { name: 'Banco BKF' }, color: 'Negro Mate', qty: 1e9 }], { kind: 'admin' });
  assert.equal(doc.kind, '');
  assert.equal(doc.totalQty, LIMITS.totalQty);
  assert.equal(doc.name, '');
});

test('quoteMessage sin datos opcionales es el mensaje de siempre', () => {
  assert.equal(quoteMessage(cart, {}),
    'Hola Taller Kappa! Quisiera pedir un presupuesto:\n\n'
    + '1. Sillón BKF Premium - 2 unidades - Acabado: Negro Mate\n2. Banco BKF - 1 unidad - Acabado: Cromado\n\n'
    + 'Total: 3 unidades\n\nPor favor, indicarme el precio final y el plazo de entrega. Gracias!');
  assert.equal(quoteMessage([], { name: 'Ana' }), '');
});

test('quoteMessage suma nombre, tipo de cliente, zona y comentarios en ese orden', () => {
  const msg = quoteMessage(cart.slice(1), { name: ' Ana ', kind: 'empresa', zone: 'Palermo', comment: '  Para un local,\n en blanco crema ' });
  assert.match(msg, /Total: 1 unidad\nNombre: Ana\nEs para: Local o empresa\nZona de entrega: Palermo\nComentarios o medidas: Para un local, en blanco crema\n\nPor favor/);
});

test('commentLine recorta, junta los renglones y respeta el límite', () => {
  assert.equal(commentLine({ comment: '   ' }), '');
  assert.equal(commentLine({}), '');
  assert.equal(commentLine({ comment: 'x'.repeat(1000) }).length, 'Comentarios o medidas: '.length + LIMITS.comment);
});

test('presupuestoDoc lleva los comentarios dentro del detalle (sin campos nuevos para las reglas)', () => {
  const doc = presupuestoDoc(cart, { comment: 'Medidas: 80 cm de ancho' });
  assert.equal(doc.detalle, `${quoteLines(cart)}\nComentarios o medidas: Medidas: 80 cm de ancho`);
  assert.deepEqual(Object.keys(doc).sort(), ['detalle', 'kind', 'name', 'totalQty', 'zone']);
  assert.notEqual(presupuestoKey(doc), presupuestoKey(presupuestoDoc(cart)));
});

test('presupuestoKey cambia cuando cambia el pedido y se repite cuando es el mismo', () => {
  const a = presupuestoKey(presupuestoDoc(cart, { name: 'Juan' }));
  assert.equal(a, presupuestoKey(presupuestoDoc(cart, { name: 'Juan' })));
  assert.notEqual(a, presupuestoKey(presupuestoDoc(cart, { name: 'Juana' })));
  assert.notEqual(a, presupuestoKey(presupuestoDoc(cart.slice(0, 1), { name: 'Juan' })));
});

const leads = [
  { id: '1', name: 'Martín Pérez', zone: 'San Martín', message: 'Quiero dos sillones', estado: 'nueva' },
  { id: '2', name: 'Ana', zone: 'Palermo', message: 'Bases de mesa para un bar', estado: 'respondida', nota: 'Factura A' },
  { id: '3', name: 'Local Centro', detalle: '1. Banco BKF - 4 unidades', estado: 'archivada' },
  { id: '4', name: 'Sin estado', message: 'Cargado a mano' },
];

test('normalize ignora mayúsculas y tildes', () => {
  assert.equal(normalize('San MARTÍN'), 'san martin');
});

test('estadoOf trata como nuevo lo que no tiene un estado válido', () => {
  assert.equal(estadoOf(leads[3]), 'nueva');
  assert.equal(estadoOf({ estado: 'hackeado' }), 'nueva');
  assert.equal(estadoOf(leads[1]), 'respondida');
});

test('filterLeads filtra por estado', () => {
  assert.deepEqual(filterLeads(leads, { estado: 'nueva' }).map((l) => l.id), ['1', '4']);
  assert.deepEqual(filterLeads(leads, { estado: 'todas' }).length, 4);
});

test('filterLeads busca sin tildes, en varios campos y exige todas las palabras', () => {
  assert.deepEqual(filterLeads(leads, { search: 'martin' }).map((l) => l.id), ['1']);
  assert.deepEqual(filterLeads(leads, { search: 'factura' }).map((l) => l.id), ['2']);
  assert.deepEqual(filterLeads(leads, { search: 'banco bkf' }).map((l) => l.id), ['3']);
  assert.deepEqual(filterLeads(leads, { search: 'bar ana' }).map((l) => l.id), ['2']);
  assert.deepEqual(filterLeads(leads, { search: 'bar martin' }), []);
});

test('filterLeads combina estado y búsqueda', () => {
  assert.deepEqual(filterLeads(leads, { estado: 'respondida', search: 'martin' }), []);
  assert.deepEqual(filterLeads(leads, { estado: 'nueva', search: 'sillones' }).map((l) => l.id), ['1']);
});

test('countByEstado cuenta cada estado y el total', () => {
  const counts = countByEstado(leads);
  assert.equal(counts.todas, 4);
  assert.equal(counts.nueva, 2);
  assert.equal(counts.respondida, 1);
  assert.equal(counts.archivada, 1);
  assert.equal(counts.en_curso, 0);
  assert.deepEqual(Object.keys(counts).sort(), ['todas', ...ESTADO_KEYS].sort());
});

test('toCsv escapa comillas y neutraliza fórmulas (inyección de CSV)', () => {
  const csv = toCsv(
    [{ name: 'Dijo "hola"', message: '=HYPERLINK("http://malo")' }, { name: 'Ana', message: '+54 11' }],
    [{ label: 'Nombre', value: (i) => i.name }, { label: 'Mensaje', value: (i) => i.message }],
  );
  const lines = csv.replace('﻿', '').split('\r\n');
  assert.equal(lines[0], '"Nombre";"Mensaje"');
  assert.equal(lines[1], '"Dijo ""hola""";"\'=HYPERLINK(""http://malo"")"');
  assert.equal(lines[2], '"Ana";"\'+54 11"');
  assert.ok(csv.startsWith('﻿'));
});
