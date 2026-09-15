/**
 * Fuente única de verdad de los productos del catálogo.
 *
 * La consumen: Catalogo.jsx (grid + modal), Producto.jsx (página individual),
 * routes.js (para generar las URLs prerenderizables /catalogo/:slug).
 *
 * Solo contiene propiedades verificables dentro del proyecto (no hay
 * precio numérico, SKU, stock exacto ni rating: el sitio funciona a
 * cotización por WhatsApp, sin esos datos).
 *
 * `width`/`height` son las dimensiones reales del archivo en
 * public/images (verificadas con `file`), no valores inventados.
 */
export const PRODUCTS = [
  {
    id: '1',
    slug: 'sillon-bkf-premium',
    category: 'asientos',
    name: 'Sillón BKF Premium',
    image: '/images/bkf1.jpg',
    imageWidth: 1600,
    imageHeight: 1600,
    badge: 'Diseño icónico',
    stock: true,
    desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
    specs: ['Hierro redondo macizo 12mm', 'Cuero Vacuno de 1ra', 'Pintura Epoxi o Cromado', 'Medidas: 78x70x90 cm'],
  },
  {
    id: '2',
    slug: 'banco-bkf',
    category: 'asientos',
    name: 'Banco BKF',
    image: '/images/bkfapoyapies.jpg',
    imageWidth: 1024,
    imageHeight: 1024,
    badge: 'Ideal para regalo',
    stock: true,
    desc: 'El complemento ideal de diseño. Versatilidad y resistencia en tamaño compacto, siguiendo la línea BKF.',
    specs: ['Hierro macizo 12mm', 'Altura 45cm', 'Ideal pie de cama o auxiliar', 'Medidas: 38x38x45 cm'],
  },
  {
    id: '3',
    slug: 'base-de-mesa-flat',
    category: 'mesas',
    name: 'Base de Mesa Flat',
    image: '/images/mesa.jpeg',
    imageWidth: 1024,
    imageHeight: 1536,
    badge: 'Uso gastronómico',
    stock: true,
    desc: 'Estabilidad garantizada para uso gastronómico intenso. Base de chapa torneada pesada que evita el balanceo.',
    specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes'],
  },
];

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}
