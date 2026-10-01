/**
 * Fuente única de verdad de los productos del catálogo.
 *
 * La consumen: Catalogo.jsx (grid + modal), Categoria.jsx, Producto.jsx,
 * routes.js (para generar las URLs prerenderizables), lib/schema.js (JSON-LD)
 * y el llms.txt que genera scripts/prerender.js.
 *
 * Solo contiene propiedades verificables dentro del proyecto (no hay
 * precio numérico, SKU, GTIN, stock exacto ni rating: el sitio funciona a
 * cotización por WhatsApp, sin esos datos). Cada dato de `facts` sale de
 * `specs`, de la ficha del Sillón BKF o de las páginas de Garantía y Envíos.
 *
 * `width`/`height` son las dimensiones reales del archivo en
 * public/images (verificadas con `file`), no valores inventados.
 *
 * Precio (opcional): si un producto lleva `price: { amount, currency: 'ARS',
 * validUntil?: 'AAAA-MM-DD', note?: '…' }`, la ficha lo muestra y el JSON-LD
 * emite price/priceCurrency (ver offerNode en lib/schema.js). Hoy ningún producto
 * lo tiene porque el sitio cotiza por WhatsApp: no se inventa.
 *
 * Campos de contenido:
 *  - definition: respuesta directa a "¿qué es?". Va arriba de la ficha, en el
 *    meta description del schema y es la frase citable del producto.
 *  - facts: filas de la tabla "Ficha técnica" (y additionalProperty del schema).
 *  - faq: preguntas que la ficha contesta con sus propios datos.
 *
 * Los imports llevan extensión .js: este archivo lo carga Node directo.
 */

/** Garantía que publica /garantia/ para toda pieza de hierro. */
const GARANTIA_HIERRO = 'Estructura de hierro de por vida; pintura epoxi 2 años';

/**
 * Categorías del catálogo. `key` coincide con `category` de cada producto.
 * Cada una tiene su propia página (/catalogo/<slug>/): antes los filtros
 * Asientos/Mesas eran solo estado de React, sin URL que un buscador o una IA
 * pudieran rastrear.
 */
export const CATEGORIES = [
  {
    key: 'asientos',
    slug: 'asientos',
    name: 'Asientos',
    heading: 'Sillones y bancos BKF de hierro y cuero',
    seoTitle: 'Sillones y Bancos BKF de Hierro y Cuero | Taller Kappa',
    seoDescription: 'Sillón BKF Premium y Banco BKF de Taller Kappa: hierro macizo de 12 mm y cuero. Medidas, materiales y cotización. Fábrica en San Martín, Buenos Aires.',
    definition: 'Los asientos de Taller Kappa son el sillón BKF y el banco BKF: piezas de estructura de hierro macizo de 12 mm y asiento de cuero, fabricadas en San Martín, Buenos Aires.',
    difference: 'Comparten diseño y materiales y se diferencian por tamaño y uso: el Sillón BKF Premium mide 78 x 70 x 90 cm y el Banco BKF, 38 x 38 x 45 cm, y se usa como pie de cama o asiento auxiliar.',
  },
  {
    key: 'mesas',
    slug: 'mesas',
    name: 'Mesas',
    heading: 'Bases de mesa de hierro para mesas y barras',
    seoTitle: 'Bases de Mesa de Hierro para Bares y Restaurantes | Taller Kappa',
    seoDescription: 'Base de Mesa Flat de Taller Kappa: chapa torneada de 10 mm, en altura de mesa (73 cm) y de barra (105 cm). Uso gastronómico. San Martín, Buenos Aires.',
    definition: 'En mesas, Taller Kappa fabrica la Base de Mesa Flat: una base de chapa torneada de 10 mm con columna central, en altura de mesa (73 cm) y de barra (105 cm), pensada para uso gastronómico intenso, como en bares y restaurantes.',
    difference: 'El catálogo incluye la base de mesa; el sitio no publica tapas. Para otros modelos o medidas de mesa, la consulta se hace por WhatsApp.',
  },
];

export const PRODUCTS = [
  {
    id: '1',
    slug: 'sillon-bkf-premium',
    category: 'asientos',
    name: 'Sillón BKF Premium',
    alternateName: ['Sillón BKF', 'Silla BKF', 'Silla paleta', 'Butterfly chair'],
    seoTitle: 'Sillón BKF Premium de Hierro y Cuero | Taller Kappa',
    seoDescription: 'Sillón BKF Premium: hierro macizo de 12 mm y cuero vacuno curtido al vegetal, 78 x 70 x 90 cm. Fabricado por Taller Kappa en San Martín, Buenos Aires.',
    image: '/images/sillon-bkf-hierro-cuero.jpg',
    imageWidth: 1600,
    imageHeight: 1600,
    alt: 'Sillón BKF Premium de hierro negro y cuero suela, fabricado por Taller Kappa',
    badge: 'Diseño icónico',
    stock: true,
    desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
    definition: 'El Sillón BKF Premium es un sillón de estructura de hierro redondo macizo de 12 mm y funda de cuero vacuno curtido al vegetal, que Taller Kappa fabrica en San Martín, Buenos Aires. Sigue el diseño BKF creado en 1938 por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.',
    material: 'Hierro redondo macizo de 12 mm y cuero vacuno curtido al vegetal',
    specs: ['Hierro redondo macizo 12mm', 'Cuero vacuno de 1ra', 'Pintura epoxi o cromado', 'Medidas: 78x70x90 cm'],
    facts: [
      ['Categoría', 'Asientos (sillones BKF)'],
      ['Estructura', 'Hierro redondo macizo de 12 mm'],
      ['Tapizado', 'Cuero vacuno de primera selección, curtido al vegetal'],
      ['Terminación', 'Pintura epoxi anticorrosiva de doble capa o cromado'],
      ['Colores', 'Negro mate, blanco, cromado y colores a pedido'],
      ['Medidas', '78 x 70 x 90 cm (estándar); a medida sin costo adicional'],
      ['Uso', 'Residencial e intensivo gastronómico'],
      ['Garantía', 'Estructura de por vida; pintura epoxi 2 años; cuero 1 año'],
      ['Precio', 'Cotización por WhatsApp'],
    ],
    faq: [
      { q: '¿Qué medidas tiene el Sillón BKF Premium?', a: 'Mide 78 x 70 x 90 cm en su versión estándar. También se fabrica a medida, sin costo adicional.' },
      { q: '¿De qué está hecho el Sillón BKF Premium?', a: 'Tiene estructura de hierro redondo macizo de 12 mm, funda de cuero vacuno de primera selección curtido al vegetal y pintura epoxi anticorrosiva de doble capa, o cromado.' },
    ],
  },
  {
    id: '2',
    slug: 'banco-bkf',
    category: 'asientos',
    name: 'Banco BKF',
    alternateName: ['Banco BKF de hierro y cuero', 'Banqueta BKF'],
    seoTitle: 'Banco BKF de Hierro y Cuero | Taller Kappa',
    seoDescription: 'Banco BKF de hierro macizo de 12 mm, 38 x 38 x 45 cm: pie de cama o asiento auxiliar en la línea del sillón BKF. Fabricado por Taller Kappa en San Martín.',
    image: '/images/banco-bkf-hierro-cuero.jpg',
    imageWidth: 1024,
    imageHeight: 1024,
    alt: 'Dos bancos BKF de hierro negro y asiento de cuero, fabricados por Taller Kappa',
    badge: 'Ideal para regalo',
    stock: true,
    desc: 'El complemento ideal de diseño. Versatilidad y resistencia en tamaño compacto, siguiendo la línea BKF.',
    definition: 'El Banco BKF es un banco bajo (una banqueta) de hierro macizo de 12 mm y asiento de cuero que sigue la línea del sillón BKF en formato compacto: 38 x 38 x 45 cm. Taller Kappa lo fabrica en San Martín, Buenos Aires, para usarlo como pie de cama o asiento auxiliar.',
    material: 'Hierro macizo de 12 mm y asiento de cuero',
    specs: ['Hierro macizo 12mm', 'Altura 45cm', 'Ideal pie de cama o auxiliar', 'Medidas: 38x38x45 cm'],
    facts: [
      ['Categoría', 'Asientos (bancos BKF)'],
      ['Estructura', 'Hierro macizo de 12 mm'],
      ['Medidas', '38 x 38 x 45 cm (altura 45 cm)'],
      ['Uso', 'Pie de cama o asiento auxiliar'],
      ['Garantía', GARANTIA_HIERRO],
      ['Precio', 'Cotización por WhatsApp'],
    ],
    faq: [
      { q: '¿Qué medidas tiene el Banco BKF?', a: 'Mide 38 x 38 x 45 cm; su altura es de 45 cm.' },
      { q: '¿Para qué se usa el Banco BKF?', a: 'Se usa como pie de cama o como asiento auxiliar. Sigue la línea del sillón BKF en un tamaño compacto.' },
    ],
  },
  {
    id: '3',
    slug: 'base-de-mesa-flat',
    category: 'mesas',
    name: 'Base de Mesa Flat',
    alternateName: ['Base de mesa de hierro', 'Base Flat'],
    seoTitle: 'Base de Mesa Flat para Mesas y Barras | Taller Kappa',
    seoDescription: 'Base de Mesa Flat: chapa de 10 mm, columna de 77/101 mm, altura de mesa (73 cm) o de barra (105 cm). Para uso gastronómico. Taller Kappa, San Martín.',
    image: '/images/base-mesa-flat-hierro.jpg',
    imageWidth: 1024,
    imageHeight: 1536,
    alt: 'Base de Mesa Flat de hierro negro con columna central y base circular, fabricada por Taller Kappa',
    badge: 'Uso gastronómico',
    stock: true,
    desc: 'Base de chapa torneada pesada que evita el balanceo, pensada para uso gastronómico intenso.',
    definition: 'La Base de Mesa Flat es una base de mesa de chapa torneada de 10 mm con columna central de 77 o 101 mm, que Taller Kappa fabrica en San Martín, Buenos Aires, para uso gastronómico, como mesas de bares y restaurantes. Se ofrece en altura de mesa (73 cm) y de barra (105 cm), admite tapas grandes y su base pesada evita el balanceo.',
    material: 'Chapa torneada de 10 mm con columna central de 77 o 101 mm',
    specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes'],
    facts: [
      ['Categoría', 'Mesas (bases de mesa)'],
      ['Estructura', 'Base de chapa torneada de 10 mm con columna central de 77 o 101 mm'],
      ['Medidas', 'Altura de mesa 73 cm; altura de barra 105 cm'],
      ['Uso', 'Gastronómico intenso; admite tapas grandes'],
      ['Garantía', GARANTIA_HIERRO],
      ['Precio', 'Cotización por WhatsApp'],
    ],
    faq: [
      { q: '¿Qué alturas tiene la Base de Mesa Flat?', a: 'Se ofrece en dos alturas: 73 cm para mesa y 105 cm para barra.' },
      { q: '¿La Base de Mesa Flat sirve para uso gastronómico?', a: 'Sí, está pensada para eso: es una base de chapa torneada pesada de 10 mm que evita el balanceo y admite tapas grandes.' },
    ],
  },
];

/** "$ 123.456" a partir de `product.price`, o null si el producto no publica precio. */
export function formatPrice(product) {
  const price = product.price;
  if (!price?.amount) return null;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: price.currency ?? 'ARS', maximumFractionDigits: 0 }).format(price.amount);
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) ?? null;
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function productsInCategory(key) {
  return PRODUCTS.filter((p) => p.category === key);
}

/** Valor de una fila de `facts` ("Medidas", "Uso"…), o null. */
export function factOf(product, label) {
  return product.facts?.find(([l]) => l === label)?.[1] ?? null;
}

/**
 * Productos relacionados: primero los de la misma categoría y después el
 * resto. Es el mismo orden que se usa en los enlaces y en `isRelatedTo`.
 */
export function relatedProducts(product) {
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);
  return [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)];
}
