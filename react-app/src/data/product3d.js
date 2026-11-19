/**
 * El 3D de cada producto: qué se puede elegir (acabado, cuero, altura…), las etiquetas de las cotas, cómo se escribe
 * la elección en el presupuesto y los textos del showroom (4 capítulos, uno por keyframe de STAGE_KF en
 * lib/product3d.js). Todo sale de data/products.js y de lo que ya publica cada ficha: no agregar datos nuevos acá.
 *
 * Opciones: `items` con `name` (lo que se ve y viaja en el presupuesto) y, según el tipo, `swatch` (color) o `value`.
 */
import { FINISH_COLORS, LEATHER_COLORS, getProductBySlug } from './products';

const SILLON = getProductBySlug('sillon-bkf-premium');
const BANCO = getProductBySlug('banco-bkf');
const BASE = getProductBySlug('base-de-mesa-flat');

// Acabados de la estructura: la FAQ de asientos los publica para sillones y bancos.
const FINISH_OPTION = { key: 'finish', type: 'swatch', label: 'Estructura', ariaLabel: 'Acabado de la estructura', items: FINISH_COLORS, initial: 'Negro Mate' };
// Cuero negro, marrón o natural: lo publica la FAQ del sillón; para el banco, confirmado por el dueño el 19/11/2026.
const leatherOption = (initial) => ({ key: 'leather', type: 'swatch', label: 'Cuero', ariaLabel: 'Color del cuero', items: LEATHER_COLORS, initial });
// "Negro Mate, cuero marrón": en inglés lo traduce la regla COLOR_WITH_LEATHER de i18n/translate.js.
const finishWithLeather = (v) => `${v.finish}, cuero ${v.leather.toLowerCase()}`;

const boxLabels = ({ width, depth, height }) => [
  { key: 'width', text: 'Ancho', value: width, unit: 'cm' },
  { key: 'depth', text: 'Profundidad', value: depth, unit: 'cm' },
  { key: 'height', text: 'Alto', value: height, unit: 'cm' },
];
const boxSize = ({ width, depth, height }) => `${width} x ${depth} x ${height} cm`;

const [MESA, BARRA] = BASE.dimensions.heights;
const HEIGHT_ITEMS = [{ name: `Mesa (${MESA} cm)`, value: MESA }, { name: `Barra (${BARRA} cm)`, value: BARRA }];
const COLUMN_ITEMS = BASE.dimensions.columnsMm.map((mm) => ({ name: `${mm} mm`, value: mm }));
const valueOf = (items, name) => items.find((i) => i.name === name)?.value;

export const PRODUCT_3D = {
  'sillon-bkf-premium': {
    options: [FINISH_OPTION, leatherOption('Marrón')],
    labels: () => boxLabels(SILLON.dimensions),
    describe: finishWithLeather,
    caption: () => [`Modelo 3D a escala: ${boxSize(SILLON.dimensions)}`],
    fallback: { src: '/images/sillon-bkf-cuero-en-casa.jpg', width: 960, height: 1200 },
    showroom: {
      id: 'bkf-3d',
      word: 'BKF',
      eyebrow: 'Sillón BKF en 3D',
      link: { to: '/sillon-bkf/', label: 'Ver el sillón BKF' },
      chapters: [
        { title: 'Así es el sillón BKF, pieza por pieza', text: 'Es un diseño argentino de 1938, creado por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy. Lo fabricamos en nuestro taller de San Martín siguiendo ese diseño.' },
        { eyebrow: 'Estructura', title: 'Hierro redondo macizo de 12 mm', text: 'Sin tubos ni rellenos: varilla maciza, con garantía de por vida contra deformaciones.' },
        { eyebrow: 'Tapizado', title: 'Cuero vacuno curtido al vegetal', text: 'Cuero de primera selección que toma color con el uso. Se pide en negro, marrón o natural, con garantía de 1 año contra defectos de fabricación.' },
        { eyebrow: 'Medidas y acabados', title: `${boxSize(SILLON.dimensions)}, en el acabado que elijas`, text: 'Ancho, profundidad y alto de la versión estándar. También se fabrica a medida, sin costo adicional.' },
      ],
    },
  },

  'banco-bkf': {
    // Arranca en cuero natural, el de la foto del banco.
    options: [FINISH_OPTION, leatherOption('Natural')],
    labels: () => boxLabels(BANCO.dimensions),
    describe: finishWithLeather,
    caption: () => [`Modelo 3D a escala: ${boxSize(BANCO.dimensions)}`],
    fallback: { src: BANCO.image, width: BANCO.imageWidth, height: BANCO.imageHeight },
    showroom: {
      id: 'banco-3d',
      word: 'BKF',
      eyebrow: 'Banco BKF en 3D',
      chapters: [
        { title: 'El banco BKF, pieza por pieza', text: 'Sigue la línea del sillón BKF en formato compacto. Se usa como pie de cama o como asiento auxiliar.' },
        { eyebrow: 'Estructura', title: 'Hierro macizo de 12 mm', text: 'La misma varilla maciza del sillón, en un formato más chico. La estructura de hierro tiene garantía de por vida.' },
        { eyebrow: 'Tapizado', title: 'Asiento de cuero', text: 'El asiento cuelga de las cuatro puntas, como el cuero del sillón. Se pide en negro, marrón o natural, con garantía de 1 año.' },
        { eyebrow: 'Medidas y acabados', title: `${boxSize(BANCO.dimensions)}, en el acabado que elijas`, text: 'Ancho, profundidad y alto. Se fabrica en otros colores y medidas a pedido, sin costo adicional.' },
      ],
    },
  },

  'base-de-mesa-flat': {
    options: [
      { key: 'height', type: 'segmented', label: 'Altura', ariaLabel: 'Altura de la base', items: HEIGHT_ITEMS, initial: HEIGHT_ITEMS[0].name },
      { key: 'column', type: 'segmented', label: 'Columna', ariaLabel: 'Diámetro de la columna', items: COLUMN_ITEMS, initial: COLUMN_ITEMS[0].name },
    ],
    labels: (v) => [
      { key: 'height', text: 'Alto', value: valueOf(HEIGHT_ITEMS, v.height), unit: 'cm' },
      { key: 'column', text: 'Columna', value: valueOf(COLUMN_ITEMS, v.column), unit: 'mm' },
      { key: 'plate', text: 'Chapa', value: BASE.dimensions.plateMm, unit: 'mm' },
    ],
    describe: (v) => `${v.height}, columna de ${v.column}`,
    // El diámetro del disco no se publica: el pie dice solo lo que es exacto.
    caption: (v) => ['Modelo 3D:', ' ', valueOf(HEIGHT_ITEMS, v.height), ' cm de alto, columna de ', valueOf(COLUMN_ITEMS, v.column), ' mm'],
    fallback: { src: BASE.image, width: BASE.imageWidth, height: BASE.imageHeight },
    showroom: {
      id: 'base-3d',
      word: 'FLAT',
      eyebrow: 'Base de Mesa Flat en 3D',
      chapters: [
        { title: 'La Base de Mesa Flat, pieza por pieza', text: 'Una base de hierro pensada para uso gastronómico intenso, como en bares y restaurantes. Admite tapas grandes.' },
        { eyebrow: 'Base', title: `Chapa torneada de ${BASE.dimensions.plateMm} mm`, text: 'Es una base pesada: evita que la mesa se balancee.' },
        { eyebrow: 'Columna', title: `Columna central de ${COLUMN_ITEMS[0].value} o ${COLUMN_ITEMS[1].value} mm`, text: 'Une la base con el soporte de la tapa y se ofrece en dos diámetros.' },
        { eyebrow: 'Alturas', title: `${MESA} cm para mesa o ${BARRA} cm para barra`, text: 'Las dos alturas de la ficha. Para otras medidas de mesa, consultanos por WhatsApp.' },
      ],
    },
  },
};

/** Estado inicial de las opciones: { finish: 'Negro Mate', … }. */
export const initialValues = (cfg) => Object.fromEntries(cfg.options.map((o) => [o.key, o.initial]));

/** De nombres elegidos a los ítems completos que necesita el 3D: { finish: { name, swatch }, … }. */
export const selectedItems = (cfg, values) =>
  Object.fromEntries(cfg.options.map((o) => [o.key, o.items.find((i) => i.name === values[o.key])]));
