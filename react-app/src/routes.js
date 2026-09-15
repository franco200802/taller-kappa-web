/**
 * Fuente única de verdad de las rutas del sitio.
 *
 * La usan tres consumidores distintos y por eso vive en su propio módulo:
 *  1. App.jsx        → construye las rutas del cliente con React.lazy()
 *  2. entry-server.jsx → resuelve los módulos de forma eager para poder
 *                        renderizar a string (renderToString no puede
 *                        suspender esperando un lazy())
 *  3. scripts/prerender.js → sabe qué rutas escribir en disco
 *
 * Si se agrega una página nueva, se agrega acá y los tres lados quedan
 * sincronizados automáticamente.
 */

import { PRODUCTS } from './data/products.js';

export const PAGE_LOADERS = {
  Home: () => import('./pages/Home'),
  Catalogo: () => import('./pages/Catalogo'),
  Producto: () => import('./pages/Producto'),
  SillonBKF: () => import('./pages/SillonBKF'),
  Proyectos: () => import('./pages/Proyectos'),
  Nosotros: () => import('./pages/Nosotros'),
  FAQ: () => import('./pages/FAQ'),
  Contacto: () => import('./pages/Contacto'),
  Envios: () => import('./pages/Envios'),
  Garantia: () => import('./pages/Garantia'),
  Admin: () => import('./pages/Admin'),
  NotFound: () => import('./pages/NotFound'),
};

/**
 * `prerender: false` → la ruta existe en el router pero NO se escribe
 * HTML estático para ella (páginas privadas o comodines).
 *
 * Admin además importa Firebase de forma estática, así que nunca debe
 * resolverse durante el build de SSR.
 *
 * `/catalogo/:slug` tampoco lleva `prerender: true` acá: es un patrón,
 * no una URL real. Las URLs concretas de cada producto (una por slug)
 * se agregan más abajo a partir de `PRODUCTS`, que es la misma fuente
 * de datos que usa Catalogo.jsx y Producto.jsx.
 */
export const ROUTES = [
  { path: '/', page: 'Home', prerender: true },
  { path: '/catalogo', page: 'Catalogo', prerender: true },
  { path: '/catalogo/:slug', page: 'Producto', prerender: false },
  { path: '/sillon-bkf', page: 'SillonBKF', prerender: true },
  { path: '/proyectos', page: 'Proyectos', prerender: true },
  { path: '/nosotros', page: 'Nosotros', prerender: true },
  { path: '/faq', page: 'FAQ', prerender: true },
  { path: '/contacto', page: 'Contacto', prerender: true },
  { path: '/envios', page: 'Envios', prerender: true },
  { path: '/garantia', page: 'Garantia', prerender: true },
  { path: '/admin', page: 'Admin', prerender: false },
];

/**
 * URLs concretas de producto (una por cada slug real en PRODUCTS).
 * Se generan desde la misma fuente de datos para no duplicar la lista
 * de productos en ningún otro lado.
 */
const PRODUCT_PATHS = PRODUCTS.map((p) => `/catalogo/${p.slug}`);

/** Rutas que sí se escriben como HTML estático en dist/. */
export const PRERENDER_PATHS = [
  ...ROUTES.filter((r) => r.prerender).map((r) => r.path),
  ...PRODUCT_PATHS,
];
