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
    /** Cómo se nombra la categoría en el mensaje de WhatsApp ("quiero consultar precios de …"). */
    quoteLabel: 'sillones y bancos BKF',
    heading: 'Sillones y bancos BKF de hierro y cuero',
    seoTitle: 'Sillones y Bancos BKF en Buenos Aires | Hierro y Cuero | Taller Kappa',
    seoDescription: 'Sillón BKF Premium y Banco BKF de Taller Kappa: hierro macizo de 12 mm y cuero. Medidas, materiales y cotización. Fábrica en San Martín, Buenos Aires.',
    definition: 'Los asientos de Taller Kappa son el sillón BKF y el banco BKF: piezas de estructura de hierro macizo de 12 mm y asiento de cuero, fabricadas en San Martín, Buenos Aires.',
    faq: [
      { q: '¿Para qué espacios sirven los sillones y bancos BKF de Taller Kappa?', a: 'Para interiores residenciales y para locales gastronómicos con uso intensivo. El banco BKF, además, se usa como pie de cama o asiento auxiliar.' },
      { q: '¿Los sillones y bancos BKF se pueden pedir en otros colores o medidas?', a: 'Sí. Se fabrican con colores y medidas a pedido, sin costo adicional. Los acabados habituales de la estructura son negro mate, blanco crema y cromado.' },
    ],
    difference: 'Comparten diseño y materiales y se diferencian por tamaño y uso: el Sillón BKF Premium mide 77 x 87 x 102 cm y el Banco BKF, 38 x 38 x 45 cm, y se usa como pie de cama o asiento auxiliar.',
  },
  {
    key: 'mesas',
    slug: 'mesas',
    name: 'Mesas',
    // Antes el mensaje decía "consultar precios de mesas", y el taller no vende mesas: vende la base.
    quoteLabel: 'bases de mesa',
    heading: 'Bases de mesa de hierro para mesas y barras',
    seoTitle: 'Bases de Mesa de Hierro en Buenos Aires | Taller Kappa',
    seoDescription: 'Base de Mesa Flat de Taller Kappa: chapa torneada de 10 mm, en altura de mesa (73 cm) y de barra (105 cm). Uso gastronómico. San Martín, Buenos Aires.',
    definition: 'En mesas, Taller Kappa fabrica la Base de Mesa Flat: una base de chapa torneada de 10 mm con columna central, en altura de mesa (73 cm) y de barra (105 cm), pensada para uso gastronómico intenso, como en bares y restaurantes.',
    faq: [
      { q: '¿Existe una mesa BKF?', a: 'BKF es el nombre de un diseño de sillón, formado por las iniciales de Bonet, Kurchan y Ferrari Hardoy. Taller Kappa no vende una "mesa BKF": en mesas fabrica la Base de Mesa Flat, y del diseño BKF fabrica el sillón y el banco.' },
      { q: '¿La Base de Mesa Flat incluye la tapa de la mesa?', a: 'El catálogo del sitio ofrece la base, que admite tapas grandes. Para consultar por tapas u otras medidas de mesa, escribinos por WhatsApp.' },
      // 12 de las 17 consultas por WhatsApp del sitio salieron de páginas para locales (GA4, 28/10 al 24/11/2026).
      // Prueba ya publicada en /proyectos/ (YPF Full). Desde el 25/11/2026 el envío se cotiza siempre según la zona
      // y no se publica el tipo de factura (pedido del dueño).
      { q: '¿Venden bases de mesa por cantidad para locales gastronómicos?', a: 'Sí. Taller Kappa fabricó y entregó bases de mesa Flat para las tiendas YPF Full. Se cotizan por cantidad, y el costo de envío depende de la zona de entrega.' },
    ],
    difference: 'El catálogo incluye la base de mesa; el sitio no publica tapas. Para otros modelos o medidas de mesa, la consulta se hace por WhatsApp.',
  },
];

export const PRODUCTS = [
  {
    id: '1',
    slug: 'sillon-bkf-premium',
    // URL canónica propia: el Sillón BKF vive en la landing comercial y NO tiene ficha aparte, para que
    // una sola página compita por "sillón BKF" (antes había dos con casi el mismo contenido).
    // /catalogo/sillon-bkf-premium/ queda como redirección (ver LEGACY_PAGES en scripts/prerender.js).
    path: '/sillon-bkf',
    category: 'asientos',
    name: 'Sillón BKF Premium',
    alternateName: ['Sillón BKF', 'Sillón BKF de cuero', 'Silla BKF', 'Silla paleta', 'Butterfly chair'],
    seoTitle: 'Sillón BKF Premium de Hierro y Cuero | Taller Kappa',
    seoDescription: 'Sillón BKF Premium: hierro macizo de 12 mm y cuero vacuno curtido al vegetal, 77 x 87 x 102 cm. Fabricado por Taller Kappa en San Martín, Buenos Aires.',
    image: '/images/sillon-bkf-hierro-cuero.jpg',
    imageWidth: 1600,
    imageHeight: 1600,
    alt: 'Sillón BKF Premium de hierro negro y cuero suela, fabricado por Taller Kappa',
    badge: 'Diseño icónico',
    stock: true,
    desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
    definition: 'El Sillón BKF Premium es un sillón de estructura de hierro redondo macizo de 12 mm y funda de cuero vacuno curtido al vegetal, que Taller Kappa fabrica en San Martín, Buenos Aires. Sigue el diseño BKF creado en 1938 por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.',
    material: 'Hierro redondo macizo de 12 mm y cuero vacuno curtido al vegetal',
    specs: ['Hierro redondo macizo 12mm', 'Cuero vacuno de 1ra', 'Pintura epoxi o cromado', 'Medidas: 77x87x102 cm'],
    // Medidas estándar en cm: las de FOTOCONMEDIDAS.png, confirmadas el 19/11/2026 como las reales. Las usa el
    // modelo 3D de /sillon-bkf/ para escalar la silla; si cambian, actualizar también los textos con "77 x 87 x 102".
    dimensions: { width: 77, depth: 87, height: 102 },
    facts: [
      ['Categoría', 'Asientos (sillones BKF)'],
      ['Estructura', 'Hierro redondo macizo de 12 mm'],
      ['Tapizado', 'Cuero vacuno de primera selección, curtido al vegetal'],
      ['Terminación', 'Pintura epoxi anticorrosiva de doble capa o cromado'],
      ['Colores', 'Negro mate, blanco crema, cromado y colores a pedido (como verde oliva o rojo Kappa)'],
      ['Medidas', '77 cm de ancho x 87 cm de profundidad x 102 cm de alto (estándar); a medida sin costo adicional'],
      ['Uso', 'Residencial e intensivo gastronómico'],
      ['Garantía', 'Estructura de por vida; pintura epoxi 2 años; cuero 1 año'],
      ['Precio', 'Cotización por WhatsApp'],
    ],
    faq: [
      { q: '¿Qué medidas tiene el Sillón BKF Premium?', a: 'Mide 77 cm de ancho, 87 cm de profundidad y 102 cm de alto en su versión estándar. También se fabrica a medida, sin costo adicional.' },
      { q: '¿De qué está hecho el Sillón BKF Premium?', a: 'Tiene estructura de hierro redondo macizo de 12 mm, funda de cuero vacuno de primera selección curtido al vegetal y pintura epoxi anticorrosiva de doble capa, o cromado.' },
    ],
  },
  {
    id: '2',
    slug: 'banco-bkf',
    category: 'asientos',
    name: 'Banco BKF',
    heading: 'Banco BKF de hierro y cuero, fabricado en Buenos Aires',
    alternateName: ['Banco BKF de hierro y cuero', 'Banqueta BKF'],
    seoTitle: 'Banco BKF de Hierro y Cuero en Buenos Aires | Taller Kappa',
    seoDescription: 'Banco BKF de hierro macizo de 12 mm y asiento de cuero, 38 x 38 x 45 cm: pie de cama o asiento auxiliar en la línea del sillón BKF. Hecho en San Martín.',
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
    // Medidas en cm (ancho, profundidad, alto): las de la ficha. Las usa el modelo 3D para escalar el banco.
    dimensions: { width: 38, depth: 38, height: 45 },
    facts: [
      ['Categoría', 'Asientos (bancos BKF)'],
      ['Estructura', 'Hierro macizo de 12 mm'],
      ['Tapizado', 'Asiento de cuero en negro, marrón o natural'],
      ['Medidas', '38 x 38 x 45 cm (altura 45 cm)'],
      ['Uso', 'Pie de cama o asiento auxiliar'],
      ['Garantía', `${GARANTIA_HIERRO}; cuero 1 año`],
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
    article: 'la',
    heading: 'Base de Mesa Flat de hierro, fabricada en Buenos Aires',
    alternateName: ['Base de mesa de hierro', 'Base Flat', 'Base de mesa para bar'],
    // Antes: "Base de Mesa Flat de Hierro en Buenos Aires", casi igual al de /catalogo/mesas/ y con el nombre del
    // modelo (que nadie busca) adelante. 29 impresiones y 0 clics en 28 días (Search Console, 26/10 al 22/11/2026).
    // Ahora dice el uso: "base de mesa de hierro" es la primera sugerencia de Google para "base de mesa" y "base para
    // mesa bar alta" / "base de metal para mesa de bar" aparecen al buscar "base para mesa de bar". La categoría sigue
    // apuntando a "bases de mesa de hierro" (y a "fábrica de bases", donde ya sale primera). Sin "| Taller Kappa" para
    // no pasar de 70 caracteres: Google muestra el nombre del sitio aparte.
    seoTitle: 'Base de Mesa de Hierro para Bar y Restaurante | Buenos Aires',
    seoDescription: 'Base de mesa de hierro para bares, restaurantes y franquicias: chapa de 10 mm, columna de 77 o 101 mm, alto de mesa (73 cm) o de barra (105 cm). Hecha en San Martín.',
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
    // Datos de la ficha que usa el modelo 3D: alturas en cm (mesa, barra), columnas y chapa en mm. El diámetro del
    // disco de la base no se publica: el 3D lo estima desde la foto y no lo rotula.
    dimensions: { heights: [73, 105], columnsMm: [77, 101], plateMm: 10 },
    facts: [
      ['Categoría', 'Mesas (bases de mesa)'],
      ['Estructura', 'Base de chapa torneada de 10 mm con columna central de 77 o 101 mm'],
      ['Medidas', 'Altura de mesa 73 cm; altura de barra 105 cm'],
      // Los mismos acabados que el sillón (confirmado por el dueño el 19/11/2026); el 3D los deja elegir.
      ['Colores', 'Negro mate, blanco crema, cromado y colores a pedido (como verde oliva o rojo Kappa)'],
      ['Uso', 'Gastronómico intenso; admite tapas grandes'],
      ['Garantía', GARANTIA_HIERRO],
      ['Precio', 'Cotización por WhatsApp'],
    ],
    faq: [
      { q: '¿Qué alturas tiene la Base de Mesa Flat?', a: 'Se ofrece en dos alturas: 73 cm para mesa y 105 cm para barra.' },
      { q: '¿La Base de Mesa Flat sirve para uso gastronómico?', a: 'Sí, está pensada para eso: es una base de chapa torneada pesada de 10 mm que evita el balanceo y admite tapas grandes.' },
      { q: '¿Sirve para una mesa alta o una barra?', a: 'Sí. La versión de barra mide 105 cm de alto; para una mesa común está la versión de 73 cm.' },
      { q: '¿La base incluye la tapa?', a: 'No: se vende la base, que admite tapas grandes. Para consultar por tapas u otras medidas de mesa, escribinos por WhatsApp.' },
    ],
    /**
     * Bloque "para locales" de la ficha (Producto.jsx → ProductBusiness). La prueba es la de /proyectos/ (YPF Full,
     * confirmada por el dueño el 1/10/2026). El envío se cotiza según la zona, como en /envios/; el tipo de factura
     * no se publica (pedido del dueño, 25/11/2026). Si cambian allá, cambiarlas acá.
     */
    business: {
      heading: 'Bases de mesa por cantidad para bares, restaurantes y franquicias',
      proof: 'Taller Kappa fabricó y entregó bases de mesa Flat para las tiendas YPF Full, con acabado epoxi negro mate.',
      terms: 'Para equipar un local se cotizan por cantidad, en la altura y el color que elijas. El costo de envío depende de la zona de entrega.',
      cta: 'Cotizar bases por cantidad',
      message: [
        'Hola, quiero cotizar bases de mesa Flat para un local.',
        '',
        'Rubro del local: ',
        'Cantidad y altura (mesa 73 cm o barra 105 cm): ',
        'Color: ',
        'Zona de entrega: ',
      ].join('\n'),
    },
  },
];

export const BASE_FLAT_SLUG = 'base-de-mesa-flat';
const { heights, columnsMm } = getProductBySlug(BASE_FLAT_SLUG).dimensions;
export const BASE_FLAT_HEIGHTS = [
  { name: `Mesa (${heights[0]} cm)`, value: heights[0] },
  { name: `Barra (${heights[1]} cm)`, value: heights[1] },
];
export const BASE_FLAT_COLUMNS = columnsMm.map((value) => ({ name: `${value} mm`, value }));
export const describeBaseFlat = ({ finish, height, column }) => [finish, height, `columna de ${column}`].filter(Boolean).join(', ');

/**
 * Acabados de la estructura que se pueden elegir al agregar al presupuesto (los mismos que
 * lista la ficha: negro mate, blanco crema, cromado y, a pedido, verde oliva o rojo Kappa).
 * `name` viaja tal cual en el mensaje de WhatsApp. Antes la lista estaba copiada en el
 * catálogo y en la landing del sillón.
 */
export const FINISH_COLORS = [
  { name: 'Negro Mate', swatch: '#1a1a1a' },
  { name: 'Blanco Crema', swatch: '#f5f0e8' },
  { name: 'Cromado', swatch: 'linear-gradient(135deg,#ccc,#fff,#aaa)' },
  { name: 'Verde Oliva', swatch: '#556b2f' },
  { name: 'Rojo Kappa', swatch: '#b71c1c' },
];

/**
 * Colores del cuero que publica la FAQ de /sillon-bkf/ ("negro, marrón, o cuero natural"). Los usa el modelo
 * 3D; `name` viaja en el mensaje del presupuesto junto con el acabado de la estructura.
 */
export const LEATHER_COLORS = [
  { name: 'Marrón', swatch: '#6e3a1f' },
  { name: 'Natural', swatch: '#b8783e' },
  { name: 'Negro', swatch: '#1e1c1b' },
];

/**
 * Variantes de la foto principal que genera scripts/build-social-images.sh:
 * 16:9 (1200x675, og:image y twitter:image) y 4:3 (1200x900). Junto con la
 * original (1:1), son las tres proporciones que Google pide para un Product.
 */
export const socialImage = (p) => p.image.replace(/\.jpg$/, '-16x9.jpg');
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 675 };
export const productImages = (p) => [
  { path: p.image, width: p.imageWidth, height: p.imageHeight },
  { path: p.image.replace(/\.jpg$/, '-4x3.jpg'), width: 1200, height: 900 },
  { path: socialImage(p), ...SOCIAL_IMAGE_SIZE },
];

/** "$ 123.456" a partir de `product.price`, o null si el producto no publica precio. */
export function formatPrice(product) {
  const price = product.price;
  if (!price?.amount) return null;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: price.currency ?? 'ARS', maximumFractionDigits: 0 }).format(price.amount);
}

/** Ruta canónica de un producto: la propia (`path`) o /catalogo/<slug>. */
export const productPath = (p) => p.path ?? `/catalogo/${p.slug}`;
/** Igual, con barra final: es la forma de los enlaces internos y de la URL canónica. */
export const productHref = (p) => `${productPath(p)}/`;

/** Producto cuya página es `pathname` (con o sin barra final), o null. */
export function productByPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return PRODUCTS.find((p) => productPath(p) === clean) ?? null;
}

/** "el Banco BKF" / "la Base de Mesa Flat" (`article` es opcional; por defecto "el"). */
export const theName = (p) => `${p.article ?? 'el'} ${p.name}`;
/** "del Banco BKF" / "de la Base de Mesa Flat". */
export const ofName = (p) => (p.article === 'la' ? `de la ${p.name}` : `del ${p.name}`);

/** Primer mensaje de WhatsApp para pedir el precio de un producto. */
export const priceQuestion = (p) => `Hola, quiero consultar el precio ${ofName(p)}.`;

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
