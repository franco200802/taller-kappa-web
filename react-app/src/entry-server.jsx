import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import AppRoutes from './AppRoutes';
import { PAGE_LOADERS, ROUTES } from './routes';

/**
 * Entry de prerenderizado (SSG en build time — no hay servidor en runtime).
 *
 * Resuelve de forma EAGER las páginas marcadas con `prerender: true`, más
 * `Producto`: su entrada en ROUTES lleva `prerender: false` porque
 * '/catalogo/:slug' es un patrón, no una URL real, pero sí necesitamos el
 * componente cargado para poder prerenderizar cada URL concreta de
 * producto (ver PRODUCT_PATHS en routes.js).
 *
 * Admin queda fuera a propósito: importa Firebase de forma estática y no
 * queremos que initializeApp() se ejecute durante el build.
 */
async function loadComponents() {
  const entries = await Promise.all(
    ROUTES.filter((r) => r.prerender || r.page === 'Producto').map(async ({ page }) => {
      const mod = await PAGE_LOADERS[page]();
      return [page, mod.default];
    })
  );
  const components = Object.fromEntries(entries);
  // NotFound se usa para la ruta comodín dentro del Layout.
  components.NotFound = (await PAGE_LOADERS.NotFound()).default;
  return components;
}

let componentsPromise = null;

/**
 * Renderiza una ruta a HTML + los tags que react-helmet-async recolectó.
 * @param {string} url ruta absoluta, ej. '/sillon-bkf'
 */
export async function render(url) {
  componentsPromise ??= loadComponents();
  const components = await componentsPromise;

  // helmetContext se llena durante renderToString con los tags que
  // cada página declaró vía <Seo> (title, description, canonical, JSON-LD).
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <CartProvider>
        <StaticRouter location={url}>
          <AppRoutes components={components} />
        </StaticRouter>
      </CartProvider>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet };
}
