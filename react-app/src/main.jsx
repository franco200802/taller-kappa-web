import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { matchRoutes } from 'react-router-dom';
import App from './App.jsx';
import { PAGE_LOADERS, ROUTES } from './routes';
import './styles/global.css';

// GitHub Pages sirve /index.html y /<ruta>/index.html con 200 (el mismo HTML
// que /<ruta>/), pero el router no tiene esas rutas: sin esto, al hidratar
// se renderizaba <NotFound> encima de la página (error #418) y Helmet le
// ponía noindex. Se limpia la URL antes de que el router lea la ubicación.
{
  const { pathname, search, hash } = window.location;
  if (pathname.endsWith('/index.html')) {
    window.history.replaceState(window.history.state, '', pathname.slice(0, -'index.html'.length) + search + hash);
  }
}

// La página de la URL de entrada se descarga ANTES de hidratar y se le pasa a App ya resuelta.
// Con React.lazy, la hidratación arrancaba sin el chunk de la página: el <Suspense> de Layout quedaba
// a medio hidratar y la primera actualización de estado lo pasaba a render de cliente (error #421),
// tirando el HTML prerenderizado. Si la descarga falla, se sigue con lazy() como antes.
async function loadInitialPage() {
  const routes = ROUTES.map(({ path, page }) => ({ path, page, caseSensitive: true }));
  const name = matchRoutes(routes, window.location.pathname)?.[0]?.route.page ?? 'NotFound';
  try {
    const mod = await PAGE_LOADERS[name]();
    return { name, Component: mod.default };
  } catch {
    return null;
  }
}

const container = document.getElementById('root');

loadInitialPage().then((initialPage) => {
  const app = (
    <StrictMode>
      <App initialPage={initialPage} />
    </StrictMode>
  );

  // Las rutas públicas llegan con HTML ya renderizado por scripts/prerender.js.
  // En ese caso hidratamos (conservamos el DOM existente); si el contenedor
  // está vacío (404.html o dev server) montamos desde cero.
  if (container.hasChildNodes()) {
    hydrateRoot(container, app);
  } else {
    createRoot(container).render(app);
  }
});
